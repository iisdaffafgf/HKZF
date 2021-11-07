import React, { Component } from 'react'

import request from '../../network'
import { getCurrentCity } from '../../utils'
import './index.css'
export default class index extends Component {
    tiemr = null
    state = {
        city: {},
        searchResult: []
    }
    render() {
        return (
            <div>
                <div className="search_input">
                    <input type="text" placeholder="请输入小区关键字" onChange={this.inputSearch} />
                    <span className="cancel" onClick={() => this.props.history.goBack()}>取消</span>
                </div>
                {this.renderSearchResult()}
            </div>
        )
    }
    inputSearch = (e) => {
        const name = e.target.value;
        const { city: { value: id } } = this.state
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            request({
                url: '/area/community',
                params: { name, id }
            }).then(res => {
                this.setState({
                    searchResult: res.data.body
                })
            })
        }, 300)
    }
    chooseCommunity = (community) => {
        return () => {
            this.props.history.replace({
                pathname: '/releasehouse',
                state: {
                    name: community.communityName,
                    id: community.community
                }
            })
        }
    }
    renderSearchResult = () => {
        const { searchResult } = this.state
        if (!searchResult.length) {
            return <div className="not_found_search">
                <img src={`${process.env.REACT_APP_URL}/img/not-found.png`} alt="" />
                <p>这里空空如也，换个关键词试试吧</p>
            </div>
        } else {
            return <ul>
                {
                    searchResult.map(item => {
                        return <li key={item.community} className="search_result_item" onClick={this.chooseCommunity(item)}>
                            {item.communityName} <span>（{item.streetName}街）</span>
                        </li>
                    })
                }
            </ul>
        }
    }
    componentDidMount() {
        getCurrentCity().then(city => {
            this.setState({ city })
        })
    }
}

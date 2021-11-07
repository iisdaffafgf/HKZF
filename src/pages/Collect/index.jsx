import React, { Component } from 'react'

import NavBar from '../../components/NavBar'
import HousesItem from '../../components/HousesItem'

import request from '../../network'
import './index.css'
export default class index extends Component {
    state = {
        collectList: []
    }
    render() {
        const { collectList } = this.state
        return (
            <div className="my_collect_root">
                <NavBar centerContent="我的收藏" />
                {
                    !collectList.length ? this.renderEmptyList()
                        : this.renderCollectList()
                }
            </div>
        )
    }
    // 渲染无收藏时
    renderEmptyList = () => {
        return (
            <div className="not_found_collect">
                <img src={`${process.env.REACT_APP_URL}/img/not-found.png`} alt="未发布过房源信息" />
                <p>暂无收藏房源，快去<span onClick={this.goHouseList}>看看房源吧&gt;&gt;</span></p>
            </div>
        )
    }
    goHouseList = () => {
        this.props.history.push('/home/findhouse')
    }
    // 渲染收藏列表
    renderCollectList = () => {
        const { collectList } = this.state
        return (
            <ul>
                {
                    collectList.map(item => {
                        return <HousesItem item={item} key={item.houseCode} />
                    })
                }
            </ul>
        )
    }
    // 获取收藏列表数据
    getCollectList = async () => {
        const { data: { body: collectList } } = await request({ url: '/user/favorites' })
        this.setState({ collectList })
    }
    componentDidMount() {
        this.getCollectList()
    }
}

import React, { Component } from 'react'

import NavBar from '../../components/NavBar'
import request from '../../network'
import HousesItem from '../../components/HousesItem'
import './index.css'
export default class index extends Component {
    state = {
        rentList: []
    }
    render() {
        const { rentList } = this.state
        return (
            <div className="rent_root">
                <NavBar centerContent="房屋管理" />
                {
                    !rentList.length ? this.renderEmptyList()
                        : this.renderRentList()
                }
            </div>
        )
    }
    // 渲染未发布过房屋出租
    renderEmptyList = () => {
        return (
            <div className="not_found_house">
                <img src={`${process.env.REACT_APP_URL}/img/not-found.png`} alt="未发布过房源信息" />
                <p>您还没有发布过房源，快去<span onClick={this.releaseHouse}>发布房源吧&gt;&gt;</span></p>
            </div>
        )
    }
    // 跳转到发布房源页面
    releaseHouse = () => {
        this.props.history.push('/releasehouse')
    }
    // 渲染出租列表
    renderRentList = () => {
        const { rentList } = this.state
        return <div>
            {
                rentList.map(item => {
                    return <HousesItem item={item} key={item.houseCode} self={true} upDateList={this.upDateList} />
                })
            }
            <div className="add_rent_new" onClick={this.releaseHouse}>发布新房源</div>
        </div>
    }
    // 删除发布的房源，更新数据
    upDateList = () => {
        this.getRentList()
    }
    // 请求我的出租页面
    getRentList = async () => {
        const { data: { body: rentList } } = await request({ url: '/user/houses' })
        this.setState({ rentList })
    }

    componentDidMount() {
        this.getRentList()
    }
}

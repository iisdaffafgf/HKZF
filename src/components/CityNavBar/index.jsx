
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import './index.css'
class NavBar extends Component {
    // 点击跳转城市列表路由
    routeToCityList = () => {
        this.props.history.push('/citylist')
    }
    // 点击跳转搜索路由
    routeToSearch = () => {
        this.props.history.push('/home/findhouse')
    }
    // 点击跳转地图路由
    routeToMap = () => {
        this.props.history.push('/map')
    }
    render() {
        const { currentCity, className, leftMenu } = this.props
        return (
            <div
                className={`home_top_nav ${className || ''}`}
            >
                <div className="nav_bar_left_menu">
                    {leftMenu}
                </div>
                <div className="home_address_search">
                    <span className="home_address" onClick={this.routeToCityList}>
                        {currentCity ? currentCity.label : ''}
                        <i className="iconfont icon-arrow"></i>
                    </span>
                    <div className="home_search" onClick={this.routeToSearch}>
                        <i className="iconfont icon-seach"></i>
                        请输入小区或地址
                    </div>
                </div>
                <i
                    className="iconfont icon-map"
                    onClick={this.routeToMap}
                ></i>
            </div>
        )
    }
}
export default withRouter(NavBar)

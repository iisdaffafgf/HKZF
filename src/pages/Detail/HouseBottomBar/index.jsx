import React, { Component } from 'react'

import './index.css'
export default class HouseBottomBar extends Component {
    render() {
        const { isFavorite } = this.props
        return (
            <ul className="house_bottom_bar">
                <li className="collect_house" onClick={this.collectHouse}>
                    <img src={`${process.env.REACT_APP_URL}${isFavorite ? "/img/star.png" : "/img/unstar.png"}`} alt="" />
                    <span>{isFavorite ? "已收藏" : "收藏"}</span>
                </li>
                <li className="online_q">在线咨询</li>
                <li className="phone_q">电话预定</li>
            </ul>
        )
    }
    collectHouse = () => {
        const { isFavorite } = this.props
        this.props.collectHouse(isFavorite)
    }
}

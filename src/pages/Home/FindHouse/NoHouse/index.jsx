import React, { Component } from 'react'

import './index.css'
export default class NoHouse extends Component {
    render() {
        return (
            <div className="no_house">
                <div>
                    <img src={`${process.env.REACT_APP_URL}/img/not-found.png`} alt="暂无房源信息" />
                    <p>暂无房源信息~换个条件试试吧~</p>
                </div>
            </div>
        )
    }
}

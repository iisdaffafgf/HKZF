import React, { Component } from 'react'


import './index.css'
export default class HouseDesc extends Component {
    render() {
        const { description } = this.props
        return (
            <div className="house_desc_root">
                <h3>房屋概况</h3>
                <div className="landlord">
                    <div className="landlord_info">
                        <img src={`${process.env.REACT_APP_URL}/img/avatar.png`} alt="房东" />
                        <div className="landlord_name">
                            <span className="landlord_name_">王女士</span>
                            <div className="glod_certification">
                                <i className="iconfont icon-auth" />已认证房主
                            </div>
                        </div>
                    </div>
                    <button className="send_message">发消息</button>
                </div>
                <p className="house_desc_text">{description ? description : '暂无房屋概况数据'}</p>
            </div>
        )
    }
}

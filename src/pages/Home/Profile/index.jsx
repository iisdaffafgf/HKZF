import React, { Component } from 'react'
import { Modal } from 'antd-mobile'

import request from '../../../network'
import './index.css'
const services = [
    {
        icon: 'iconfont icon-coll',
        name: '我的收藏',
        path: '/collect'
    },
    {
        icon: 'iconfont icon-ind',
        name: '我的出租',
        path: '/rent'
    },
    {
        icon: 'iconfont icon-record',
        name: '看房记录',
        path: ''
    },
    {
        icon: 'iconfont icon-identity',
        name: '成为房主',
        path: ''
    },
    {
        icon: 'iconfont icon-myinfo',
        name: '个人资料',
        path: ''
    },
    {
        icon: 'iconfont icon-cust',
        name: '联系我们',
        path: ''
    },
]
export default class Profile extends Component {
    state = {
        userInfo: {}
    }
    // 服务的点击处理
    servicesClick = (path) => {
        return () => {
            // path参数为空，则不能跳转
            if (!path) return
            // 跳转路由页面
            this.props.history.push(path)
        }
    }
    // 渲染服务模块
    renderServices = () => {
        return (
            <ul className="user_services">
                {
                    services.map(item => (
                        <li key={item.name} onClick={this.servicesClick(item.path)}>
                            <span className="service_icon">
                                <i className={item.icon}></i>
                            </span>
                            <span className="service_name">{item.name}</span>
                        </li>
                    ))
                }
            </ul>
        )
    }
    render() {
        const { userInfo: { nickname } } = this.state
        return (
            <div className="login_root">
                <div className="user">
                    <img src={`${process.env.REACT_APP_URL}/img/profile/bg.png`} alt="用户背景" />
                    <div className="user_info">
                        <div className="user_avatar">
                            <img src={`${process.env.REACT_APP_URL}/img/profile/avatar.png`} alt="用户头像" />
                        </div>
                        <span className="user_name">{nickname ? nickname : '游客'}</span>
                        <span className="go_login" onClick={this.goLogin}>{nickname ? '退出' : '去登录'}</span>
                    </div>
                </div>
                {this.renderServices()}
            </div>
        )
    }
    // 登录点击
    goLogin = () => {
        const { userInfo: { nickname } } = this.state
        if (nickname) {
            Modal.alert('退出登录', '确定要退出登录吗？', [
                { text: '取消' },
                {
                    text: '确定', onPress: () => {
                        localStorage.removeItem('hkzf_token')
                        this.setState({
                            userInfo: {}
                        })
                        request({
                            method: "POST",
                            url: '/user/logout'
                        })
                    }
                }
            ])
        } else {
            this.props.history.push('/login')
        }
    }
    async componentDidMount() {
        // 获取本地token
        const token = localStorage.getItem('hkzf_token')
        if (token) {
            const { data: { status, body: userInfo } } = await request({
                url: '/user'
            })
            if (status === 200) {
                this.setState({
                    userInfo
                })
            } else {
                localStorage.removeItem('hkzf_token')
            }
        }
    }
}

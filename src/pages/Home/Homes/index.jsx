import React, { Component } from 'react'


//  引入网络请求
import request from '../../../network'

// 引入轮播图组件
import Swiper from './Swiper'

// 引入导航菜单组件
import NavMenu from './NavMenu'

// 引入租房小组组件
import Groups from './Groups'

// 引入资讯组件
import LatestNews from './LatestNews'

// 引入顶部导航
import CityNavBar from '../../../components/CityNavBar'

import { getCurrentCity } from '../../../utils'

import './index.css'

// 引入NavBar
// import NavBar from '../../../components/NavBar'

export default class Index extends Component {
    state = {
        // 轮播图数据
        swiperImgs: [],
        // 租房小组数据
        groups: [],
        // 最新资讯数据
        news: [],
        // 定位城市信息
        city: {}
    }
    // 轮播图请求
    getSwiperImgs = async () => {
        const { data: { body } } = await request({
            url: '/home/swiper'
        })
        this.setState({ swiperImgs: body }, () => {
            // 修改完状态后的回调
        })
    }
    // 租房小组请求
    getGroups = async () => {
        const { data: { body } } = await request({
            url: '/home/groups',
            params: {
                area: this.state.city.value
            }
        })
        this.setState({ groups: body }, () => {
        })
    }
    // 最新资讯请求
    getLatestNews = async () => {
        const { data: { body } } = await request({
            url: '/home/news',
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        // console.log(body);
        this.setState({ news: body })
    }
    // 获取定位城市
    getCity = async () => {
        const city = await getCurrentCity()
        this.setState({ city })

    }
    componentDidMount() {
        // 获取当前定位城市
        this.getCity()
        // 轮播图请求
        this.getSwiperImgs()
        // 租房小组请求
        this.getGroups()
        // 最新资讯请求
        this.getLatestNews()

    }
    render() {
        const { swiperImgs, groups, news, city } = this.state
        return (
            <div>
                {this.state.swiperImgs.length ? <Swiper swiperImgs={swiperImgs} /> : ''}
                <NavMenu />
                <Groups groups={groups} />
                <LatestNews news={news} />
                <CityNavBar
                    currentCity={city}
                    className="city_nav_bar_self"
                />
            </div>
        );
    }

}

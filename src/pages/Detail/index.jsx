import React, { Component } from 'react'



import NavBar from '../../components/NavBar';
import Swiper from '../Home/Homes/Swiper'

import request from '../../network';

import HouseInfo from './HouseInfo';
import HouseMap from './HouseMap';
import HouseConfig from '../../components/HouseConfig';
import HouseDesc from './HouseDesc';
import HouseBottomBar from './HouseBottomBar';

import './index.css'
import { Toast } from 'antd-mobile';
export default class Detail extends Component {
    state = {
        houseDetail: {},
        isFavorite: false
    }
    render() {
        const { isFavorite, houseDetail: { community,
            houseImg,
            title,
            tags,
            price,
            roomType,
            size,
            floor,
            oriented,
            coord,
            supporting,
            description } } = this.state
        return (
            <div className="house_detail">
                {/* 导航栏 */}
                <NavBar
                    centerContent={community}
                    rightContent={<i className="iconfont icon-share" />}
                    defineStyle={{ backgroundColor: 'transparent', position: 'absolute', zIndex: 9, width: '100%', color: '#FFF' }}
                />
                {/* 轮播图 */}
                <Swiper swiperImgs={houseImg} />
                {/* 房屋基本信息 */}
                <HouseInfo
                    title={title}
                    tags={tags}
                    price={price}
                    roomType={roomType}
                    size={size}
                    floor={floor}
                    oriented={oriented}
                />
                {/* 房屋地图信息 */}
                {coord ? <HouseMap community={community} coord={coord} /> : null}
                {/* 房屋配置信息 */}
                {supporting ? <HouseConfig supporting={supporting} /> : null}
                {/* 房屋描述信息 */}
                {description !== undefined ? <HouseDesc description={description} /> : null}
                {/* 底部导航栏 */}
                <HouseBottomBar isFavorite={isFavorite} collectHouse={this.collectHouse} />
            </div>
        )
    }
    // 处理收藏
    collectHouse = async (collectState) => {
        const { houseDetail: { houseCode } } = this.state
        if (collectState) {
            // 已收藏，删除收藏
            const { data: { description } } = await request({
                method: 'DELETE',
                url: `/user/favorites/${houseCode}`,
            })
            if (description === '删除收藏') {
                this.setState({
                    isFavorite: false
                }, () => {
                    Toast.info(`${description}成功!`)
                })
            }
        } else {
            // 未收藏，添加收藏
            const { data: { description } } = await request({
                method: 'POST',
                url: `/user/favorites/${houseCode}`,

            })
            if (description === '添加收藏') {
                this.setState({
                    isFavorite: true
                }, () => {
                    Toast.info(`${description}成功!`)
                })
            }

        }
    }
    // 根据路由参数，请求出租房屋详细数据、是否被收藏
    getHouseDetailData = async () => {
        const { match: { params: { houseCode } } } = this.props
        const { data: { body } } = await request({ url: `/houses/${houseCode}` })
        const token = localStorage.getItem('hkzf_token')
        if (token) {
            const { data: { body: { isFavorite } } } = await request({ url: `/user/favorites/${houseCode}` })
            this.setState({ isFavorite })
        }
        this.setState({
            houseDetail: body
        })
    }
    componentDidMount() {
        // 根据路由参数，请求出租房屋详细数据
        this.getHouseDetailData()
    }
}

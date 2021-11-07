import React, { Component } from 'react'
// 第三方：
import { Toast } from 'antd-mobile'
// 自定义组件的引入
import CityNavBar from '../../../components/CityNavBar'
import Filter from './Filter'
import HouseList from './HouseList'
import NoHouse from './NoHouse'

// 获取定位城市的方法：
import { getCurrentCity } from '../../../utils'
// 网络请求
import request from '../../../network'
// 样式引入：
import './index.css'

export default class index extends Component {
    state = {
        // 当前定位城市：
        city: {},
        // 条件数据
        cityCondition: {},
        // 房源数量
        count: 0,
        // 房源列表
        list: [],
        isLoading: false
    }
    filtersParams = {}
    render() {
        const { city, cityCondition, filters, list, count, isLoading } = this.state
        return (
            <div>
                {/* 顶部导航 */}
                <CityNavBar
                    currentCity={city}
                    className="find_house_nav_bar"
                    leftMenu={<i className="iconfont icon-back" onClick={() => { this.props.history.goBack() }} />}
                />
                {/* 条件筛选栏 */}
                <Filter
                    cityCondition={cityCondition}
                    filters={filters}
                    city={city}
                    getFiltersParams={this.getFiltersParams}
                />
                {
                    !count && !isLoading ? <NoHouse /> :
                        <HouseList
                            loadMoreHouse={this.loadMoreHouse}
                            city={city}
                            list={list}
                            count={count}
                        />

                }

            </div>
        )
    }
    loadMoreHouse = (more) => {
        const { list } = this.state
        this.setState({
            list: [...list, ...more]
        })
    }
    // 请求房源数据
    getHouses = () => {
        this.setState({ isLoading: true }, async () => {
            const { data: { body: { count, list } } } = await request({
                url: '/houses',
                params: {
                    cityId: this.state.city.value,
                    ...this.filtersParams,
                    start: 1,
                    end: 20
                }
            })
            count === 0
                ? Toast.info('暂无房源信息！', 2, null, false)
                : Toast.info(`共找到${count}套房源`, 2, null, false)
            this.setState({ count, list }, () => {
                this.setState({
                    isLoading: false
                })
            })
        })

    }
    // 获取查询条件
    getFiltersParams = (params) => {
        this.filtersParams = params
        this.getHouses()
        // console.log(params);
    }
    async componentDidMount() {
        // 获取定位城市
        const city = await getCurrentCity()
        this.setState({ city }, () => {
            this.getHouses()
        })
    }
}

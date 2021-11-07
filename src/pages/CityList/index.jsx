import React, { Component } from 'react'

// 子组件：
import NavBar from '../../components/NavBar'
import List from './List'
import ListIndex from './ListIndex'
// 网络请求：
import request from '../../network'
// 获取/更改 当前所在城市并存入localStorage(根据ip地址定位):
import { getCurrentCity } from '../../utils'
// 样式：
import './index.css'

const defineStyle = {
    marginTop: '-45px'
}
// 处理城市列表排序
function sortPinyin(arr) {
    let pinyin = arr.map(item => item.pinyin)
    pinyin.sort()
    let cityList = {}
    pinyin.forEach((item) => {
        arr.forEach(city => {
            if (city.pinyin === item) {
                city.letterIndex = item.substring(0, 1)
                if (cityList[city.letterIndex]) {
                    cityList[city.letterIndex].push(city)
                } else {
                    cityList[city.letterIndex] = [city]
                }
            }
        })
    })
    return cityList
}
export default class CityList extends Component {
    state = {
        // 城市列表数据
        cityList: {},
        // 城市列表首字母
        cityIndexs: [],
        // 当前处于的字母索引
        activeIndex: 0,
        flag: false,
        // List组件ref
        refComp: null,

    }
    // 点击索引更改状态
    clickChangeIndex = (index) => {
        if (this.state.activeIndex !== index) {
            this.setState({
                activeIndex: index
            }, () => {
                // 并定位到指定索引对应的 Row
                this.state.refComp.current.scrollToRow(index)
            })
        }
    }
    // 滚动更改索引状态
    scrollChangeIndex = (index) => {
        if (this.state.activeIndex !== index) {
            this.setState({
                activeIndex: index
            })
        }
    }
    // 获取子组件ref
    sendRef = (refComp) => {
        this.setState({
            refComp
        })
    }

    render() {
        const { cityList, cityIndexs, activeIndex } = this.state
        return (
            <div style={{ height: '100%', paddingTop: '45px' }}>
                <NavBar centerContent="城市选择" defineStyle={defineStyle} />
                <List
                    cityList={cityList}
                    cityIndexs={cityIndexs}
                    scrollChangeIndex={this.scrollChangeIndex}
                    sendRef={this.sendRef}
                />
                <ListIndex cityIndexs={cityIndexs} activeIndex={activeIndex} clickChangeIndex={this.clickChangeIndex} />
            </div>
        )
    }
    // 请求城市列表数据并排序
    getCityList = async () => {
        const { data: { body } } = await request({
            url: '/area/city',
            params: {
                level: '1'
            }
        })
        // 处理城市排序
        const cityList = sortPinyin(body)
        const cityIndexs = Object.keys(cityList)
        // 将排序后的城市列表更新到状态
        this.setState({ cityList, cityIndexs })
    }
    // 请求热门城市数据
    getHotCityList = async () => {
        const { cityList, cityIndexs } = this.state
        const { data: { body } } = await request({
            url: '/area/hot'
        })
        this.setState({
            cityIndexs: ['hot', ...cityIndexs],
            cityList: { hot: body, ...cityList }
        })

    }
    async componentDidMount() {
        // 请求城市列表数据并排序
        await this.getCityList()
        // 请求热门城市数据
        await this.getHotCityList()
        // 获取当前城市
        const currentCity = await getCurrentCity()
        // 将当前城市添加到数据中
        this.setState({
            cityIndexs: ['currentcity', ...this.state.cityIndexs],
            cityList: { currentcity: [currentCity], ...this.state.cityList }
        }, () => {
            this.state.refComp.current.measureAllRows()
        })

    }
}

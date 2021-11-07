import React, { Component } from 'react'
import { Spring, animated } from 'react-spring'

import request from '../../../../network'

import FilterTitle from './FilterTitle'
import FilterPicker from './FilterPicker'
import FilterMore from './FilterMore'

import './index.css'
const originalDefaultValues = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
}
export default class index extends Component {
    state = {
        // 筛选条件数据
        cityCondition: {},
        // title数据
        filters: [
            { name: '区域', type: 'area', selected: false },
            { name: '方式', type: 'mode', selected: false },
            { name: '价格', type: 'price', selected: false },
            { name: '筛选', type: 'more', selected: false }
        ],
        openType: 'none',
        // 筛选条件的默认选中的值
        defaultValues: originalDefaultValues,
        showHackTitle: false
    }
    render() {
        const { filters, openType, showHackTitle } = this.state
        return (
            <div>
                <div ref={c => this.scrollTitle = c}>
                    <FilterTitle filters={filters} choose={this.choose} />
                </div>
                <div
                    style={{ display: showHackTitle ? 'flex' : 'none' }}
                    className="hack_filter_title"
                >
                    <FilterTitle filters={filters} choose={this.choose} />
                </div>

                {   // 遮罩层
                    openType === 'area' || openType === 'mode' || openType === 'price' ?
                        <Spring
                            from={{ opacity: 0 }}
                            to={{ opacity: 1 }}>
                            {
                                props => {
                                    return (
                                        <animated.div style={props} className="filter_picker_mask" onClick={this.close}></animated.div >
                                    )
                                }
                            }
                        </Spring> : null
                }
                {this.renderFilterPicker()}
                {this.renderFilterMore()}
            </div>
        )
    }
    // 渲染FilterMore
    renderFilterMore = () => {
        const { showHackTitle, openType, defaultValues, cityCondition: { characteristic, floor, oriented, roomType } } = this.state
        let data = [
            characteristic, floor, oriented, roomType
        ]
        if (openType !== 'more') {
            return null
        }
        if (data[0]) return (
            <Spring
                from={{ width: '0' }}
                to={{ width: '100%' }}
            >
                {
                    props => (
                        <animated.div
                            style={props}
                        >
                            <FilterMore
                                type={openType}
                                data={data}
                                onCancel={this.onCancel}
                                onSave={this.onOk}
                                close={this.close}
                                others={defaultValues.more}
                                showHackTitle={showHackTitle}
                            />
                        </animated.div>
                    )
                }
            </Spring>

        )

    }
    // 渲染FilterPicker
    renderFilterPicker = () => {
        const { showHackTitle, openType, defaultValues, cityCondition: { area, subway, rentType, price } } = this.state
        if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
            return null
        }
        // 根据openType，选择需要展示的条件列表数据
        let data = []
        let cols = 3
        switch (openType) {
            case 'area':
                data = [area, subway]
                break;
            case 'mode':
                data = rentType
                cols = 1
                break;
            case 'price':
                data = price
                cols = 1
                break;
            default:
                break;
        }
        return (
            <FilterPicker
                onCancel={this.onCancel}
                onSave={this.onOk}
                close={this.close}
                data={data}
                cols={cols}
                type={openType}
                defaultValue={defaultValues[openType]}
                key={openType}
                showHackTitle={showHackTitle}
            />
        )
    }
    // 点击取消按钮
    onCancel = () => {
        const { filters, openType: type, defaultValues } = this.state
        const newDefaultValues = JSON.parse(JSON.stringify(defaultValues))
        filters.forEach(item => {
            if (item.type === type) {
                item.selected = false
                newDefaultValues[type] = originalDefaultValues[type]
                if (type === "more") {
                    newDefaultValues[type] = []
                }
            }
        })
        this.setState({
            filters,
            defaultValues: newDefaultValues,
            openType: 'none'
        })
        // 开启页面滚动
        document.body.style.overflow = 'auto'
    }
    // 点击确定按钮
    onOk = (value, type) => {
        const { filters, defaultValues } = this.state
        const newDefaultValues = JSON.parse(JSON.stringify(defaultValues))
        const newFilters = JSON.parse(JSON.stringify(filters))
        // 确定点下，保存当前选中的条件
        newDefaultValues[type] = value
        // 循环遍历4个筛选方式
        filters.forEach((item, index) => {
            // 判断当前项保存的值是否与初始值相等，相等，则表示没有选择条件
            if (newDefaultValues[item.type].toString() === originalDefaultValues[item.type].toString()) {
                // 将之高亮取消
                newFilters[index].selected = false
            }
        })
        // 更新状态，并关闭条件选择面板(openType: 'none')
        this.setState({
            defaultValues: newDefaultValues,
            filters: newFilters,
            openType: 'none'
        }, () => {
            // 处理条件参数,请求房源信息
            const { defaultValues: { area, mode, price, more } } = this.state
            const filtersParams = {}
            const areaKey = area[0]
            // 区域条件
            let areaValue = 'null'
            if (area.length === 3) {
                areaValue = area[2] === 'null' ? area[1] : area[2]
            }
            filtersParams[areaKey] = areaValue
            // 方式、价格条件
            filtersParams.mode = mode[0]
            filtersParams.price = price[0]
            // 更多筛选条件
            filtersParams.more = more.join(',')
            // 调用父组件中的方法，将参数数据传给父组件
            this.props.getFiltersParams(filtersParams)
            // 重新筛选条件了，滚动条回到顶部
            window.scrollTo(0, 0)
            // 开启页面滚动
            document.body.style.overflow = 'auto'
        })
    }
    // 点击遮罩层关闭
    close = () => {
        const { openType: type, defaultValues, filters } = this.state
        const newDefaultValues = JSON.parse(JSON.stringify(defaultValues))
        const newFilters = JSON.parse(JSON.stringify(filters))
        filters.forEach((item, index) => {
            if (item.type === type && newDefaultValues[type].toString() === originalDefaultValues[type].toString()) {
                newFilters[index].selected = false
            }
        })
        this.setState({
            openType: 'none',
            filters: newFilters
        })
        // 开启页面滚动
        document.body.style.overflow = 'auto'
    }
    // 修改筛选栏高亮
    choose = (type) => {
        const { filters, defaultValues } = this.state
        let openType = ''
        filters.forEach(item => {
            // 判断 '区域'条件是否高亮
            if (defaultValues[item.type].length === 2
                && defaultValues[item.type][0] === 'area'
                && defaultValues[item.type][1] === 'null') {
                item.selected = false
            }
            // 判断 '方式'、'价格'条件是否高亮
            else if (defaultValues[item.type].length === 1 && defaultValues[item.type][0] === 'null') {
                item.selected = false
            }
            // 判断 '筛选'条件是否高亮
            else if (defaultValues['more'].length !== 0) {
                item.selected = true
            }
            // 判断是否为当前被点击项，是，则高亮
            if (item.type === type) {
                item.selected = true
                openType = type
            }
        })
        this.setState({
            filters,
            openType
        })
        // 关闭页面滚动
        document.body.style.overflow = 'hidden'
    }

    // 请求筛选条件数据
    getCityCondition = async () => {
        const city = JSON.parse(localStorage.getItem('hkzf_city'))
        // 请求房源查询条件
        const { data: { body: cityCondition } } = await request({
            url: '/houses/condition',
            params: {
                id: city.value
            }
        })
        // 保存到状态
        this.setState({ cityCondition })
        // console.log(cityCondition);
    }
    handleScroll = () => {
        const { showHackTitle } = this.state
        let layout = this.scrollTitle.getBoundingClientRect()
        if (layout.top <= -40) {
            if (!showHackTitle) {
                this.setState({
                    showHackTitle: true
                })
            }
        } else {
            if (showHackTitle) {
                this.setState({
                    showHackTitle: false
                })
            }
        }
    }
    componentDidMount() {
        // 请求筛选条件数据
        this.getCityCondition()
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }
}

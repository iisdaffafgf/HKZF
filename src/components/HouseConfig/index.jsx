import React, { Component } from 'react'

import './index.css'
// 所有房屋配置
const HOUSE_PACKAGE = [
    {
        id: 1,
        name: '衣柜',
        icon: 'icon-wardrobe'
    },
    {
        id: 2,
        name: '洗衣机',
        icon: 'icon-wash'
    },
    {
        id: 3,
        name: '空调',
        icon: 'icon-air'
    },
    {
        id: 4,
        name: '天然气',
        icon: 'icon-gas'
    },
    {
        id: 5,
        name: '冰箱',
        icon: 'icon-ref'
    },
    {
        id: 6,
        name: '暖气',
        icon: 'icon-Heat'
    },
    {
        id: 7,
        name: '电视',
        icon: 'icon-vid'
    },
    {
        id: 8,
        name: '热水器',
        icon: 'icon-heater'
    },
    {
        id: 9,
        name: '宽带',
        icon: 'icon-broadband'
    },
    {
        id: 10,
        name: '沙发',
        icon: 'icon-sofa'
    }
];
export default class HouseConfig extends Component {
    state = {
        selectedConfigs: []
    }
    render() {
        const { supporting } = this.props
        return (
            <div className="house_config_root">
                {supporting ? <h3>房屋配套</h3> : null}
                <div className="house_config">
                    {supporting ? this.renderContent() : this.renderAll()}
                </div>
            </div>
        )
    }
    // 发布房源时
    renderAll = () => {
        return HOUSE_PACKAGE.map(item => {
            // 判断条件，是否存在于配置数组中
            const isActive = this.state.selectedConfigs.includes(item.name)
            return (
                <div key={item.id}
                    className={`house_config_item ${isActive ? 'active_config' : ''}`}
                    onClick={this.addConfig(item.name)}
                >
                    <i className={['iconfont', item.icon].join(' ')}></i>
                    <div>{item.name}</div>
                </div>
            )
        })
    }
    // 发布房源时，添加房屋配置，并将配置传递给父组件ReleaseHouse
    addConfig = (config) => {
        return () => {
            const { selectedConfigs } = this.state
            const index = selectedConfigs.findIndex(item => item === config)
            if (index === -1) {
                this.setState({
                    selectedConfigs: [...selectedConfigs, config]
                }, () => {
                    this.props.addConfig(this.state.selectedConfigs)
                })
            } else {
                const newSelectedConfigs = JSON.parse(JSON.stringify(selectedConfigs))
                newSelectedConfigs.splice(index, 1)
                this.setState({ selectedConfigs: newSelectedConfigs }, () => {
                    this.props.addConfig(this.state.selectedConfigs)
                })
            }

        }
    }
    // 请求房屋的配置时
    renderContent = () => {
        const { supporting } = this.props
        if (supporting.length === 0) {
            console.log(supporting);
            return '暂无数据'
        }
        else {
            const values = HOUSE_PACKAGE.filter(item => supporting.includes(item.name));
            return (
                values.map(item => {
                    return (
                        <div key={item.id} className="house_config_item">
                            <i className={['iconfont', item.icon].join(' ')}></i>
                            <div>{item.name}</div>
                        </div>
                    )
                })
            )

        }
    }
}

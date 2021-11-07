import React, { Component } from 'react'

import './index.css'
export default class ListIndex extends Component {

    // 点击字母索引更改父组件activeIndex状态
    clickChangeIndex = (index) => {
        return () => {
            this.props.clickChangeIndex(index)
        }
    }
    render() {
        const { cityIndexs, activeIndex } = this.props
        return (
            <ul className="city_list_index">
                {cityIndexs.map((item, index) => {
                    return (
                        <li key={item} className="city_list_index_item" onClick={this.clickChangeIndex(index)}>
                            <span className={activeIndex === index ? 'active_index' : ''}>
                                {item === "currentcity" ? '#' : item === "hot" ? '热' : item.toUpperCase()}
                            </span>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

import React, { Component } from 'react'

import './index.css'

export default class FilterTitle extends Component {
    render() {
        const { filters, className, style } = this.props
        return (
            <ul className={`filter_title ${className}`} style={style}>
                {   //筛选栏
                    filters.map(item => {
                        return (
                            <li
                                key={item.type}
                                className={`filter_item ${item.selected ? 'filter_item_selected' : ''}`}
                                onClick={this.choose(item.type)}
                            >
                                <span>{item.name}</span>
                                <i className="iconfont icon-arrow"></i>
                            </li>
                        )
                    })
                }

            </ul>
        )
    }
    choose = (type) => {
        return () => {
            this.props.choose(type)
        }
    }
}

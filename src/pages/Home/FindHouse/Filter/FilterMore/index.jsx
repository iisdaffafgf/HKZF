import React, { Component } from 'react'

import './index.css'

export default class FilterMore extends Component {
    state = {
        tagSelecteds: this.props.others
    }
    render() {
        const { data, showHackTitle } = this.props
        const { tagSelecteds } = this.state
        const title = ['特色', '楼层', '朝向', '户型']
        return (
            <div className="filter_more_root">
                <div className="filter_more_mask" onClick={this.close}></div>
                <div className="filter_more"
                    style={{ top: showHackTitle ? '40px' : '80px' }}
                >
                    <dl className="filter_more_content">
                        {
                            data.map((items, index) => {
                                return (
                                    <div key={title[index]}>
                                        <dt>{title[index]}</dt>
                                        <dd>
                                            {
                                                items.map(item => {
                                                    return <span
                                                        key={item.value}
                                                        className={tagSelecteds.find(i => i === item.value) ? 'tag_selected' : ''}
                                                        onClick={() => this.tagClick(item.value)}
                                                    >{item.label}</span>
                                                })
                                            }
                                        </dd>
                                    </div>
                                )
                            })
                        }
                    </dl>
                    <div className="filter_more_btn"
                        style={{ bottom: showHackTitle ? '90px' : '50px' }}
                    >
                        <div className="filter_picker_btn">
                            <button className="cancel" onClick={this.onCancel}>清除</button>
                            <button className="confirm" onClick={this.onSave}>确定</button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    // 标签被点击
    tagClick = value => {
        const { tagSelecteds } = this.state
        const newTagSelecteds = [...tagSelecteds]
        // 判断是否存在于数组中，并拿到索引值，若不存在与数组中，就是-1
        const index = tagSelecteds.findIndex(item => item === value)
        if (index === -1) {
            // 不存在与数组中，添加进去
            newTagSelecteds.push(value)
        } else {
            // 存在于数组中，从数组中删除
            newTagSelecteds.splice(index, 1)
        }
        // 更新到状态
        this.setState({
            tagSelecteds: newTagSelecteds
        })
    }
    onCancel = () => {
        this.props.onCancel()
    }
    close = () => {
        this.props.close()
    }
    onSave = () => {
        const { type } = this.props
        const { tagSelecteds } = this.state
        this.props.onSave(tagSelecteds, type)
    }
}

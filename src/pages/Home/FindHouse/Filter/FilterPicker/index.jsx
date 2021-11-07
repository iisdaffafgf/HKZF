import React, { Component } from 'react'

import './index.css'
import { PickerView } from 'antd-mobile'


export default class index extends Component {
    state = {
        // 选中条件后的数据
        value: this.props.defaultValue,
    }
    render() {
        const { data, cols, showHackTitle } = this.props
        const { value } = this.state
        return (
            <div>
                <div className="filter_picker"
                    style={{ top: showHackTitle ? '40px' : '80px' }}
                >
                    <PickerView
                        data={data}
                        value={value}
                        cols={cols}
                        onChange={val => {
                            this.setState({ value: val })
                        }}
                    />
                    <div className="filter_picker_btn">
                        <button className="cancel" onClick={this.onCancel}>取消</button>
                        <button className="confirm" onClick={this.onSave}>确定</button>
                    </div>
                </div>
            </div>
        )
    }
    onCancel = () => {
        this.props.onCancel()
    }
    onSave = () => {
        const { value } = this.state
        const { type } = this.props
        this.props.onSave(value, type)
    }
}

import React, { Component } from 'react'
import { Toast } from 'antd-mobile'

export default class index extends Component {
    render() {
        return (
            <div className='loading'>
            </div>
        )
    }
    componentDidMount() {
        Toast.loading('加载中', 0, null, false)
    }
    componentWillUnmount() {
        Toast.hide()
    }
}

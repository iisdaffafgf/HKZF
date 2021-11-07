import React, { Component } from 'react'
import { Modal, Toast } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

import request from '../../network'
import './index.css'
class HousesItem extends Component {
    render() {
        const { item, style, self } = this.props
        if (!item) {
            return (
                <div className="houses_item_loading">
                    <p>加载中···</p>
                </div>
            )
        }
        return (
            <li className="item_house_list_item" key={item.houseCode} style={style} onClick={this.houseDetail(item.houseCode)}>
                <img src={process.env.REACT_APP_URL + item.houseImg} alt={item.title} />
                <div className="item_house_list_item_info">
                    <h4>{item.title}</h4>
                    <p className="house_info">{item.desc}</p>
                    <p className="item_house_tags">
                        {item.tags.map(tag => {
                            return <span key={tag}>{tag}</span>
                        })}
                    </p>
                    <p className="item_house_prices">
                        <span className="item_house_price">{item.price}</span>
                        <span>元/月</span>
                    </p>
                </div>
                {
                    !self ? null :
                        <div className="self_house_item">
                            <span onClick={this.deleteHouse}>删除</span>
                        </div>
                }
            </li>
        )
    }
    // 点击删除按钮，删除当前房源
    deleteHouse = (e) => {
        // 需要阻止冒泡
        e.stopPropagation()
        Modal.alert('删除确认', '您确认要删除该房源吗', [
            { text: '取消' },
            {
                text: '确认', onPress: async () => {
                    const res = await request({
                        method: 'PATCH',
                        url: `/user/houses/${this.props.item.houseCode}`,
                        data: {
                            shelf: true
                        }
                    })
                    if (res.data.status === 200) {
                        this.props.upDateList()
                        Toast.info('删除房屋成功！')
                    }
                }
            }
        ])
    }
    // 点击房源列表，访问当前房源详细
    houseDetail = (houseCode) => {
        return () => {
            this.props.history.push(`/detail/${houseCode}`)
        }
    }
}
export default withRouter(HousesItem)

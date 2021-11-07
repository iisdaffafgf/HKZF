import React, { Component } from 'react'


import './index.css'
export default class HouseInfo extends Component {
    render() {
        const { title, tags, price, roomType, size, floor, oriented } = this.props
        return (
            <div className="house_info">

                <p className="house_title">{title}</p>

                <div className="house_tags">
                    {tags ?
                        tags.map(tag => {
                            return <span key={tag}>{tag}</span>
                        })
                        : null
                    }
                </div>

                <ul className="house_base_info">
                    <li>
                        <div><span className="base_info_data">{price}</span>/月</div>
                        <div className="base_info_title">租金</div>
                    </li>
                    <li>
                        <div><span className="base_info_data">{roomType}</span></div>
                        <div className="base_info_title">房型</div>
                    </li>
                    <li>
                        <div><span className="base_info_data">{size}平方米</span></div>
                        <div className="base_info_title">面积</div>
                    </li>
                </ul>

                <div className="house_type">
                    <div>
                        <div className="house_type_item">
                            <span className="house_type_title">装修：</span>
                            <span className="house_type_content">精装</span>
                        </div>
                        <div className="house_type_item">
                            <span className="house_type_title">楼层：</span>
                            <span className="house_type_content">{floor}</span>
                        </div>
                    </div>
                    <div>
                        <div className="house_type_item">
                            <span className="house_type_title">朝向：</span>

                            {oriented ?
                                oriented.map(item => {
                                    return <span className="house_type_content" key={item}>{item}</span>
                                }) : '暂无数据'}

                        </div>
                        <div className="house_type_item">
                            <span className="house_type_title">类型：</span>
                            <span className="house_type_content">普通住宅</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

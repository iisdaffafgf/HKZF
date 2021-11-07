import React, { Component } from 'react'
// 引入antd-mobile轮播图组件
import { Carousel } from 'antd-mobile';
export default class index extends Component {
    state = {
        imgHeight: 212
    }
    render() {
        const { swiperImgs } = this.props
        return (
            swiperImgs ? <Carousel autoplay infinite>
                {swiperImgs.map(val => (
                    <a
                        key={val}
                        href="http://www.itcast.com"
                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight + 'px' }}
                    >
                        <img
                            src={`${process.env.REACT_APP_URL}${val.imgSrc || val}`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top', height: '212px' }}
                        />
                    </a>
                ))}
            </Carousel> : null
        )
    }
}

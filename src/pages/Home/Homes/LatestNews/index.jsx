import React, { Component } from 'react'
import './index.css'

export default class index extends Component {

    render() {
        return (
            <ul className="latest_news">
                <h3>最新资讯</h3>
                {this.props.news.map(item => {
                    return (
                        <li className="news_item" key={item.id} >
                            <div className="news_img">
                                <img src={`${process.env.REACT_APP_URL}${item.imgSrc}`} alt="" />
                            </div>
                            <div className="news_info">
                                <h3>{item.title}</h3>
                                <div>
                                    <span>{item.from}</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </li>
                    )
                })}
                <p className="page_end">tips:没有更多了...</p>
            </ul>
        )
    }
}

import React, { Component } from 'react'
import './index.css'

export default class index extends Component {
    addBgc = (e) => {
        e.target.style.backgroundColor = '#ccc'
    }
    removeBgc = (e) => {
        e.target.style.backgroundColor = '#FFF'
    }
    render() {
        return (
            <div className="groups_root">
                <div className="title">
                    <div>租房小组</div>
                    <span>更多</span>
                </div>
                <ul className="groups">
                    {this.props.groups.map(item => {
                        return (
                            <li onTouchStart={this.addBgc} onTouchEnd={this.removeBgc} className="groups_item" key={item.id}>
                                <div className="group_title">
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                                <div className="group_img">
                                    <img src={`${process.env.REACT_APP_URL}${item.imgSrc}`} alt="" />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

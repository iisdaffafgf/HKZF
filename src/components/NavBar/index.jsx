import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.css'
class NavBar extends Component {
    goBack = () => {
        this.props.history.goBack()
    }
    render() {
        return (
            <ul className="city_list_nav" style={this.props.defineStyle || {}}>
                <li className="booth_sides" onClick={this.goBack}>
                    <i className="iconfont icon-back"></i>
                </li>
                <li className="center_content">{this.props.centerContent}</li>
                <li className="booth_sides">{this.props.rightContent}</li>
            </ul >
        )
    }
}
export default withRouter(NavBar)

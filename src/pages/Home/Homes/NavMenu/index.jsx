import React, { Component } from 'react'
// 将一般组件具有路由组件的API
import { withRouter } from 'react-router-dom';
// antd-mobile 组件
import { Flex } from 'antd-mobile';
// 样式引入
import './index.css'

// 导入图片
import Nav1 from '../../../../assets/images/nav-1.png'
import Nav2 from '../../../../assets/images/nav-2.png'
import Nav3 from '../../../../assets/images/nav-3.png'
import Nav4 from '../../../../assets/images/nav-4.png'

const navMenuList = [
    {
        text: '整租',
        iconPath: Nav1,
        routerPath: '/home/findhouse'
    },
    {
        text: '合租',
        iconPath: Nav2,
        routerPath: '/home/findhouse'
    },
    {
        text: '地图找房',
        iconPath: Nav3,
        routerPath: '/map'
    },
    {
        text: '去出租',
        iconPath: Nav4,
        routerPath: '/rent'
    }
]

class NavMenu extends Component {

    // 点击某个导航菜单处理函数
    pushRouter = (routerPath) => {
        return () => {
            this.props.history.push(routerPath)
        }
    }
    render() {
        return (
            <Flex>
                {navMenuList.map(item => {
                    return (
                        <Flex.Item key={item.text} onClick={this.pushRouter(item.routerPath)}>
                            <div className="nav_menu_item">
                                <img src={item.iconPath} alt={item.text} />
                                <div >{item.text}</div>
                            </div>
                        </Flex.Item>
                    )
                })}
            </Flex>
        )
    }
}
export default withRouter(NavMenu)

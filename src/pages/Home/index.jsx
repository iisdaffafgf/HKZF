import React, { Component, lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
import Loading from '../../components/Loading'

import { TabBar } from 'antd-mobile'

import './index.css'
const Index = lazy(() => import('./Homes'))
const FindHouse = lazy(() => import('./FindHouse'))
const News = lazy(() => import('./News'))
const Profile = lazy(() => import('./Profile'))

// tab_bar的数据
const tabs = [
    {
        path: '/home',
        iconClassName: 'iconfont icon-ind',
        title: '首页'
    },
    {
        path: '/home/findhouse',
        iconClassName: 'iconfont icon-findHouse',
        title: '找房'
    },
    {
        path: '/home/news',
        iconClassName: 'iconfont icon-infom',
        title: '资讯'
    },
    {
        path: '/home/profile',
        iconClassName: 'iconfont icon-my',
        title: '我的'
    },
]
export default class Home extends Component {
    state = {
        swiperImgs: [],
        selectedTab: '/home',
    }
    renderTabs = () => {
        return tabs.map(item => {
            return (
                <TabBar.Item
                    title={item.title}
                    key={item.path}
                    icon={<i className={item.iconClassName}></i>}
                    selectedIcon={<i className={item.iconClassName}></i>}
                    selected={this.state.selectedTab === item.path}
                    onPress={() => {
                        this.setState({
                            selectedTab: item.path,
                        });
                        this.props.history.push(item.path)
                    }}
                />
            )
        })
    }
    render() {
        return (
            <div className="home">
                <div className="">
                    <Suspense fallback={<Loading />}>
                        <Route exact path="/home" component={Index} />
                        <Route path="/home/findhouse" component={FindHouse} />
                        <Route path="/home/news" component={News} />
                        <Route path="/home/profile" component={Profile} />
                    </Suspense>
                </div>
                <TabBar
                    tintColor="#21b971"
                    barTintColor="white"
                    noRenderContent={true}
                >
                    {this.renderTabs()}
                </TabBar>
            </div>
        )
    }
    componentDidMount() {
        if (this.state.selectedTab !== this.props.history.location.pathname) {
            this.setState({
                selectedTab: this.props.history.location.pathname
            })
        }
    }
    componentDidUpdate() {
        // 判断路由路径是否发生更新，修改selectedTab
        if (this.state.selectedTab !== this.props.history.location.pathname) {
            this.setState({
                selectedTab: this.props.history.location.pathname
            })
        }

    }
}


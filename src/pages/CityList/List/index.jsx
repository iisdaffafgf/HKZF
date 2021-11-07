import React, { Component } from 'react'
import { AutoSizer, List } from 'react-virtualized';

// 引入withRouter
import { withRouter } from 'react-router-dom';
// 引入请提示：
import { Toast } from 'antd-mobile'

import './index.css'

import { getCurrentCity } from '../../../utils'



const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
class List1 extends Component {
    constructor(props) {
        super(props)

        this.ListComponent = React.createRef()
    }
    state = {
    }
    // react-virtualized渲染，每一行的内容
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        const { cityList, cityIndexs } = this.props
        const letter = cityIndexs[index]

        // console.log(cityList[letter][0].label);
        return (
            <div key={key} style={style}>
                <div className="city_list_title">
                    {letter === 'hot' ? '热门城市' : letter === 'currentcity' ? '当前城市' : letter.toUpperCase()}
                </div>
                {
                    cityList[letter].map(item => (
                        <div key={item.value}
                            className="city_list_content"
                            onClick={this.changeCity(item.label)}
                        >
                            <div>{item.label}</div>
                        </div>)
                    )
                }

            </div>
        );
    }
    // 动态计算每一行的高度
    getRowHeight = ({ index }) => {
        const { cityList, cityIndexs } = this.props
        const letter = cityIndexs[index]
        return 50 * (cityList[letter].length + 1)
    }
    // 开启渲染一行的监听
    onRowsRendered = ({ startIndex }) => {
        // 调用修改状态的方法
        this.props.scrollChangeIndex(startIndex)
    }
    // 点击城市名称，切换当前定位城市，并返回上一页
    changeCity = (cityName) => {
        return () => {
            // 无房源城市被点击：
            if (HOUSE_CITY.indexOf(cityName) === -1) {
                Toast.info('该城市暂无房源信息！', 2, null, false)
                return
            }
            // 按照城市名请求数据，并将之存入本地存储
            getCurrentCity(cityName, true).then(city => {
                this.props.history.goBack()
            })
        }
    }
    render() {
        const { cityIndexs } = this.props
        return (
            <AutoSizer >
                {({ height, width }) => (
                    <List
                        ref={this.ListComponent}
                        width={width}
                        height={height}
                        rowCount={cityIndexs.length}
                        rowHeight={this.getRowHeight}
                        rowRenderer={this.rowRenderer}
                        onRowsRendered={this.onRowsRendered}
                        scrollToAlignment="start"
                    />
                )}
            </AutoSizer>
        )
    }
    componentDidMount() {
        // 将当前组件ref传给父组件，要获取组件实例，需要.current
        this.props.sendRef(this.ListComponent)
    }
}
// 调withRouter方法，传入要导出的组件类名，该组件就能使用路由组件的Api
export default withRouter(List1)

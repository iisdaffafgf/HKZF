import React, { Component } from 'react'
import { Toast } from 'antd-mobile';

import NavBar from '../../components/NavBar';
import HousesItem from '../../components/HousesItem';
import { getCurrentCity } from '../../utils'
import request from '../../network';

import './index.css'


// 处理react中不能直接获取全局变量的问题
const BMapGL = window.BMapGL
// 自定义navbar样式
const defineStyle = {
    marginTop: '-45px'
}
export default class index extends Component {
    state = {
        // 房源列表
        houseList: {},
        // 是否展示房源列表
        showHouseList: false
    }
    // 渲染房源列表
    renderHouseList = () => {
        const { showHouseList, houseList: { count, list } } = this.state
        return (
            (<ul className={showHouseList ? 'map_house_list_height map_house_list' : 'map_house_list_no_height map_house_list'} >
                <div className="map_house_list_title">
                    <p>
                        房屋列表({count}套)
                        <span className="icon_pack_up" onClick={this.hideHouseList}>
                            <i className="iconfont icon-arrow"></i>
                        </span>
                    </p>
                    <span onClick={this.jumpRouter}>更多房源</span>
                </div>
                {list ? <div className="map_house_lists">
                    {
                        list.map(item => {
                            return (
                                <HousesItem item={item} key={item.houseImg} />
                            )
                        })
                    }
                </div> : ''}
            </ul>)
        )
    }
    // 隐藏房源列表
    hideHouseList = () => {
        this.setState({
            showHouseList: false
        })
    }
    // 点击更多房源，跳转到搜索页
    jumpRouter = () => {
        this.props.history.push('/home/findhouse')
    }
    // 小区房源请求
    getHouseList = async (id) => {
        const { data: { body } } = await request({
            url: '/houses',
            params: {
                cityId: id
            }
        })
        this.setState({
            houseList: body
        }, () => {
        })
    }
    // 根据地区级别展示覆盖物
    addNewLabel = async (area, map, point, scla) => {
        /*
         * area  :地区，初次调用的时候来自本地存储，没有经纬度信息
         * map   ：百度地图的一个API，其实就是 const map = new BMapGL.Map("container"); 因为函数中需要用到，必传
         * point ：初始定位中心
         * scla  ：地图缩放级别，也依此判断地区级别
         */
        Toast.loading('加载中', 0, null, false)
        try {
            map.clearOverlays();
            map.centerAndZoom(
                area.coord ? new BMapGL.Point(area.coord.longitude, area.coord.latitude) : point // 定位中心
                , scla);
            // 根据传入的地区，请求房源数据数据
            const { data: { body } } = await request({
                url: '/area/map',
                params: {
                    id: area.value
                }
            })
            body.forEach(item => {
                const opts = {
                    position: new BMapGL.Point(item.coord.longitude, item.coord.latitude), // 指定文本标注所在的地理位置
                    offset: new BMapGL.Size(-25, -25) // 设置文本偏移量
                };
                // 创建文本标注对象
                const label = new BMapGL.Label(' ', opts);
                // 设置自定义标签的默认内容和样式
                let textContent = `
                    <div class="map_label">
                        <p class="map_label_name">${item.label}</p>
                        <p class="map_label_name">${item.count}套</p>
                    </div>
                    `
                let stylesObj = {
                    color: '#FFF',
                    backgroundColor: 'rgba(16,169,119,.8)',
                    borderRadius: '50%',
                    border: 'none',
                    fontSize: '12px',
                    width: '50px',
                    height: '50px',
                    fontFamily: '微软雅黑'
                }
                // 达到小区级别：修改内容和样式
                if (scla === 15) {
                    textContent = `
                    <p class="map_label_line">${item.label}&nbsp;${item.count}套<p/>
                `
                    stylesObj = {
                        color: '#FFF',
                        backgroundColor: 'rgba(16,169,119,.8)',
                        border: 'none',
                        height: '25px',
                        fontSize: '12px',
                        width: 'auto',
                        fontFamily: '微软雅黑'
                    }
                }
                // 应用自定义标签内容和样式
                label.setContent(textContent)
                label.setStyle(stylesObj);
                // 覆盖物添加点击事件
                label.addEventListener('click', (e) => {
                    // 处理缩放，根据缩放级别判断当前地区级别
                    if (scla === 11) {
                        scla = 13
                    } else if (scla === 13) {
                        scla = 15
                    } else {
                        scla = 16
                    }
                    // 若没有到达校区级别：
                    if (scla <= 15) {
                        this.addNewLabel(item, map, point, scla)
                    }
                    // 到达小区级别：
                    else {
                        this.getHouseList(item.value)
                        this.setState({
                            showHouseList: true
                        })
                        // 将被点击的小区定位到地图的可视区中心
                        map.panBy(
                            window.innerWidth / 2 - e.domEvent.changedTouches[0].clientX,
                            window.innerHeight / 4 - e.domEvent.changedTouches[0].clientY
                        )
                    }
                })
                map.addOverlay(label);
                Toast.hide()
            })
        } catch (error) {
            Toast.hide()
            Toast.info('数据加载失败！', 2)
        }
    }
    componentDidMount() {
        // 获取本地存储中的数据
        getCurrentCity().then(async city => {
            // 本地存储，定位城市
            const cityName = city.label
            // 初始化地图实例
            const map = new BMapGL.Map("container");
            //创建地址解析器实例
            const myGeo = new BMapGL.Geocoder();

            myGeo.getPoint(cityName, point => {
                // 初始化地图（展示地图）
                map.centerAndZoom(point, 11);
                const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
                map.addControl(scaleCtrl);
                const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
                map.addControl(zoomCtrl);
                // 启用鼠标滚轮缩放
                map.enableScrollWheelZoom()
                // 启用双指手势缩放
                map.enablePinchToZoom()
                // 根据请求下属地区的数据，添加覆盖文本信息
                this.addNewLabel(city, map, point, 11)
            }, cityName)

        })
    }
    render() {
        return (
            <div className="map">
                <NavBar centerContent="地图找房" defineStyle={defineStyle} />
                {/* 地图容器 */}
                <div id="container" ></div>
                {this.renderHouseList()}
            </div>
        )
    }
}

import React, { Component } from 'react'

import './index.css'
export default class HouseMap extends Component {
    render() {
        const { community, coord } = this.props
        return (
            <div>
                <p className="house_map_title">小区：{community}</p>
                {coord ? <div id="house_map"></div> : null}
            </div>
        )
    }
    renderMap = () => {
        const { coord, community } = this.props
        if (this.props.coord) {
            const BMapGL = window.BMapGL
            var map = new BMapGL.Map("house_map");          // 创建地图实例
            var point = new BMapGL.Point(coord.longitude, coord.latitude);  // 创建点坐标

            var label = new BMapGL.Label(community, {       // 创建文本标注
                position: point,                          // 设置标注的地理位置
                offset: new BMapGL.Size(-20, -10)           // 设置标注的偏移量
            })
            map.addOverlay(label);                        // 将标注添加到地图中
            label.setStyle({                              // 设置label的样式
                backgroundColor: '#AA368D',
                color: '#FFF',
                fontSize: '14px',
                height: '30px',
                lineHeight: '30px',
                padding: '0 10px',
                borderRadius: '5px',
                border: 'none'
            })
            map.centerAndZoom(point, 15);
            var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
            map.addControl(scaleCtrl);
        }
    }
    componentDidMount() {
        this.renderMap()
    }
}

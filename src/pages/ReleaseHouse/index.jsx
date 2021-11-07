import React, { Component } from 'react'
import { Picker, List, InputItem, ImagePicker, TextareaItem, Modal, Toast } from 'antd-mobile'

import NavBar from '../../components/NavBar'
import HouseConfig from '../../components/HouseConfig'
import request from '../../network'
import './index.css'
const floorData = [
    { label: "高楼层", value: "FLOOR|1" },
    { label: "中楼层", value: "FLOOR|2" },
    { label: "低楼层", value: "FLOOR|3" }
];
const roomTypeData = [
    { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
    { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
    { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
    { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
    { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" }
];
const orientedData = [
    { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
    { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
    { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
    { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
    { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
    { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
    { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
    { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" }
];
export default class index extends Component {
    state = {
        title: '',
        roomType: [],
        floor: [],
        oriented: [],
        size: 0,
        price: 0,
        files: [],
        supporting: [],
        description: ''
    }
    render() {
        return (
            <div className="release_root">
                <NavBar centerContent="发布房源" defineStyle={{ position: 'fixed', width: '100%', zIndex: '9', top: '0' }} />
                <h3 className="release_title">房屋信息</h3>
                {this.renderHouseInfo()}

                <h3 className="release_title">房屋标题</h3>
                <input type="text"
                    placeholder="请输入房屋标题（例如：合租 小区名 3室 2000元）"
                    className="rent_house_title"
                    onChange={e => this.setState({ title: e.target.value })}
                />

                <h3 className="release_title">房屋图像</h3>
                {this.renderHouseImgs()}

                <h3 className="release_title">房屋配置</h3>
                <HouseConfig addConfig={this.addConfig} />

                <h3 className="release_title">房屋描述</h3>
                <TextareaItem rows={5} placeholder="请输入房屋描述信息" onChange={description => this.setState({ description })} />

                <ul className="release_bottom_bar">
                    <li className="cancel" onClick={this.cancle}>取消</li>
                    <li className="confirm" onClick={this.confirm}>确认</li>
                </ul>
            </div>
        )
    }
    // 点击取消，询问是否确认退出
    cancle = () => {
        Modal.alert('退出', '确认取消发布房源吗？', [
            { text: '取消', onPress: () => { } },
            {
                text: '确认', onPress: () => {
                    this.props.history.goBack()
                }
            },
        ])
    }
    // 点击确认，提交发布房源
    confirm = () => {
        Modal.alert('发布确认', '确认发布该房源吗', [
            { text: '取消' },
            {
                text: '确认', onPress: async () => {
                    const { title, roomType,
                        floor,
                        oriented,
                        size,
                        price,
                        files,
                        supporting,
                        description } = this.state
                    // 处理图片数据
                    let houseImg = '';
                    if (files.length > 0) {
                        const form = new FormData();
                        files.forEach(item => form.append('file', item.file));

                        const res = await request({
                            url: '/houses/image',
                            method: 'POST',
                            Headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            data: form

                        })
                        houseImg = res.data.body.join('|');
                    }

                    const res = await request({
                        url: '/user/houses',
                        method: "POST",
                        data: {
                            title: title,
                            description: description,
                            houseImg: houseImg,
                            oriented: oriented[0],
                            supporting: supporting.join('|'),
                            price: price,
                            roomType: roomType[0],
                            size: size,
                            floor: floor[0],
                            community: this.props.location.state.id
                        }
                    })
                    if (res.data.status === 200) {
                        Toast.info('发布房源成功！', 2, () => {
                            this.props.history.push('/rent')
                        }, true)
                    } else {
                        Toast.info('网络繁忙，请稍后再试！')
                    }

                }
            }
        ])
    }
    // 添加房屋配置
    addConfig = (supporting) => {
        this.setState({ supporting })
    }
    // 渲染图片选择器
    renderHouseImgs = () => {
        const { files } = this.state
        return <ImagePicker
            files={files}
            onChange={(files) => this.setState({ files })}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={files.length < 7}
            multiple={true}
        />
    }
    // 渲染添加房屋信息的列表
    renderHouseInfo = () => {
        const community = this.props.location.state
        return (
            <List>
                <List.Item
                    arrow="horizontal" //向右的箭头
                    extra={community ? community.name : '请输入小区名称'}
                    onClick={() => this.props.history.push('/pickercommunity')}
                >小区名称</List.Item>
                <InputItem
                    placeholder="请输入每月租金"
                    extra={'￥/月'}
                    onChange={price => this.setState({ price })}
                >每月租金</InputItem>
                <InputItem
                    placeholder="请输入房屋面积"
                    extra={'㎡'}
                    onChange={size => this.setState({ size })}
                >建筑面积</InputItem>

                <Picker
                    data={roomTypeData}
                    cols={1}
                    extra={'请选择户型'}
                    value={this.state.roomType}
                    onChange={roomType => this.setState({ roomType })}
                >
                    <List.Item arrow="horizontal">户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</List.Item>
                </Picker>
                <Picker
                    data={floorData}
                    cols={1}
                    extra={'请选择楼层'}
                    value={this.state.floor}
                    onChange={floor => this.setState({ floor })}
                >
                    <List.Item arrow="horizontal">所在楼层</List.Item>
                </Picker>
                <Picker
                    data={orientedData}
                    cols={1}
                    extra={'请选择房屋朝向'}
                    value={this.state.oriented}
                    onChange={(oriented) => this.setState({ oriented })}
                >
                    <List.Item arrow="horizontal">朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向</List.Item>
                </Picker>
            </List>
        )
    }
}

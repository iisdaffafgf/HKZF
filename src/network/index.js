import axios from 'axios'
import { Toast } from 'antd-mobile';
export default function request(config) {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        headers: { 'Content-Type': 'application/json' }
    })
    instance.interceptors.request.use(config => {
        Toast.loading('加载中', 5)
        // 请求头中统一添加token
        config.headers.Authorization = localStorage.getItem('hkzf_token')
        return config
    }, err => {
        return err
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
        Toast.hide()
        // 若返回的状态码，移除本地token
        if (res.status !== 200) {
            localStorage.removeItem('hkzf_token')
        }
        return res
    }, err => {
        Toast.hide()
        return err
    })
    return instance(config)
}
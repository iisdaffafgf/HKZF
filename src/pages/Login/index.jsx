import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
// 引入withFormik高阶组件，用于表单校验
import { withFormik, Form, Field, ErrorMessage } from 'formik'
// 导入yup
import * as yup from 'yup'
import { Link } from 'react-router-dom'

import NavBar from '../../components/NavBar'
import request from '../../network'
import './index.css'
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
class Login extends Component {
    render() {
        return (
            <div className="login_root">
                <NavBar centerContent="账号登录" />
                <Form >
                    <div>
                        <Field type="text"
                            name="username"
                            placeholder="请输入账号"
                        />
                        <ErrorMessage component="div" name="username" className="input_tips"></ErrorMessage>
                    </div>
                    <div>
                        <Field type="password"
                            name="password"
                            placeholder="请输入密码"
                        />
                        <ErrorMessage component="div" name="password" className="input_tips"></ErrorMessage>
                    </div>
                    <button type="submit">登&nbsp;&nbsp;&nbsp;录</button>
                    <div className="registered">
                        <Link to="/registered">还没有账号？去注册&gt;</Link>

                    </div>
                </Form>
            </div>
        )
    }
}
Login = withFormik({
    // 为Login组件提供状态
    mapPropsToValues: () => ({ username: '', password: '' }),
    // 添加校验规则
    validationSchema: yup.object().shape({
        username: yup.string().required('账号必填').matches(REG_UNAME, '账号长度为5~8位，只能由数字、字母、下划线组成'),
        password: yup.string().required('密码必填').matches(REG_PWD, '密码长度为5~12位，只能由数字、字母、下划线组成'),
    }),
    // 为Login提供表单提交方法
    handleSubmit: async (values, { props }) => {
        // 获取账号、密码
        const { username, password } = values;
        const res = await request({
            url: '/user/login',
            method: 'POST',
            data: { username, password }
        })

        // 获取返回数据
        const { status, body, description } = res.data;
        if (status === 200) {
            // 登录成功
            // 将tolen存储到本地
            localStorage.setItem('hkzf_token', body.token);
            if (!props.location.state) {
                // 用户直接点击登录按钮
                props.history.goBack();
            } else {
                // 用户通过其他地方跳转至登录页面
                props.history.replace(props.location.state.from.pathname)
            }
        } else {
            // 登录失败
            Toast.info(description, 2, null, false);
        }
    }
})(Login)
export default Login
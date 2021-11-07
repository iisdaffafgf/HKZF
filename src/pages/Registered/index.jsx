import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
// 引入withFormik高阶组件，用于表单校验
import { withFormik, Form, Field, ErrorMessage } from 'formik'
// 导入yup
import * as yup from 'yup'

import NavBar from '../../components/NavBar'
import request from '../../network'
import './index.css'
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
class Login extends Component {
    state = {
        password: ''
    }
    render() {
        return (
            <div className="login_root">
                <NavBar centerContent="注册账号" />
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
                    <button type="submit">注&nbsp;&nbsp;&nbsp;册</button>
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
            url: '/user/registered',
            method: 'POST',
            data: { username, password }
        })

        // 获取返回数据
        const { status, description } = res.data;
        console.log(res.data);
        if (status === 200) {
            // 注册成功,返回登录界面
            Toast.info('注册成功，即将返回登录界面', 2, () => {
                props.history.goBack()
            }, true)
        } else {
            // 注册失败
            Toast.info(description, 2, null, false);
        }
    }
})(Login)
export default Login
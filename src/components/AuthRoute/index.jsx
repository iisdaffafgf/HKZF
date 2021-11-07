
import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default function index({ component: Component, ...test }) {
    return <Route
        {...test}
        render={props => {
            const token = localStorage.getItem('hkzf_token')
            if (!!token) {
                // 已登录
                return <Component {...props} />
            } else {
                // 未登录
                return <Redirect to={{
                    pathname: '/login',
                    state: {
                        from: props.location
                    }
                }} />
            }
        }}
    />

}

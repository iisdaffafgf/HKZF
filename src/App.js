
import React, { Component, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import './App.css';

// 引入加载中组件
import Loading from './components/Loading'
// 登录才能访问：
import AuthRoute from './components/AuthRoute'
// 懒加载引入路由组件
const CityList = lazy(() => import('./pages/CityList'));
const Home = lazy(() => import('./pages/Home'));
const Map = lazy(() => import('./pages/Map'))
const Detail = lazy(() => import('./pages/Detail'))
const Login = lazy(() => import('./pages/Login'))
const Registered = lazy(() => import('./pages/Registered'))
// 登录才能访问的页面，未登录会先跳转登录页面登录
const Rent = lazy(() => import('./pages/Rent'))
const ReleaseHouse = lazy(() => import('./pages/ReleaseHouse'))
const Collect = lazy(() => import('./pages/Collect'))
const PickerCommunity = lazy(() => import('./pages/PickerCommunity'))
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Suspense fallback={<Loading />}>
            <Route path="/" exact render={() => <Redirect to="/home" />} />
            <Route path='/home' component={Home} />
            <Route path='/citylist' component={CityList} />
            <Route path="/map" component={Map} />
            <Route path='/detail/:houseCode' component={Detail} />
            <Route path="/login" component={Login} />
            <Route path="/registered" component={Registered} />
            {/* 登录才能访问的页面，未登录会先跳转登录页面登录 */}
            <AuthRoute path='/rent' component={Rent} />
            <AuthRoute path='/releasehouse' component={ReleaseHouse} />
            <AuthRoute path='/collect' component={Collect} />
            <AuthRoute path='/pickercommunity' component={PickerCommunity} />

          </Suspense>
        </div>
      </BrowserRouter>
    )
  }
}


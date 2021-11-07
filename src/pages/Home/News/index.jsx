import React, { Component } from 'react'

import NavBar from '../../../components/NavBar'
import LatestNews from '../Homes/LatestNews'
import request from '../../../network'
import { getCurrentCity } from '../../../utils'
export default class index extends Component {
    state = {
        news: []
    }
    render() {
        const { news } = this.state
        return (
            <div>
                <NavBar centerContent="最新资讯" />
                <LatestNews news={news} />
            </div>
        )
    }
    getNewsData = async () => {
        const city = await getCurrentCity()
        const { data: { body: news } } = await request({ url: `/home/news?area=${city.value}` })
        this.setState({ news })
    }
    componentDidMount() {
        this.getNewsData()
    }
}

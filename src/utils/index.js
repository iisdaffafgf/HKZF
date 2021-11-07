import request from "../network";

// 获取本地存储当前定位的城市
export function getCurrentCity(city, useLocal) {
    // city：输入的城市名
    // useLocal：是否要优先使用本地存储中的数据
    return new Promise((resolve, reject) => {
        let currentCity;
        // 若没传useLocal：优先获取本地存储
        if (!useLocal) {
            currentCity = JSON.parse(localStorage.getItem('hkzf_city'))
        }
        // 若没有本地存储：网络请求获取
        if (!currentCity) {
            // 获取当前定位城市的id，若无当前城市(后台仅有北上广深的数据)，默认上海
            try {
                // 若传city参数：不使用定位，直接网络请求获取并添加到本地存储
                if (city !== undefined) {
                    request({
                        url: '/area/info',
                        params: {
                            name: city
                        }
                    }).then(res => {
                        localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
                        resolve(res.data.body)
                    })
                }
                // 若没传city参数：直接使用定位城市，根据定位城市请求城市详细数据，若无当前城市(后台仅有北上广深的数据)，默认上海
                else {
                    const myCity = new window.BMapGL.LocalCity();
                    myCity.get(res => {
                        request({
                            url: '/area/info',
                            params: {
                                name: res.name
                            }
                        }).then(res => {
                            localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
                            resolve(res.data.body)
                        })

                    })
                }
            } catch (error) {
                reject(error)
            }
        }
        // 若有本地存储：直接将获取到的本地存储中的数据传出去
        else {
            resolve(currentCity)
        }
    })
}



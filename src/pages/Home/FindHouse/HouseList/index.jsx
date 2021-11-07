
import React, { Component } from 'react'

import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import HousesItem from '../../../../components/HousesItem'
import request from '../../../../network'
import './index.css'
export default class index extends Component {

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        style, // Style object to be applied to row (to position it)
    }) => {
        const { list } = this.props
        const house = list[index]
        // console.log(key, house);
        if (!house) {
            return <div style={style} key={key}></div>
        }
        return <HousesItem item={house} key={key} style={style} />
    }
    // 判断列表中每一行是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.props.list[index]
    }
    // 用来获取更多房源数据
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(async resolve => {
            const { data: { body: { list } } } = await request({
                url: '/houses',
                params: {
                    cityId: this.props.city.value,
                    ...this.filtersParams,
                    start: startIndex,
                    end: stopIndex
                }
            })
            this.props.loadMoreHouse(list)
            // 数据加载完成时，调用resolve


        })
    }
    render() {
        const { count } = this.props
        return (
            <div className="house_list">
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.loadMoreRows}
                    rowCount={count}
                >
                    {({ onRowsRendered, registerChild }) => (
                        <WindowScroller >
                            {({ height, isScrolling, scrollTop }) => (
                                <AutoSizer>
                                    {
                                        ({ width }) => (
                                            <List
                                                ref={registerChild}
                                                onRowsRendered={onRowsRendered}
                                                autoHeight
                                                width={width}
                                                height={height}
                                                rowCount={count}
                                                isScrolling={isScrolling}
                                                scrollTop={scrollTop}
                                                rowHeight={120}
                                                rowRenderer={this.rowRenderer}
                                            />

                                        )
                                    }

                                </AutoSizer>
                            )}

                        </WindowScroller>
                    )}

                </InfiniteLoader>
            </div>

        )
    }
}

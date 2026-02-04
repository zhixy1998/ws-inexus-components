/*
 * Copyright (c) 2026 普析. All rights reserved.
 * This software is licensed under the MIT License.
 */

export interface ChartDataItem {
    x: number | string
    y: number | string
    marked: number
    feng: number
    gu: number

    [key: string]: any
}

// 定义线的配置类型
export interface ChartLinesData {
    name: string
    color?: string
    data?: ChartDataItem[]
}

export interface MarkPointItem {
    name: string
    coord: [number, number]
    symbol?: string
    symbolSize?: number
    itemStyle?: {
        color: string
    }
    label?: {
        show: boolean
        formatter?: string
        rich?: {
            [key: string]: any
        }
        [key: string]: any
    }

    [key: string]: any
}

export interface xAxisType {
    min: number | string
    max: number | string
}
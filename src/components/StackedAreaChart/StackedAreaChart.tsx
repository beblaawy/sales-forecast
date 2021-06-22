
import { useState, useEffect, useRef } from 'react'
import * as AmCore from '@amcharts/amcharts4/core'
import * as AmCharts from '@amcharts/amcharts4/charts'
import AmThemesAnimated from '@amcharts/amcharts4/themes/animated'

import './StackedAreaChart.styles.css'
import { getUniqueKeyValues } from '../../utils'
import {
  IStackedAreaChartProps,
  IGroupDataObjectsByDateProps,
} from './StackedAreaChart.interfaces'

/**
 * React linter assumes every method starting with "use" as hooks
 * and hooks doesn't work outside components
 * so, we need to disable lint for calling useTheme function
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
AmCore.useTheme(AmThemesAnimated)

/**
 * Group an array of objects by date.
 * 
 * @param array items
 * @param string dateKeyName
 * @returns object
 */
 export const groupDataObjectsByDate = ({
  data,
  yAxisKey,
  xAxisKey,
  seriesNameKey,
}: IGroupDataObjectsByDateProps): Array<object> => {
  const groupedItems: Array<object> = Object.values(data.reduce((data: any, item: any) => {
    const date = (new Date(item[xAxisKey])).toLocaleDateString('en-US')
    const seriesName = item[seriesNameKey]

    data[date] = {
      ...data[date],
      _groupedBy: date,
      [xAxisKey]: item[xAxisKey],
      [seriesName]: ((data[date] || {})[seriesName] || 0) + item[yAxisKey]
    }

    return data
  }, {}))

  return groupedItems.sort((a: any, b: any) => (a[xAxisKey] < b[xAxisKey] ? -1 : (a[xAxisKey] > b[xAxisKey] ? 1 : 0)))
}

export const StackedAreaChart = ({
  data,
  title,
  xAxisKey,
  yAxisKey,
  seriesNameKey,
  hasScrollbarX,
}: IStackedAreaChartProps) => {
  const chartElementRef = useRef<any>(null)
  const [chart, setChart] = useState<any>(null)
  const [chartTitle, setChartTitle] = useState<any>(null)
  const [colors] = useState<Array<string>>([
    '#54A3CD',
    '#C31F46',
    '#636568',
    '#ACC337',
    '#F3CE3B',
  ])

  useEffect(() => {
    const initiateChart = () => {
      const chart = AmCore.create(chartElementRef.current, AmCharts.XYChart)
      setChart(chart)

      // set chart title
      const chartTitle = chart.titles.create()
      chartTitle.text = title
      chartTitle.fontSize = 25
      chartTitle.marginBottom = 20
      setChartTitle(chartTitle)

      // set chart data
      chart.data = groupDataObjectsByDate({
        data,
        yAxisKey,
        xAxisKey,
        seriesNameKey,
      })

      chart.numberFormatter.numberFormat = '$#.##a'

      // date axis (xAxes)
      const dateAxis = chart.xAxes.push(new AmCharts.DateAxis())
      dateAxis.tooltip.disabled = false
      dateAxis.tooltip.background.fill = AmCore.color('#636568')
      dateAxis.tooltip.background.strokeWidth = 0
      dateAxis.renderer.minGridDistance = 70
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.5
      dateAxis.baseInterval = {
        timeUnit: 'day',
        count: 1
      }

      // show tooltips
      chart.cursor = new AmCharts.XYCursor()
      chart.cursor.xAxis = dateAxis
      
      // value axis (yAxis)
      const valueAxis = chart.yAxes.push(new AmCharts.ValueAxis())
      valueAxis.tooltip.disabled = false
      valueAxis.tooltip.background.fill = AmCore.color('#636568')
      valueAxis.tooltip.background.strokeWidth = 0
      
      getUniqueKeyValues(data, seriesNameKey).forEach((seriesName, seriesIndex) => {
        const series = chart.series.push(new AmCharts.LineSeries());
        series.name = seriesName
        series.fill = AmCore.color(colors[seriesIndex])
        series.stroke = AmCore.color(colors[seriesIndex])
        series.dataFields.dateX = '_groupedBy'
        series.dataFields.valueY = seriesName
        series.tooltipHTML = `<span style="font-size: 14px; color: #fff;"><b>${seriesName}: {valueY.value}</b></span>`
        series.tooltipText = '[#000]{valueY.value}[/]'
        series.tooltip.getFillFromObject = true
        series.tooltip.getStrokeFromObject = false
        series.tooltip.background.strokeWidth = 1
        series.sequencedInterpolation = true
        series.fillOpacity = 0.2
        series.stacked = true
        series.strokeWidth = 2
      })
      
      // Add a legend
      chart.legend = new AmCharts.Legend()
      chart.legend.position = 'top'

      // clean the chart
      return () => chart.dispose()
    }

    return initiateChart()
  }, [chartElementRef])

  useEffect(() => {
    if (chart) {
      chart.scrollbarX = hasScrollbarX ? new AmCore.Scrollbar() : null
    }
  }, [hasScrollbarX])

  useEffect(() => {
    if (chart) {
      chart.data = groupDataObjectsByDate({
        data,
        yAxisKey,
        xAxisKey,
        seriesNameKey,
      })
    }
  }, [data])

  useEffect(() => {
    if (chartTitle) {
      chartTitle.text = title
    }
  }, [title])

  return (
    <div ref={chartElementRef} className="stackedAreaChart" />
  )
}

export default StackedAreaChart


export type IStackedAreaChartDataType = Array<Object>

export interface IStackedAreaChartProps {
  title?: string
  xAxisKey: string
  yAxisKey: string
  seriesNameKey: string
  hasScrollbarX?: boolean
  data: IStackedAreaChartDataType
}

export interface IGroupDataObjectsByDateProps {
  yAxisKey: string
  xAxisKey: string
  seriesNameKey: string
  data: IStackedAreaChartDataType
}

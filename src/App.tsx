
import { useState } from 'react'
import { StackedAreaChart } from './components'
import salesData from './sales.json'

export const App = () => {
  const [stackedAreaChartData, setStackedAreaChartData] = useState<Array<object>>(salesData)

  const onClickShowRandomData = () => {
    setStackedAreaChartData(salesData.map((item) => ({
      ...item,
      sales: item.sales * Math.random()
    })))
  }

  return (
    <div className="app-container">
      <div className="container">
        <button
          className="showRandomDataButton"
          onClick={onClickShowRandomData}
        >
          Show random data
        </button>

        <StackedAreaChart
          yAxisKey="sales"
          xAxisKey="period"
          seriesNameKey="channel"
          data={stackedAreaChartData}
          title="Sales Forecast in National Market"
        />
      </div>
    </div>
  )
}

export default App

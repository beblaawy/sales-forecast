
import { StackedAreaChart } from './components'
import salesData from './sales.json'

export const App = () => {
  return (
    <div className="app-container">
      <div className="container">
        <StackedAreaChart
          data={salesData}
          yAxisKey="sales"
          xAxisKey="period"
          seriesNameKey="channel"
          title="Sales Forecast in National Market"
        />
      </div>
    </div>
  )
}

export default App

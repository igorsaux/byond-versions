import * as echarts from 'echarts'

type Data = {
  [date: string]: {
    versions: VersionsList
  }
}

type VersionsList = {
  [version: string]: number
}

const dataUri =
  'https://github-cdn.vercel.app/igorsaux/byond-versions/master/data.json'

function drawPieChart(data: Data) {
  const el = document.getElementById('pie-chart')!
  const dates = Object.keys(data)
  const lastDate = parseInt(dates[dates.length - 1])
  const lastData = data[lastDate].versions
  const resultData = []

  for (const key in lastData) {
    resultData.push({
      name: key,
      value: lastData[key],
    })
  }

  const lastUdateDate = document.getElementById('LastUpdatedDate')!
  const date = new Date(lastDate)

  lastUdateDate.innerText = `Обновлено: ${date.toLocaleString()}`

  const chart = echarts.init(el, 'dark')
  chart.setOption({
    textStyle: {
      fontFamily: 'PT Sans',
    },
    backgroundColor: '',
    tooltip: {
      trigger: 'item',
    },
    legend: {},
    layout: {
      padding: 0,
      autoPadding: false,
    },
    series: [
      {
        name: 'Версия серверов',
        type: 'pie',
        radius: ['40%', '70%'],
        data: resultData,
      },
    ],
  })
  window.addEventListener('resize', () => chart.resize())
}

function drawAreaChart(data: Data) {
  const el = document.getElementById('lines-chart')!
  const versionsHistory: {
    [version: string]: number[]
  } = {}
  const dates = Object.keys(data)

  let iteration = 0

  for (const i of dates) {
    const date = parseInt(i)
    const versies = data[date].versions

    for (const version in versies) {
      if (!versionsHistory[version]) {
        versionsHistory[version] = Array(iteration).fill(0)
      }

      versionsHistory[version].push(versies[version])
    }

    iteration++
  }

  const series = []

  for (const key in versionsHistory) {
    const history = versionsHistory[key]

    series.push({
      name: key,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      sampling: 'lttb',
      smooth: true,
      data: history,
    })
  }

  const xaxis = dates.map(d =>
    new Date(parseInt(d)).toLocaleDateString(undefined, {
      day: '2-digit',
      weekday: 'short',
      month: 'short',
    })
  )

  const chart = echarts.init(el, 'dark')
  chart.setOption({
    textStyle: {
      fontFamily: 'PT Sans',
    },
    backgroundColor: '',
    legend: {
      top: '30px',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          backgroundColor: '#6a7985',
        },
        lineStyle: {
          color: '#ffffff',
        },
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xaxis,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
      },
      {
        start: 0,
      },
    ],
    series: series,
  })
  window.addEventListener('resize', () => chart.resize())
}

async function main() {
  const request = await fetch(dataUri)
  const data = (await request.json()) as Data

  drawPieChart(data)
  drawAreaChart(data)
}

main()

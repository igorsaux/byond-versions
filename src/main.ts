import ApexCharts from 'apexcharts'

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
  const series = Object.values(lastData)
  const labels = Object.keys(lastData)

  const lastUdateDate = document.getElementById('LastUpdatedDate')!
  const date = new Date(lastDate)

  lastUdateDate.innerText = `Обновлено: ${date.toLocaleString()}`

  const chart = new ApexCharts(el, {
    series,
    labels,
    chart: {
      type: 'pie',
      fontFamily: 'Fira Sans',
    },
    theme: {
      mode: 'dark',
    },
  })

  chart.render()
}

function drawAreaChart(data: Data) {
  const el = document.getElementById('lines-chart')
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

  const series: {
    name: string
    data: number[]
  }[] = []

  const xaxis: {
    categories: string[]
  } = {
    categories: [],
  }

  for (const key in versionsHistory) {
    const history = versionsHistory[key]

    series.push({
      name: key,
      data: history,
    })
  }

  xaxis.categories = dates.map(d => new Date(parseInt(d)).toLocaleDateString())

  const chart = new ApexCharts(el, {
    series,
    chart: {
      type: 'area',
      height: 300,
      zoom: {
        enabled: false,
      },
      toolbar: {
        autoSelected: 'pan',
        show: false,
      },
      fontFamily: 'Fira Sans',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    theme: {
      mode: 'dark',
    },
    xaxis,
  })

  chart.render()
}

async function main() {
  const request = await fetch(dataUri)
  const data = (await request.json()) as Data

  drawPieChart(data)
  drawAreaChart(data)
}

main()

import ApexCharts from 'apexcharts'

type Data = {
  [date: number]: {
    versions: number[]
  }
}

type NormalizedData = {
  [date: number]: {
    [version: number]: number
  }
}

const dataUri =
  'https://github-cdn.vercel.app/igorsaux/byond-versions/scrapper/data.json'

function normalizeData(data: Data) {
  const normalized: NormalizedData = {}

  for (const key of Object.keys(data)) {
    const date = parseInt(key)
    const dataSection = data[date]
    const versions: {
      [version: number]: number
    } = {}

    dataSection.versions.forEach(v => {
      versions[v] = versions[v] ? versions[v] + 1 : 1
    })

    normalized[date] = versions
  }

  return normalized
}

function drawPieChart(data: NormalizedData) {
  const el = document.getElementById('pie-chart')!
  const dates = Object.keys(data)
  const lastDate = parseInt(dates[dates.length - 1])
  const lastData = data[lastDate]
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
    },
  })

  chart.render()
}

function drawAreaChart(data: NormalizedData) {
  const el = document.getElementById('lines-chart')
  const versionsHistory: {
    [version: number]: number[]
  } = {}
  const dates = Object.keys(data)

  for (const i of dates) {
    const date = parseInt(i)
    const versies = data[date]

    for (const version in versies) {
      if (!versionsHistory[version]) {
        versionsHistory[version] = [versies[version]]
      } else {
        versionsHistory[version].push(versies[version])
      }
    }
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
    xaxis,
  })

  chart.render()
}

async function main() {
  const request = await fetch(dataUri)
  const data = (await request.json()) as Data
  const normalized = normalizeData(data)

  drawPieChart(normalized)
  drawAreaChart(normalized)
}

main()

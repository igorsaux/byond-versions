type Data = {
  [date: string]: {
    versions: VersionsList
  }
}

type VersionsList = {
  [version: string]: number
}

async function parseVersions(): Promise<VersionsList> {
  const request = await fetch(
    'http://www.byond.com/games/Exadv1/SpaceStation13?format=text'
  )
  const result = await request.text()
  const versions: VersionsList = {}
  const regex = /\tserver_version = (?<version>\d+)/g

  const matches = result.matchAll(regex)

  for (const match of matches) {
    const groups = match.groups

    if (!groups) {
      continue
    }

    const version = groups['version']

    if (!versions[version]) {
      versions[version] = 1
    } else {
      versions[version] += 1
    }
  }

  return versions
}

async function getData(): Promise<Data> {
  const raw = await Deno.readTextFile('./data.json')

  return JSON.parse(raw)
}

async function saveData(data: Data) {
  return await Deno.writeTextFile('./data.json', JSON.stringify(data))
}

const now = Date.now()
const versions = await parseVersions()
const oldData = await getData()

oldData[now] = {
  versions
}

await saveData(oldData)

export type MetricValue = {
  id: string
  headerId: string
  value: number
  label: string
  color: `#${string}`
}

export type Metric = {
  id: string
  title: string
  description: string
  valueMin: number
  valueMax: number
  valueStep: number
  valueUnit: string
  domainId: string
  values: MetricValue[]
}

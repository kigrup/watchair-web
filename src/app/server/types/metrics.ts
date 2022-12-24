export type MetricValue = {
  id: string
  headerId: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  label: string
  color: `#${string}`
}

export type Metric = {
  id: string
  title: string
  description: string
  domainId: string
  values: MetricValue[]
}

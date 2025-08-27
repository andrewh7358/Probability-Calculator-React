import React, { FormEvent, useState } from 'react'
import { calculate } from './calculate'
import { Form } from './Form'
import './styles.css'

export interface Params {
  p: string
  n: string
  r: string
}

export type Mode = 'atLeast' | 'exactly' | 'atMost'

const modeMap = {
  'atLeast': 'at least',
  'exactly': 'exactly',
  'atMost': 'at most'
}

export const App = () => {
  // p: probability, n: number of events, r: number of successes
  const [params, setParams] = useState({ p: '0.5', n: '10', r: '5' } as Params)
  const [mode, setMode] = useState('atLeast' as Mode)
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState([] as string[])

  const onParamChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement
    setParams({ ...params, [name]: value })
  }

  const onModeChange = (e: FormEvent) => {
    const { value } = e.target as HTMLInputElement
    setMode(value as Mode)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const p = Number(params.p)
    const n = Number(params.n)
    const r = Number(params.r)

    if (isNaN(p) || p < 0 || p > 1) {
      setOutput('error, p needs to be a decimal between 0 and 1, inclusive')
      return
    }

    if (isNaN(n) || n < 1 || n > 150 || n % 1 !== 0) {
      setOutput('error, n needs to be an integer between 1 and 150, inclusive')
      return
    }

    if (isNaN(r) || r < 0 || r > n || r % 1 !== 0) {
      setOutput('error, r needs to be an integer between 0 and n, inclusive')
      return
    }

    let chance
    if (mode === 'atLeast') {
      // 1 - P(r - 1) - ... - P(0)
      chance = 1
      let curr = r - 1

      while (curr >= 0) {
        chance -= calculate(p, n, curr)
        curr -= 1
      }
    } else if (mode === 'exactly') {
      // P(r)
      chance = calculate(p, n, r)
    } else {
      // P(0) + ... + P(r)
      chance = 0
      let curr = 0
      
      while (curr <= r) {
        chance += calculate(p, n, curr)
        curr += 1
      }
    }

    // remove -0 as output and standardize
    chance = chance === 0 ? 0 : chance * 100
    const chanceOutput = Number(chance.toFixed(4))
    const modeText = modeMap[mode]
    const pOutput = Number((p * 100).toFixed(4))
    const nPlural = n === 1 ? 'event' : 'events'
    const rPlural = r === 1 ? 'success' : 'successes'

    setHistory([output].concat(history).slice(0, 5))
    setOutput(`${chanceOutput}% chance of ${modeText} ${r} ${rPlural} in ${n} ${nPlural} at ${pOutput}% probability`)
  }

  const historyList = history.map((item, index) => <h2 key={'hist' + index}>{item}</h2>)

  return (
    <>
      <h1>Probability Calculator</h1>
      <div className='title'>Calculate the chance of r successes in n events at probability p</div>
      <Form params={params} mode={mode} onSubmit={onSubmit} onParamChange={onParamChange} onModeChange={onModeChange} />
      <h2>{output}</h2>
      <hr />
      <h2>History</h2>
      {historyList}
    </>
  )
}

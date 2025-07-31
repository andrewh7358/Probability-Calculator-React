import React, { FormEvent, useState } from 'react'
import { calculate } from './calculate'
import './styles.css'

interface Params {
  p: string
  n: string
  r: string
}

type Mode = 'atLeast' | 'exactly' | 'atMost'

const modeMap = {
  'atLeast': 'at least',
  'exactly': 'exactly',
  'atMost': 'at most'
}

const App = () => {
  // p: probability, n: number events, r: number successes
  const [params, setParams] = useState({ p: '0.5', n: '10', r: '5' } as Params)
  const [mode, setMode] = useState('atLeast' as Mode)
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState([] as string[])

  const historyList = history.map((v, i) => <h2 key={'hist' + i}>{v}</h2>)

  const onParamChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement
    setParams({ ...params, [name]: value })
  }

  const onModeChange = (e: FormEvent) => {
    const { value } = e.target as HTMLInputElement
    setMode(value as Mode)
  }

  const onSubmit = (e: FormEvent, params: Params) => {
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
    }
    else if (mode === 'exactly') {
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

    // remove -0 as output
    chance = chance === 0 ? 0 : chance * 100
    const chanceOutput = Number(chance.toFixed(4))
    const isExact = chanceOutput === chance
    const modeOutput = modeMap[mode]
    const pOutput = Number((p * 100).toFixed(4))
    const nPlural = n === 1 ? 'event' : 'events'
    const rPlural = r === 1 ? 'success' : 'successes'

    setHistory([output].concat(history).slice(0, 5))
    setOutput(`${isExact ? '': 'about '}${chanceOutput}% chance of ${modeOutput} ${r} ${rPlural} in ${n} ${nPlural} at ${pOutput}% probability`)
  }

  return (
    <>
      <h1>Calculate the chance of r successes in n events at probability p</h1>
      <form onSubmit={(e) => onSubmit(e, params)}>
        <label>
          p:
          <input type='text' name={'p'} value={params.p} onChange={onParamChange}/>
        </label>
        <br />
        <label>
          n:
          <input type='number' name={'n'} value={params.n} onChange={onParamChange}/>
        </label>
        <br />
        <label>
          r:
          <input type='number' name={'r'} value={params.r} onChange={onParamChange}/>
        </label>
        <br />
        <label>
          <input type='radio' value='atLeast' checked={mode === 'atLeast'} onChange={onModeChange} />
          At Least
        </label>
        <label>
          <input type='radio' value='exactly' checked={mode === 'exactly'} onChange={onModeChange} />
          Exactly
        </label>
        <label>
          <input type='radio' value='atMost' checked={mode === 'atMost'} onChange={onModeChange} />
          At Most
        </label>
        <br />
        <button type='submit'>Calculate</button>
      </form>
      <h1>{output}</h1>
      <hr />
      <h1>History</h1>
      {historyList}
    </>
  )
}

export default App

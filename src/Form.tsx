import React, { FormEvent } from 'react'
import { Mode, Params } from './App'

interface FormProps {
  params: Params
  mode: Mode
  onSubmit: (e: FormEvent) => void
  onParamChange: (e: FormEvent) => void
  onModeChange: (e: FormEvent) => void
}

export const Form = ({ params, mode, onSubmit, onParamChange, onModeChange }: FormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor='p'>p: </label>
        <input id='p' type='text' name={'p'} value={params.p} onChange={onParamChange} />
      </div>
      <div>
        <label htmlFor='n'>n: </label>
        <input id='n' type='number' name={'n'} value={params.n} onChange={onParamChange} />
      </div>
      <div>
        <label htmlFor='r'>r: </label>
        <input id='r' type='number' name={'r'} value={params.r} onChange={onParamChange} />
      </div>
      <div>
        <label htmlFor='atLeast'>At Least: </label>
        <input id='atLeast' type='radio' value='atLeast' checked={mode === 'atLeast'} onChange={onModeChange} />
        <text> | </text>
        <label htmlFor='exactly'>Exactly: </label>
        <input id='exactly' type='radio' value='exactly' checked={mode === 'exactly'} onChange={onModeChange} />
        <text> | </text>
        <label htmlFor='atMost'>At Most: </label>
        <input id='atMost' type='radio' value='atMost' checked={mode === 'atMost'} onChange={onModeChange} />
      </div>
      <button type='submit'>Calculate</button>
    </form>
  )
}

import { factorial } from './factorial'

// p^r * (1 - p)^(n - r) * n! / (n - r)! / r!
export const calculate = (p: number, n: number, r: number): number => {
  return Math.pow(p, r) * Math.pow(1 - p, n - r) * factorial(n) / factorial(n - r) / factorial(r)
}

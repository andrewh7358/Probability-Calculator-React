const memo = new Map<number, number>() 
memo.set(0, 1)
memo.set(1, 1)

export const factorial = (n: number): number => {
  if (memo.has(n)) {
    return memo.get(n)!
  }

  const ret = n * factorial(n - 1)
  memo.set(n, ret)
  return ret
}

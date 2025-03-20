export function quickSort<T> (arr: Array<T>): Array<T> {
  if (arr.length <= 1) {
    return arr
  }
  const left: Array<T> = []
  const right: Array<T> = []
  const mid = arr.splice(Math.floor(arr.length / 2), 1)[0]
  
  for (const element of arr) {
    if (element < mid) {
      left.push(element)
    } else {
      right.push(element)
    }
  }
  
  return quickSort(left).concat(mid, quickSort(right))
}

// const arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
// const sortedArr = quickSort(arr)
// console.log(sortedArr)

export {}
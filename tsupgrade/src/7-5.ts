import { quickSort } from "./7-3"
import { sortChinese, containsChinese } from "./7-4"
const chineseArr = ["张三", "李四", "王五", "赵六", "钱七"]

function strSelfSort (str: string): string {
  const strArr = str.split("")
  const sortedStrArr = quickSort(strArr)
  return sortedStrArr.join("")
}

export function sort<T> (data: T ): Array<any> | string | undefined {
  if (data instanceof Array) {
    if (containsChinese(data)) {
      return sortChinese(data)
    } else {
      return quickSort(data)
    }
  } else if (typeof data === "string") {
    return strSelfSort(data)
  }
}

console.log(sort(['asdf', 'qwer', 'bxcv']))

export {}
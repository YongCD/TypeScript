import { quickSort } from "./7-3"
const chineseArr = ["张三", "李四", "王五", "赵六", "钱七"]

export function sortChinese (arr: Array<string>): Array<string> {
  return arr.sort(function (preStr, curStr) {
    return preStr.localeCompare(curStr, "zh")
  })
}

// const sortedChineseArr = sortChinese(chineseArr)
// console.log(sortedChineseArr)

// 检测是否包含中文
export function containsChinese(arr: Array<string>): boolean {
  return arr.some((str) => /[\u4e00-\u9fa5]/.test(str))
}

export {}

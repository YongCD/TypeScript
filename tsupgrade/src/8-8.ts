// 扁平模块化属性名
type Modules = {
  menu: {
    setActiveIndex: (index: string) => string
    setCollapse: (index: string) => string
  }
  tabs: {
    seteditableTabsValue: (editValue: string) => void
    setTabs: (index: string) => void
    setTabsList: (index: string) => void
  }
}

type MB<T, U> = `${T & string}/${U & string}`

type ModulesSpliceKeys<T> = {
  [key in keyof T]: MB<key, keyof T[key]>
} [keyof T]
// 这是关键点，[keyof T] 是在从上面创建的映射类型中提取所有属性值，并将它们合并为一个联合类型。

type TestResult = ModulesSpliceKeys<Modules>
// 结果：type TestResult = "menu/setActiveIndex" | "menu/setCollapse" | "tabs/seteditableTabsValue" | "tabs/setTabs" | "tabs/setTabsList"

type Test = {
  a: '1' | '2'
  b: '3' | '4'
}

type Test1 = Test[keyof Test] // 结果：type Test1 = "1" | "2" | "3" | "4"

export {}

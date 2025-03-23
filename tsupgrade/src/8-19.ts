interface Todo {
  title: string
  completed: boolean
  description: string
  add(): number
  del(): number
  upt(): number
}

type Degree<T extends object> = {
  [K in keyof T as T[K] extends Extract<T[K], Function> ? `do${Capitalize<K & string>}` : never]: T[K]
}

type DegreeTodo = Degree<Array<any>>

export {}

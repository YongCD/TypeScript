type MyType<T> = {
  [key in keyof T]: T[key]
}

interface A {
  a: number
  b: string
}

const a: A = {
  a: 1,
  b: 'hello'
}

type B = MyType<typeof a>
export {}

# 1 Exclude<T, U>
- Exclude<T, U> 从类型 T 中排除可以赋值给 U 的类型。  
- 一般用于处理联合类型
```typescript
type T = string | number | boolean;
type U = string | number;
type Result = Exclude<T, U>; // boolean
```

# 2 Extract<T, U>
- Extract<T, U> 从类型 T 中提取可以赋值给 U 的类型。
- 和 Extract 正好相反，也是用于处理联合类型
```typescript
type T = string | number | boolean;
type U = string | number;
type Result = Extract<T, U>; // string | number
```

# 3 Pick<T, K>
- Pick<T, K> 从类型 T 中选择一组属性 K 来构造新类型。
- K 必须是 T 的键的子集
```typescript
interface Person {
  name: string;
  age: number;
  address: string;
}
type PersonNameAndAge = Pick<Person, 'name' | 'age'>; // { name: string; age: number; }
```

# 4 Omit<T, K>
- Omit<T, K> 从类型 T 中删除一组属性 K 来构造新类型。
- 与 Pick 相反，它保留不在 K 中的属性
```typescript
interface Person {
  name: string;
  age: number;
  address: string;
}
type PersonWithoutAddress = Omit<Person, 'address'>; // { name: string; age: number; }
```

# 5 Partial<T>
- Partial<T> 将类型 T 的所有属性设置为可选。
- 常用于更新对象的场景
```typescript
interface Person {
  name: string;
  age: number;
}
type PartialPerson = Partial<Person>; // { name?: string; age?: number; }
```

# 6 Required<T>
- Required<T> 将类型 T 的所有属性设置为必需。
- 与 Partial 相反
```typescript
interface Person {
  name?: string;
  age?: number;
}
type RequiredPerson = Required<Person>; // { name: string; age: number; }
```

# 7 Readonly<T>
- Readonly<T> 将类型 T 的所有属性设置为只读。
- 常用于防止对象被修改
```typescript
interface Person {
  name: string;
  age: number;
}
type ReadonlyPerson = Readonly<Person>; // { readonly name: string; readonly age: number; }
```

# 8 Record<K, T>
- Record<K, T> 构造一个类型，其属性名的类型为 K，属性值的类型为 T。
- 常用于创建对象映射
```typescript
type Fruits = 'apple' | 'banana' | 'orange';
type FruitCounts = Record<Fruits, number>;
// 等同于 { apple: number; banana: number; orange: number; }
```

# 9 NonNullable<T>
- NonNullable<T> 从类型 T 中排除 null 和 undefined。
```typescript
type T = string | number | null | undefined;
type NonNullableT = NonNullable<T>; // string | number
```

# 10 Parameters<T>
- Parameters<T> 获取函数类型 T 的参数类型，返回一个元组类型。
```typescript
function greet(name: string, age: number): void {}
type GreetParams = Parameters<typeof greet>; // [string, number]
```

# 11 ReturnType<T>
- ReturnType<T> 获取函数类型 T 的返回类型。
```typescript
function createUser() {
  return { name: 'John', age: 30 };
}
type User = ReturnType<typeof createUser>; // { name: string; age: number; }
```

# 12 InstanceType<T>
- InstanceType<T> 获取构造函数类型 T 的实例类型。
```typescript
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
type PersonInstance = InstanceType<typeof Person>; // Person
```

# 13 ThisParameterType<T>
- ThisParameterType<T> 获取函数类型 T 的 this 参数的类型。
```typescript
function toHex(this: Number): string {
  return this.toString(16);
}
type ToHexThisType = ThisParameterType<typeof toHex>; // Number
```

# 14 OmitThisParameter<T>
- OmitThisParameter<T> 移除函数类型 T 的 this 参数类型。
```typescript
function toHex(this: Number): string {
  return this.toString(16);
}
type ToHexWithoutThis = OmitThisParameter<typeof toHex>; // () => string
```

# 15 ConstructorParameters<T>
- ConstructorParameters<T> 获取构造函数类型 T 的参数类型，返回一个元组类型。
```typescript
class Person {
  constructor(name: string, age: number) {}
}
type PersonConstructorParams = ConstructorParameters<typeof Person>; // [string, number]
```

# 16 Awaited<T>
- Awaited<T> 递归解包 Promise 类型，获取最终的非 Promise 类型。
- TypeScript 4.5 引入
```typescript
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
```

# 17 infer 关键字
- infer 关键字用于在条件类型中推断类型变量。
- 常用于自定义工具类型
```typescript
// 提取数组元素类型
type ElementOf<T> = T extends Array<infer E> ? E : never;
type NumberArray = number[];
type Number = ElementOf<NumberArray>; // number
```

# 18 ThisType<T>
- ThisType<T> 用于指定对象字面量中方法的 this 类型。
- 不会返回转换过的类型，只在对象字面量中发挥作用
```typescript
interface ThisContext {
  id: number;
  getName(): string;
}

const obj: ThisType<ThisContext> = {
  method() {
    return this.getName(); // 此处的 this 类型为 ThisContext
  }
};
```

# 19 Uppercase<T>
- Uppercase<T> 将字符串字面量类型转换为大写形式。
- TypeScript 4.1 引入
```typescript
type Message = "hello world";
type UppercaseMessage = Uppercase<Message>; // "HELLO WORLD"
```

# 20 Lowercase<T>
- Lowercase<T> 将字符串字面量类型转换为小写形式。
- TypeScript 4.1 引入
```typescript
type Message = "HELLO WORLD";
type LowercaseMessage = Lowercase<Message>; // "hello world"
```

# 21 Capitalize<T>
- Capitalize<T> 将字符串字面量类型的首字母转换为大写形式。
- TypeScript 4.1 引入
```typescript
type Message = "hello world";
type CapitalizedMessage = Capitalize<Message>; // "Hello world"
```

# 22 Uncapitalize<T>
- Uncapitalize<T> 将字符串字面量类型的首字母转换为小写形式。
- TypeScript 4.1 引入
```typescript
type Message = "Hello World";
type UncapitalizedMessage = Uncapitalize<Message>; // "hello World"
```

# 23 联合类型和交叉类型
- 联合类型（Union）使用 `|` 符号，表示可以是多种类型中的一种
- 交叉类型（Intersection）使用 `&` 符号，表示同时满足多种类型
```typescript
// 联合类型
type StringOrNumber = string | number;

// 交叉类型
type PersonWithRole = Person & { role: string };
```

# 24 条件类型（Conditional Types）
- 条件类型使用 `extends` 关键字，根据条件来决定最终的类型
```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<123>; // false
```

# 25 映射类型（Mapped Types）
- 映射类型可以基于旧类型创建新类型，同时转换属性
```typescript
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Person = { name: string; age: number };
type NullablePerson = Nullable<Person>; // { name: string | null; age: number | null; }
```

# 26 索引类型（Indexed Access Types）
- 通过 `T[K]` 语法访问类型的属性类型
```typescript
type Person = { name: string; age: number };
type AgeType = Person["age"]; // number
```

# 27 字面量类型（Literal Types）
- 字面量类型是精确的值类型，而不是更宽泛的类型如 string 或 number
```typescript
type Direction = "north" | "south" | "east" | "west";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
```

# 28 模板字面量类型（Template Literal Types）
- TypeScript 4.1 引入，允许通过模板字符串语法构造类型
```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailAddress = `${string}@${string}.${string}`;
```

# 29 深度部分可选（DeepPartial）
- 递归地将嵌套对象的所有属性设为可选
- 这是一个自定义工具类型，TypeScript 标准库中没有
```typescript
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

interface NestedObj {
  a: {
    b: {
      c: string;
    }
  }
}

type PartialNested = DeepPartial<NestedObj>;
// { a?: { b?: { c?: string } } }
```

# 30 值类型提取（ValueOf）
- 提取对象类型中所有值的类型
- 这是一个自定义工具类型
```typescript
type ValueOf<T> = T[keyof T];

const colors = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff'
};

type ColorValue = ValueOf<typeof colors>; // string
```

# 31 基于类型的键提取（KeysOfType）
- 从对象中提取特定类型的键
- 这是一个自定义工具类型
```typescript
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T];

interface Person {
  name: string;
  age: number;
  isActive: boolean;
}

type StringKeys = KeysOfType<Person, string>; // "name"
```

# 32 可变版本（Mutable）
- 移除 readonly 修饰符，与 Readonly 相反
- 这是一个自定义工具类型
```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
};

type ReadonlyPerson = {
  readonly name: string;
  readonly age: number;
};

type MutablePerson = Mutable<ReadonlyPerson>; // { name: string; age: number; }
```

# 33 函数重载的类型处理
- TypeScript 支持函数重载，可以通过多个函数声明提供不同的参数和返回类型
```typescript
function process(x: number): number;
function process(x: string): string;
function process(x: number | string): number | string {
  return typeof x === 'number' ? x * 2 : x.toUpperCase();
}
```

# 34 递归类型（Recursive Types）
- 类型可以递归引用自身，用于表示树形结构等数据
```typescript
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};

// 用法
const tree: TreeNode<string> = {
  value: 'root',
  children: [
    {
      value: 'child1',
      children: []
    },
    {
      value: 'child2',
      children: [
        {
          value: 'grandchild',
          children: []
        }
      ]
    }
  ]
};
```
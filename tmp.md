# 14 类型断言、类型转换和应用场景

类型断言和类型转换是 TypeScript 中处理类型关系的重要机制。它们帮助开发者在特定情况下绕过或增强类型系统的限制，使代码更加灵活和实用。本章将详细探讨类型断言的不同形式、应用场景以及最佳实践。

## 14.1 类型断言基础

类型断言是一种告诉编译器"相信我，我知道我在做什么"的方式，它允许你覆盖 TypeScript 的类型推断，并以你认为更准确的方式处理类型。

### 14.1.1 类型断言的两种语法形式

TypeScript 提供了两种语法形式来进行类型断言：

1. **尖括号语法**：较早的语法形式，在 JSX 中可能会产生冲突
2. **as 语法**：更现代的方式，与 JSX 兼容，推荐使用

```typescript
// 尖括号语法
let someValue: unknown = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法（推荐）
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
```

### 14.1.2 类型断言的基本规则

类型断言有一些基本限制：

1. 只能断言为更具体或更不具体的类型（在 `--strictNullChecks` 关闭时）
2. 在 `--strictNullChecks` 开启时，只能断言为联合类型中的一个成员

```typescript
// 有效的断言 - 从不具体到具体
let value: any = "string value";
let length: number = (value as string).length;

// 有效的断言 - 联合类型到特定类型
let id: string | number = "abc123";
let idStr: string = id as string;

// 无效的断言 - 不相关类型之间不能直接断言
// let value: string = "string value";
// let num: number = value as number; // 错误：'string' 和 'number' 之间不存在重叠
```

## 14.2 类型断言的常见应用场景

### 14.2.1 处理 DOM 元素

使用类型断言处理 DOM 操作是一个常见场景：

```typescript
// 获取特定类型的 DOM 元素
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;

// 或者更安全的方式
const myCanvas = document.getElementById('main_canvas');
if (myCanvas instanceof HTMLCanvasElement) {
  const ctx = myCanvas.getContext('2d');
  // 使用 canvas 上下文
}
```

### 14.2.2 处理事件对象

类型断言在处理事件时非常有用：

```typescript
// 处理事件对象
document.addEventListener('click', (event) => {
  const mouseEvent = event as MouseEvent;
  console.log(`Mouse clicked at: ${mouseEvent.clientX}, ${mouseEvent.clientY}`);
});

// 处理表单元素
document.addEventListener('submit', (event) => {
  const formEvent = event as SubmitEvent;
  const form = formEvent.target as HTMLFormElement;
  
  // 获取表单数据
  const formData = new FormData(form);
  const username = formData.get('username') as string;
  // 进行处理
});
```

### 14.2.3 API 响应处理

当处理 API 响应时，类型断言可以帮助你指定预期的数据结构：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 获取用户数据
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  // 断言 API 返回的数据符合 User 接口
  return data as User;
}

// 更安全的做法是添加运行时验证
async function fetchUserSafely(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  // 添加运行时检查
  if (typeof data.id !== 'number' || typeof data.name !== 'string' || typeof data.email !== 'string') {
    throw new Error('Invalid user data received');
  }
  
  return data as User;
}
```

### 14.2.4 处理 unknown 类型

`unknown` 类型需要类型断言或类型守卫才能安全使用：

```typescript
function processData(data: unknown): string {
  // 使用类型断言处理 unknown 类型
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  
  if (typeof data === 'number') {
    return (data as number).toFixed(2);
  }
  
  if (data instanceof Date) {
    return (data as Date).toISOString();
  }
  
  return String(data);
}
```

## 14.3 双重断言

有时需要使用双重断言来绕过类型系统的安全检查。这种做法应该谨慎使用，因为它会完全绕过类型系统的保护。

```typescript
// 双重断言示例
let value: string = "hello";

// 直接断言会出错
// let num: number = value as number; // 错误

// 双重断言 - 先断言为 unknown，再断言为目标类型
let num: number = value as unknown as number; // 可以编译，但运行时可能有问题
```

## 14.4 常量断言

TypeScript 3.4 引入了常量断言，它可以将表达式的类型转换为更具体的字面量类型：

```typescript
// 没有断言 - 类型被推断为 string
let s1 = "hello";  // 类型: string

// 常量断言 - 类型被锁定为特定的字符串字面量
let s2 = "hello" as const;  // 类型: "hello"

// 对象的常量断言
const obj = { 
  name: "Alice",
  age: 30
} as const;

// obj 的类型为: { readonly name: "Alice"; readonly age: 30; }
// obj.name = "Bob"; // 错误：无法分配到 'name' ，因为它是只读属性

// 数组的常量断言
const arr = [1, 2, 3] as const; // 类型: readonly [1, 2, 3]
// arr.push(4); // 错误：属性'push'在类型'readonly [1, 2, 3]'上不存在
```

常量断言特别适合用于定义不可变的配置对象或常量值。

## 14.5 非空断言

TypeScript 2.0 引入了非空断言操作符 `!`，用于从类型中移除 `null` 和 `undefined`：

```typescript
// 非空断言示例
function processElement(id: string) {
  // '!' 告诉编译器该元素一定存在
  const element = document.getElementById(id)!;
  element.textContent = 'Hello'; // 无需检查 null
}

// 在可选链之后使用非空断言
type Person = { name: string; address?: { street: string } };

function getStreet(person: Person): string {
  // 断言 address 一定存在
  return person.address!.street;
}

// 更安全的方式是使用条件检查
function getStreetSafely(person: Person): string | undefined {
  return person.address?.street;
}
```

非空断言在你确定值不会为 null 或 undefined 时很有用，但应谨慎使用，因为它可能导致运行时错误。

## 14.6 类型守卫与类型断言

类型守卫通常比类型断言更安全，因为它们在运行时执行类型检查：

```typescript
// 基于 typeof 的类型守卫
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // 这里 TypeScript 知道 value 是 string 类型
    return value.toUpperCase();
  }
  
  // 这里 TypeScript 知道 value 是 number 类型
  return value.toFixed(2);
}

// 基于 instanceof 的类型守卫
function getArea(shape: Circle | Rectangle) {
  if (shape instanceof Circle) {
    // 这里 TypeScript 知道 shape 是 Circle 类型
    return Math.PI * shape.radius ** 2;
  }
  
  // 这里 TypeScript 知道 shape 是 Rectangle 类型
  return shape.width * shape.height;
}

// 自定义类型守卫
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function feedPet(pet: Fish | Bird) {
  if (isFish(pet)) {
    // 这里 TypeScript 知道 pet 是 Fish 类型
    pet.swim();
    return 'fish food';
  } else {
    // 这里 TypeScript 知道 pet 是 Bird 类型
    pet.fly();
    return 'bird food';
  }
}
```

## 14.7 const 类型参数 (TypeScript 5.0+)

TypeScript 5.0 引入了 `const` 类型参数，这是一种在泛型函数调用中应用 `as const` 的便捷方式：

```typescript
// 不使用 const 类型参数
function createUser<T>(name: T) {
  return { name };
}

// name 的类型是 string
const user1 = createUser("Alice");

// 使用常量断言
const user2 = createUser("Alice" as const);

// 使用 const 类型参数 (TypeScript 5.0+)
const user3 = createUser<const>("Alice");
// user3 的类型是 { name: "Alice" }
```

## 14.8 satisfies 操作符 (TypeScript 4.9+)

TypeScript 4.9 引入了 `satisfies` 操作符，它允许你验证表达式的类型符合某个类型，同时保留表达式的精确类型：

```typescript
type ColorRGB = { r: number; g: number; b: number };
type ColorHSL = { h: number; s: number; l: number };
type Color = ColorRGB | ColorHSL;

// 使用 satisfies 操作符
const redRGB = { r: 255, g: 0, b: 0 } satisfies ColorRGB;
// redRGB 的类型是 { r: number; g: number; b: number }

// 不使用 satisfies 时
const blueRGB: ColorRGB = { r: 0, g: 0, b: 255 };
// blueRGB 的类型是 ColorRGB

// satisfies 的优势：保留字面量类型
const palette = {
  red: { r: 255, g: 0, b: 0 },
  green: { h: 120, s: 100, l: 50 },
  blue: { r: 0, g: 0, b: 255 }
} satisfies Record<string, Color>;

// 可以访问特定属性
const redComponent = palette.red.r; // OK
const greenHue = palette.green.h;   // OK

// 如果使用类型标注，就无法访问特定属性
// const paletteLessAccurate: Record<string, Color> = {
//   red: { r: 255, g: 0, b: 0 },
//   green: { h: 120, s: 100, l: 50 },
//   blue: { r: 0, g: 0, b: 255 }
// };
// paletteLessAccurate.green.h // 错误：属性 'h' 不存在于类型 'Color' 上
```

## 14.9 安全地使用类型断言的最佳实践

类型断言是一个强大的工具，但不当使用可能导致运行时错误。以下是一些最佳实践：

1. **优先使用类型守卫**：尽可能使用 `typeof`、`instanceof` 或自定义类型守卫，而不是类型断言。

2. **添加运行时检查**：特别是处理外部数据时，结合类型断言和运行时验证。

3. **限制使用非空断言**：使用条件检查或可选链（`?.`）代替非空断言（`!`）。

4. **避免双重断言**：除非绝对必要，否则避免使用 `as unknown as T` 这样的双重断言。

5. **使用 `satisfies` 而非纯类型断言**：在 TypeScript 4.9+ 中，优先考虑使用 `satisfies` 操作符。

6. **为断言添加注释**：当使用类型断言时，用注释解释为什么断言是安全的。

```typescript
// 示例：组合类型守卫和断言的安全模式
interface ApiResponse {
  data: unknown;
  status: number;
}

function processApiResponse(response: ApiResponse): string[] {
  if (
    response.status === 200 &&
    Array.isArray(response.data) &&
    response.data.every(item => typeof item === "string")
  ) {
    // 安全的断言，因为我们已经验证了数据类型
    return response.data as string[];
  }
  
  return [];
}
```

## 14.10 实际应用案例

### 14.10.1 状态管理中的类型断言

```typescript
// Redux-like状态管理
type State = {
  user: {
    id: number;
    name: string;
  } | null;
  posts: Array<{
    id: number;
    title: string;
  }>;
  ui: {
    theme: 'light' | 'dark';
    sidebar: boolean;
  };
};

// 处理深层嵌套状态
function getUserName(state: State): string {
  // 使用类型守卫
  if (state.user) {
    return state.user.name;
  }
  
  return 'Guest';
}

// 状态更新函数
function updateState(state: State, path: string, value: unknown): State {
  const newState = { ...state };
  const parts = path.split('.');
  let current: any = newState;
  
  // 遍历路径，直到倒数第二部分
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = { ...current[part] };
    current = current[part];
  }
  
  // 设置最终值
  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
  
  return newState;
}

// 使用示例
let appState: State = {
  user: null,
  posts: [],
  ui: { theme: 'light', sidebar: false }
};

// 更新嵌套状态
appState = updateState(appState, 'user', { id: 1, name: 'Alice' });
appState = updateState(appState, 'ui.theme', 'dark');
```

### 14.10.2 表单处理

```typescript
interface FormData {
  username: string;
  email: string;
  age: number;
  preferences: {
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
}

// 处理表单提交
function handleSubmit(event: Event) {
  event.preventDefault();
  
  // 类型断言获取表单元素
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  // 创建类型化数据对象
  const data: FormData = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    age: parseInt(formData.get('age') as string),
    preferences: {
      newsletter: formData.get('newsletter') === 'on',
      theme: formData.get('theme') as 'light' | 'dark'
    }
  };
  
  // 更安全的方式包括验证
  if (!data.username || !data.email || isNaN(data.age)) {
    alert('Please fill all required fields correctly');
    return;
  }
  
  // 处理表单数据
  submitToApi(data);
}

// 添加表单监听器
document.querySelector('form')?.addEventListener('submit', handleSubmit);
```

### 14.10.3 插件系统

```typescript
// 插件系统中的类型断言
interface Plugin {
  name: string;
  version: string;
  init(): void;
}

class PluginManager {
  private plugins: Record<string, Plugin> = {};
  
  // 注册插件
  register(pluginData: unknown): void {
    try {
      // 进行类型检查
      if (
        typeof pluginData === 'object' && 
        pluginData !== null &&
        'name' in pluginData &&
        'version' in pluginData &&
        'init' in pluginData &&
        typeof (pluginData as any).init === 'function'
      ) {
        // 通过验证后进行安全断言
        const plugin = pluginData as Plugin;
        this.plugins[plugin.name] = plugin;
        plugin.init();
        console.log(`Plugin ${plugin.name} v${plugin.version} initialized`);
      } else {
        throw new Error('Invalid plugin format');
      }
    } catch (error) {
      console.error('Failed to register plugin:', error);
    }
  }
  
  // 获取插件
  getPlugin(name: string): Plugin | undefined {
    return this.plugins[name];
  }
}

// 使用示例
const manager = new PluginManager();

// 注册有效插件
manager.register({
  name: 'logger',
  version: '1.0.0',
  init() {
    console.log('Logger plugin initialized');
  }
});

// 获取插件并使用
const logger = manager.getPlugin('logger');
if (logger) {
  // 使用插件
}
```

通过理解并掌握类型断言和类型转换的各种技术，你可以在保持类型安全的同时，使 TypeScript 代码更加灵活和实用。记住，类型断言应该谨慎使用，并尽可能通过类型守卫和运行时检查来确保类型安全。

# 15 泛型

泛型是 TypeScript 中最强大的特性之一，它允许我们创建可重用的组件，使其能够适用于多种类型而非单一类型。通过泛型，我们可以编写灵活、可扩展且类型安全的代码。

## 15.1 泛型基础概念

泛型就像是类型的"函数"，它可以接受一个或多个类型参数，然后返回一个使用这些参数的类型。

### 15.1.1 为什么需要泛型？

考虑以下函数，它返回传入的参数：

```typescript
// 不使用泛型的情况
function identity(arg: any): any {
  return arg;
}

const value = identity("hello"); // 值的类型是 any，丢失了类型信息
```

使用 `any` 类型会导致我们丢失传入参数的类型信息。泛型可以解决这个问题：

```typescript
// 使用泛型
function identity<T>(arg: T): T {
  return arg;
}

const value = identity("hello"); // TypeScript 推断 value 的类型为 string
const num = identity(42);        // TypeScript 推断 num 的类型为 number
```

### 15.1.2 泛型类型参数

泛型使用尖括号 `<>` 语法来定义类型参数，通常使用单个大写字母（如 `T`, `U`, `V` 等）命名：

```typescript
// 单个类型参数
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 多个类型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair("hello", 42); // 类型为 [string, number]
```

### 15.1.3 泛型类型推断

TypeScript 通常能够从传入的参数自动推断出泛型的类型：

```typescript
// 类型推断示例
const numbers = [1, 2, 3];
const firstNumber = first(numbers); // TypeScript 自动推断 T 为 number

// 也可以显式指定类型
const firstString = first<string>(["a", "b", "c"]);
```

## 15.2 泛型函数

泛型函数使我们能够创建适用于多种类型的可重用函数。

### 15.2.1 基本泛型函数

```typescript
// 基本泛型函数
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

const result = swap(["hello", 42]); // 类型为 [number, string]
```

### 15.2.2 泛型箭头函数

```typescript
// 泛型箭头函数
const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};

const person = { name: "Alice", age: 30 };
const name = getProperty(person, "name"); // 类型为 string
const age = getProperty(person, "age");   // 类型为 number
```

### 15.2.3 函数重载与泛型

泛型可以结合函数重载使用，创建更加灵活的 API：

```typescript
// 泛型函数重载
function convert<T extends number>(value: T): string;
function convert<T extends string>(value: T): number;
function convert<T extends string | number>(value: T): string | number {
  if (typeof value === "string") {
    return parseFloat(value);
  } else {
    return String(value);
  }
}

const str = convert(42);    // 类型为 string
const num = convert("3.14"); // 类型为 number
```

## 15.3 泛型接口

泛型可以用于接口定义，创建灵活且可重用的接口类型。

### 15.3.1 基本泛型接口

```typescript
// 基本泛型接口
interface Box<T> {
  value: T;
  getValue(): T;
}

const stringBox: Box<string> = {
  value: "hello",
  getValue() { return this.value; }
};

const numberBox: Box<number> = {
  value: 42,
  getValue() { return this.value; }
};
```

### 15.3.2 泛型接口作为函数类型

```typescript
// 泛型函数接口
interface Parser<T> {
  (input: string): T;
}

const numberParser: Parser<number> = (input) => parseFloat(input);
const booleanParser: Parser<boolean> = (input) => input === "true";

const num = numberParser("42");     // 类型为 number
const bool = booleanParser("true"); // 类型为 boolean
```

### 15.3.3 泛型索引类型接口

```typescript
// 泛型索引类型接口
interface Dictionary<T> {
  [key: string]: T;
}

const stringDict: Dictionary<string> = {
  name: "Alice",
  country: "Wonderland"
};

const numberDict: Dictionary<number> = {
  age: 30,
  score: 95
};
```

## 15.4 泛型类

泛型也可以用于类的定义，使类能够处理多种类型的数据。

### 15.4.1 基本泛型类

```typescript
// 基本泛型类
class Container<T> {
  private item: T;

  constructor(item: T) {
    this.item = item;
  }

  getItem(): T {
    return this.item;
  }

  setItem(item: T): void {
    this.item = item;
  }
}

const numberContainer = new Container<number>(123);
const stringContainer = new Container("hello");  // 类型推断为 Container<string>

numberContainer.setItem(456);
// numberContainer.setItem("wrong"); // 错误：类型不兼容
```

### 15.4.2 使用多个泛型参数

```typescript
// 多泛型参数的类
class KeyValuePair<K, V> {
  constructor(public key: K, public value: V) {}

  toString(): string {
    return `[${this.key}]: ${this.value}`;
  }
}

const pair1 = new KeyValuePair("name", "Alice");
const pair2 = new KeyValuePair(1, { x: 10, y: 20 });

console.log(pair1.toString()); // "[name]: Alice"
console.log(pair1.key);        // 类型为 string
console.log(pair2.value);      // 类型为 { x: number; y: number; }
```

### 15.4.3 在静态成员中使用泛型

需要注意的是，类的静态成员不能使用类的泛型参数：

```typescript
class StaticGeneric<T> {
  // 静态属性不能使用类型参数 T
  // static defaultValue: T; // 错误

  // 静态方法可以有自己的泛型参数
  static createInstance<U>(value: U): StaticGeneric<U> {
    return new StaticGeneric<U>(value);
  }

  constructor(public value: T) {}
}

const instance = StaticGeneric.createInstance("hello");
console.log(instance.value); // "hello"
```

## 15.5 泛型约束

有时我们需要限制泛型类型必须具有某些属性或行为，这时可以使用泛型约束。

### 15.5.1 使用 extends 关键字

```typescript
// 基本泛型约束
interface HasLength {
  length: number;
}

// T 必须有 length 属性
function printLength<T extends HasLength>(arg: T): number {
  console.log(`Length: ${arg.length}`);
  return arg.length;
}

printLength("hello");      // 字符串有 length 属性
printLength([1, 2, 3]);    // 数组有 length 属性
printLength({ length: 5 }); // 对象有 length 属性
// printLength(123);       // 错误：number 没有 length 属性
```

### 15.5.2 多类型约束

```typescript
// 多类型约束
interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

// T 必须同时实现 Printable 和 Loggable 接口
function process<T extends Printable & Loggable>(item: T): void {
  item.print();
  item.log();
}

class Document implements Printable, Loggable {
  print() {
    console.log("Printing document...");
  }
  
  log() {
    console.log("Logging document...");
  }
}

process(new Document()); // 正常工作
// process({ print: () => {} }); // 错误：缺少 log 方法
```

### 15.5.3 使用 keyof 进行约束

`keyof` 操作符可以用于获取类型的所有属性名，结合泛型约束使用非常强大：

```typescript
// 使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: "Alice",
  age: 30,
  location: "Wonderland"
};

const name = getProperty(person, "name"); // 类型为 string
const age = getProperty(person, "age");   // 类型为 number
// const invalid = getProperty(person, "job"); // 错误：person 没有 job 属性
```

## 15.6 泛型参数默认值

TypeScript 2.3+ 支持为泛型参数提供默认类型：

```typescript
// 泛型参数默认值
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

// 不指定类型参数时，默认为 any
const response1: ApiResponse = {
  data: "hello",
  status: 200,
  message: "Success"
};

// 显式指定类型参数
const response2: ApiResponse<number[]> = {
  data: [1, 2, 3],
  status: 200,
  message: "Success"
};

// 多个泛型参数的默认值
interface Store<K extends string | number = string, V = any> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

// 使用默认类型参数
const stringStore: Store = {
  get(key) { return undefined; },
  set(key, value) {}
};

// 自定义类型参数
const numberStore: Store<number, string> = {
  get(key) { return undefined; },
  set(key, value) {}
};
```

## 15.7 泛型工具类型

TypeScript 内置了一些有用的泛型工具类型，用于常见的类型转换操作。

### 15.7.1 内置工具类型

```typescript
// Partial - 将所有属性变为可选
interface User {
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;
// 等同于：{ name?: string; age?: number; email?: string; }

// Required - 将所有属性变为必需
interface PartialAddress {
  street?: string;
  city?: string;
  country?: string;
}

type FullAddress = Required<PartialAddress>;
// 等同于：{ street: string; city: string; country: string; }

// Readonly - 将所有属性变为只读
type ReadonlyUser = Readonly<User>;
// 等同于：{ readonly name: string; readonly age: number; readonly email: string; }

// Record - 创建键值对类型
type UserRoles = Record<string, string[]>;
// 等同于：{ [key: string]: string[] }

// Pick - 从类型中选择特定属性
type UserBasicInfo = Pick<User, 'name' | 'email'>;
// 等同于：{ name: string; email: string; }

// Omit - 从类型中删除特定属性
type UserWithoutEmail = Omit<User, 'email'>;
// 等同于：{ name: string; age: number; }

// Exclude - 排除联合类型中的特定成员
type Numbers = 1 | 2 | 3 | 4 | 5;
type EvenNumbers = Exclude<Numbers, 1 | 3 | 5>;
// 等同于：2 | 4

// Extract - 提取联合类型中的特定成员
type ExtractedNumbers = Extract<Numbers, 1 | 2 | 6>;
// 等同于：1 | 2

// NonNullable - 排除 null 和 undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// 等同于：string
```

### 15.7.2 条件类型

条件类型使用 `extends` 关键字进行类型判断，类似于三元运算符：

```typescript
// 条件类型基础
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<123>;     // false

// 条件类型与联合类型分配
type ToArray<T> = T extends any ? T[] : never;

type NumberOrStringArray = ToArray<number | string>;
// 等同于：number[] | string[]

// infer 关键字用于提取类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function greeting(name: string): string {
  return `Hello, ${name}!`;
}

type GreetingReturn = ReturnType<typeof greeting>; // string
```

### 15.7.3 映射类型

映射类型允许你从现有类型创建新类型，通过转换每个属性：

```typescript
// 基本映射类型
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
};

type ReadonlyPoint = {
  readonly x: number;
  readonly y: number;
};

type MutablePoint = Mutable<ReadonlyPoint>;
// 等同于：{ x: number; y: number; }

// 修改属性标志
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type UserWithNulls = Nullable<User>;
// 等同于：{ name: string | null; age: number | null; email: string | null; }

// 使用 as 重映射键
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P]
};

type UserGetters = Getters<User>;
/* 等同于：{
  getName: () => string;
  getAge: () => number;
  getEmail: () => string;
} */
```

## 15.8 实际应用场景

### 15.8.1 类型安全的状态管理

```typescript
// 创建一个简单的状态管理器
class State<T> {
  private state: T;
  private listeners: ((state: T) => void)[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return { ...this.state } as T;
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.push(listener);
    
    // 返回取消订阅的函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }
}

// 使用示例
interface AppState {
  user: { name: string } | null;
  theme: 'light' | 'dark';
  notifications: string[];
}

const initialState: AppState = {
  user: null,
  theme: 'light',
  notifications: []
};

const appState = new State<AppState>(initialState);

// 添加监听器
const unsubscribe = appState.subscribe(state => {
  console.log('State updated:', state);
});

// 更新状态
appState.setState({ user: { name: 'Alice' } });
appState.setState({ theme: 'dark' });

// 取消订阅
unsubscribe();
```

### 15.8.2 类型安全的 API 客户端

```typescript
// 类型安全的 API 客户端
interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T, U>(url: string, data: T): Promise<U>;
  put<T, U>(url: string, data: T): Promise<U>;
  delete<T>(url: string): Promise<T>;
}

// 实现
class HttpClient implements ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(this.baseUrl + url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  }

  async post<T, U>(url: string, data: T): Promise<U> {
    const response = await fetch(this.baseUrl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json() as Promise<U>;
  }

  async put<T, U>(url: string, data: T): Promise<U> {
    const response = await fetch(this.baseUrl + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json() as Promise<U>;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(this.baseUrl + url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  }
}

// 使用示例
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

const api = new HttpClient('https://api.example.com');

// 类型安全的 API 调用
async function fetchUsers(): Promise<User[]> {
  return api.get<User[]>('/users');
}

async function createUser(user: CreateUserRequest): Promise<User> {
  return api.post<CreateUserRequest, User>('/users', user);
}

async function updateUser(id: number, user: Partial<User>): Promise<User> {
  return api.put<Partial<User>, User>(`/users/${id}`, user);
}
```

### 15.8.3 泛型组件库

```typescript
// 泛型 React 组件示例（使用 JSX）
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>(props: ListProps<T>): JSX.Element {
  const { items, renderItem, keyExtractor } = props;
  
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// 使用示例
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "iPhone", price: 999 },
  { id: 2, name: "iPad", price: 799 },
  { id: 3, name: "MacBook", price: 1299 }
];

// 使用组件
const ProductList = () => (
  <List<Product>
    items={products}
    renderItem={(product) => (
      <div>
        <strong>{product.name}</strong>: ${product.price}
      </div>
    )}
    keyExtractor={(product) => product.id}
  />
);
```

## 15.9 最佳实践

1. **保持类型参数简单**：通常使用单个大写字母（T, U, K 等）表示泛型类型参数，或者使用有意义的命名（TEntity, TKey 等）。

2. **尽量减少类型参数的数量**：如果可能，保持参数数量最小化，通常不超过 3 个。

3. **提供默认类型参数**：对可能的类型参数提供默认值，提高 API 的易用性。

4. **使用约束限制类型参数**：使用 `extends` 关键字约束类型参数，避免在实现中出现类型错误。

5. **优先使用接口来定义泛型约束**：接口比联合类型或交集更清晰，更易于扩展。

6. **考虑泛型工具类型**：熟悉并利用 TypeScript 内置的工具类型，避免重复实现。

7. **避免过度使用泛型**：只在需要类型重用或类型安全时使用泛型，不要仅为了"看起来高级"而使用。

泛型是 TypeScript 最强大的特性之一，掌握它可以帮助你编写更加灵活、可重用和类型安全的代码。通过实践和探索不同的应用场景，你将能够更加高效地利用泛型的优势。

# 16 TypeScript 中的装饰器(Decorators)
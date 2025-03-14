# TypeScript
<img src="/MarkdownImages/【2024最新版】TypeScript(TS)快速入门到精通（全224集）.png" style="display: block; margin: 0 auto; width: 50%; height: auto;" />

# 1 环境搭建和基本语法
## 1.1 环境搭建
```bash
npm init -y
npm install typescript -D
npx tsc --init
```

## 1.2 基本语法
### 1.2.1 编译时静态类型检测
```typescript
// 创建一个变量，并指定类型
let str: string = "Hello, TypeScript!";
str = 3; // 此处会报错，因为 str 是 string 类型，而 3 是 number 类型
str = "Hello, JavaScript!"; // 正确
```

```typescript
// 创建一个数组，并指定类型
let arr: number[] = [1, 2, 3];
arr.push(4); // 正确

// 创建一个对象，并指定类型
let obj: { name: string; age: number } = { name: "Alice", age: 30 };
obj.name = "Bob"; // 正确
obj.age = "30"; // 此处会报错，因为 age 是 number 类型
```

### 1.2.2 类型注解
```typescript
let data: number // 这种写法就是类型注解
```

### 1.2.3 定义类型
```typescript
// 定义一个类型
type Person = {
  name: string;
  age: number;
};

// 使用定义的类型
const person: Person = {
  name: "Alice",
  age: 30,
};
```

# 2 TS编译和编译优化
## 2.1 TS编译
```typescript
let str: string = "abc"
console.log("str: ", str) // 在控制台中输入：npx tsc 文件名.ts 会编译成 文件名.js 放在当前目录下

export {}
/**
 * 为什么要在TypeScript文件末尾添加 export {} ?
 * 在TypeScript文件末尾添加 export {} 是一种常见做法，主要有以下原因：
 * 1. 避免全局作用域污染：使用 export {} 可以确保这个文件的内容不会与其他文件中的变量或类型冲突。
 *    -添加任何导出语句会将文件视为模块(module)而非脚本(script)
 *    -模块有自己的独立作用域，变量不会污染全局命名空间
 * 2. 避免命名冲突：没有export的情况下，同名变量在不同文件中会被视为同一个全局变量。
 *    -这会导致"Cannot redeclare block-scoped variable"错误
 * 3. 空导出技巧: export {}是一个空导出，不会实际导出任何内容, 仅用于将文件标记为模块
 * 4. 适用场景
 *    -特别适合单文件测试或示例代码
 *    -对于实际项目中需要被其他文件导入的模块，应该导出有意义的内容
 * 
 * 如果不添加export {}，TypeScript会将该文件视为全局脚本，变量可能与其他文件中的同名变量冲突。
 */
```

- **配置文件 tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES5",           // 设置编译后的JavaScript代码版本
    "module": "CommonJS",      // 选择模块系统
    "outDir": "./dist",        // 输出目录(指定编译后文件的输出目录)
    "rootDir": "./src",        // 根目录(指定输入文件的根目录)
    "strict": true,            // 启用严格模式
    "esModuleInterop": true    // 允许默认导入非ES模块
  }
}
```
  1. **rootDir**: "./src"
     * 作用：指定输入文件的根目录
     *  说明：TypeScript将从src目录查找源文件，并保持相同的目录结构输出到outDir
  2. **outDir**: "./dist"
     * 作用：指定输出文件的目录
     * 说明：TypeScript将编译后的文件输出到dist目录
     * ![002TS编译和编译优化](./MarkdownImages/002TS编译和编译优化.jpg)


# 3 TS 常用类型
## 基本类型
  1. string
  2. number
  3. boolean
  4. null
  5. undefined
  6. symbol
  7. bigint
## 根类型（顶级类型 Top Types）
  1. Object
  2. {} (Object === {})
  ```typescript
  let obj: Object = {}; // 使用 Object 作为类型
  let obj2: {} = {}; // 使用 {} 作为类型
  // obj 和 obj2 都可以赋值为任意对象，除了 null 和 undefined
  
  // 顶级类型可以接受大多数类型的值
  obj = 42;          // 有效：数字可以赋给 Object 类型
  obj = "hello";     // 有效：字符串可以赋给 Object 类型
  obj = true;        // 有效：布尔值可以赋给 Object 类型
  obj = [1, 2, 3];   // 有效：数组可以赋给 Object 类型
  // obj = null;     // 错误：null 不可以赋给 Object 类型
  // obj = undefined; // 错误：undefined 不可以赋给 Object 类型
  ```
  > 注意：虽然 `any` 和 `unknown` 有时也被视为顶级类型，但它们有特殊的行为，通常单独分类为特殊类型。

## 对象类型
  1. Array
  2. object (object 不是上面的 Object 根类型哦, object 只能接收对象类型)
  3. function
## 枚举类型 (enum)  
>枚举允许开发者定义一组命名常量，使代码更具可读性和可维护性。
  
  ```typescript
  // 数字枚举 - 默认从0开始自动递增
  enum Direction {
      Up,    // 0
      Down,  // 1
      Left,  // 2
      Right  // 3
  }
  
  // 可以显式指定值
  enum HttpStatus {
      OK = 200,
      NotFound = 404,
      ServerError = 500
  }
  
  // 字符串枚举
  enum Color {
      Red = "RED",
      Green = "GREEN",
      Blue = "BLUE"
  }
  
  const move: Direction = Direction.Up;
  console.log(move); // 输出 0
  console.log(HttpStatus.NotFound); // 输出 404
  console.log(HttpStatus["OK"]); // 输出 200
  console.log(Color.Red); // 输出 RED

  // 反向映射
  console.log(Direction[0]); // 输出 Up
  console.log(HttpStatus[404]); // 输出 NotFound
  ```

## 特殊类型
  | 类型 | 描述 |
  |------|------|
  | `any` | 可以赋予任意类型的值，会绕过类型检查 |
  | `void` | 表示函数没有返回值，或返回 undefined |
  | `never` | 表示永远不会有返回值的函数类型，如抛出异常或无限循环 |
  | `unknown` | 比 any 更安全的类型，需要类型检查后才能使用 |
  | `元组(tuple)` | 固定长度、固定类型的数组 |
  | `可变元组` | 支持可选元素和剩余元素的元组 |

  ```typescript
  // any 类型
  let flexible: any = "hello";
  flexible = 100; // 有效，无类型检查
  
  // void 类型
  function logMessage(): void {
      console.log("This is a log");
      // 无需返回值
  }
  
  // never 类型
  function throwError(): never {
      throw new Error("An error occurred");
  }
  
  // unknown 类型
  let value: unknown = 30;
  // value.toFixed(2); // 错误：不能直接使用 unknown 类型的方法
  if (typeof value === "number") {
      value.toFixed(2); // 正确：已经进行了类型检查
  }
  
  // 元组类型
  let person: [string, number] = ["Alice", 30];
  
  // 可变元组
  let mixedTuple: [string, number, ...boolean[]] = ["hello", 42, true, false, true];
  ```

## 合成类型(unions 和 intersections)
  1. **联合类型(union)** - 表示一个值可以是多种类型之一
  2. **交叉类型(intersection)** - 将多个类型合并为一个类型

  ```typescript
  // 联合类型示例
  let value: string | number;
  value = "abc"; // 正确
  value = 123;   // 正确
  // value = true;  // 错误，因为 true 不是 string 或 number 类型
  
  // 联合类型与类型守卫
  function formatValue(value: string | number): string {
      if (typeof value === "string") {
          return value.toUpperCase();
      }
      return value.toFixed(2);
  }
  
  // 交叉类型示例
  type Person = { name: string; age: number };
  type Employee = { company: string; id: number };
  
  // 注：interface 定义类型不能使用交叉类型&，需要用 extends 实现
  type EmployedPerson = Person & Employee;
  
  const worker: EmployedPerson = {
      name: "Alice",
      age: 30,
      company: "TechCorp",
      id: 12345
  };
  ```

## 字面量数据类型
字面量类型是TypeScript的一个强大特性，允许你将变量的值限制为特定的常量值，而不仅仅是一种数据类型。

### 字符串字面量类型
```typescript
// 字符串字面量类型 - 只允许特定的字符串值
type Direction = "North" | "South" | "East" | "West";

let userDirection: Direction;
userDirection = "North"; // 正确
userDirection = "South"; // 正确
// userDirection = "northeast"; // 错误：不是允许的值

// 实际应用示例
function navigate(direction: Direction): void {
    console.log(`Moving ${direction}`);
}

navigate("East"); // 有效
// navigate("Up"); // 错误：'Up' 不是有效的方向
```

### 数字字面量类型
```typescript
// 数字字面量类型 - 只允许特定的数字值
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

let roll: DiceValue;
roll = 6; // 正确
// roll = 7; // 错误：7不是允许的骰子值

// 实际应用示例
function rollDice(): DiceValue {
    return Math.floor(Math.random() * 6) + 1 as DiceValue;
}
```

### 布尔字面量类型
```typescript
// 布尔字面量类型
type TRUE = true;
let t: TRUE = true; // 正确
// let f: TRUE = false; // 错误：只能是true
```

### 对象字面量类型与字面量推断
```typescript
// 对象字面量类型
type User = {
    readonly id: number;
    name: string;
    role: "admin" | "user" | "guest";
};

const admin: User = {
    id: 1,
    name: "Admin",
    role: "admin" // 必须是"admin"、"user"或"guest"之一
};

// admin.id = 2; // 错误：id是只读属性

// 字面量推断
// TypeScript默认推断变量可能会改变
const obj = { counter: 0 }; // 推断为 { counter: number }
obj.counter = 1; // 正确

// 使用as const使对象所有属性成为字面量类型
const config = {
    endpoint: "api/data",
    method: "GET",
    timeout: 10000
} as const;

// config.method = "POST"; // 错误：无法修改只读属性
```

### 模板字面量类型
```typescript
// TypeScript 4.1+支持的模板字面量类型
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

// 使用模板字面量组合字面量类型
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// 结果类型: "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

// 实际应用示例
type Size = "small" | "medium" | "large";
type Color = "red" | "green" | "blue";
type Style = `${Size}-${Color}`;

let buttonStyle: Style = "small-red"; // 正确
// let invalidStyle: Style = "tiny-yellow"; // 错误：不匹配任何有效组合
```

字面量类型特别适合用于API设计，它们可以使代码更加类型安全，同时提供更好的IDE自动完成支持。当与联合类型和交叉类型结合使用时，它们可以创建非常精确的类型定义。


# 4 any 和 unknown 的区别与应用场景

## 4.1 基本概念

TypeScript 中的 `any` 和 `unknown` 都是顶级类型，但它们在类型安全性方面有重大差异。

### any 类型
`any` 类型表示"任意类型"，它允许你在编译时绕过类型检查，可以对其执行任何操作。

### unknown 类型
`unknown` 类型是 TypeScript 3.0 引入的，它也可以表示任何值，但比 `any` 更安全，因为你必须先进行类型检查或类型断言才能对其进行操作。

## 4.2 关键区别

| 特性 | any | unknown |
|------|-----|---------|
| 类型安全性 | 低（完全绕过类型检查） | 高（需要类型检查才能操作） |
| 可赋值性 | 可以赋值给任何类型 | 只能赋值给 any 或 unknown 类型 |
| 操作限制 | 无限制，可执行任何操作 | 有限制，需要类型检查或断言 |
| 属性访问 | 可以随意访问任何属性 | 必须先确认类型才能访问属性 |
| 方法调用 | 可以调用任何方法 | 必须先确认类型才能调用方法 |

## 4.3 代码示例

### any 类型示例

```typescript
// any 类型示例
let valueAny: any = 10;

// 不进行任何类型检查就可以执行任何操作
valueAny.foo();           // 不会在编译时报错
valueAny.bar = 100;       // 不会在编译时报错 
valueAny = "hello";       // 可以更改类型
valueAny = true;          // 可以更改类型

// any 类型可以赋值给任何其他类型（污染类型系统）
let str: string = valueAny;  // 不会报错！
```

### unknown 类型示例

```typescript
// unknown 类型示例
let valueUnknown: unknown = 10;

// 以下操作在编译时会报错
// valueUnknown.foo();           // 错误：对象类型为 'unknown'
// valueUnknown.bar = 100;       // 错误：对象类型为 'unknown'
// valueUnknown = "hello";       // 正确：可以赋予任何值
// valueUnknown = true;          // 正确：可以赋予任何值

// unknown 类型不能直接赋值给其他类型
// let str: string = valueUnknown;  // 错误！

// 必须先进行类型检查
if (typeof valueUnknown === "string") {
    let str: string = valueUnknown;  // 现在可以了，因为已确认类型
    console.log(str.toUpperCase());  // 安全地使用字符串方法
}

// 或者使用类型断言
let str: string = valueUnknown as string;  // 显式类型断言
```

## 4.4 使用场景对比

### 何时使用 any

1. **迁移旧 JavaScript 代码**时的过渡方案
2. 处理**真正不确定的动态内容**
3. 使用**没有类型定义的第三方库**
4. **快速原型开发**，后续再添加类型

```typescript
// 没有类型定义的库
declare const thirdPartyLib: any;
thirdPartyLib.doSomething();

// 复杂JSON解析
const config: any = JSON.parse(rawConfig);
```

### 何时使用 unknown

1. **API 返回值类型不确定**但需要安全处理
2. **函数参数接受任意值**但需要类型检查
3. **类型断言前的中间类型**
4. **替代 any 来增强类型安全**

```typescript
// API 返回类型不确定
async function fetchData(): Promise<unknown> {
    const response = await fetch('https://api.example.com/data');
    return response.json();
}

// 安全地处理返回值
const data = await fetchData();
if (typeof data === 'object' && data && 'name' in data) {
    console.log((data as { name: string }).name);
}

// 通用错误处理
function handleError(error: unknown) {
    if (error instanceof Error) {
        console.log(error.message);  // 安全：已确认是 Error 类型
    } else {
        console.log('Unknown error:', error);
    }
}
```

## 4.5 类型守卫与 unknown 类型

使用类型守卫可以安全地处理 unknown 类型：

```typescript
function processValue(value: unknown): string {
    // 类型守卫
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return value.toFixed(2);
    } else if (value instanceof Date) {
        return value.toISOString();
    }
    
    return String(value);
}

// 自定义类型守卫
interface User {
    id: number;
    name: string;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" && 
        value !== null && 
        "id" in value && 
        "name" in value
    );
}

function processUser(value: unknown) {
    if (isUser(value)) {
        console.log(value.name);  // 安全：已确认是 User 类型
    }
}
```

## 4.6 最佳实践

1. **优先使用明确的类型**（string、number 等）
2. **优先使用 unknown 而非 any**，只在必要时使用 any
3. 使用 unknown 时**始终搭配类型守卫**
4. 为**提高代码质量逐步替换项目中的 any**
5. 配置 **tsconfig.json 中的 noImplicitAny 为 true**，禁止隐式 any
6. 对外暴露的 API 使用 unknown 取代 any，增加类型安全

```typescript
// 不好的实践
function processInput(input: any) {
    return input.toLowerCase(); // 不安全：假定输入是字符串
}

// 好的实践
function processInput(input: unknown) {
    if (typeof input === "string") {
        return input.toLowerCase(); // 安全：已确认是字符串
    }
    throw new Error("Input must be a string");
}
```

# 5 接口（Interface）详解

## 5.1 接口基础概念

接口是 TypeScript 中一个核心概念，用于定义对象的结构和类型。接口定义了对象应该具有的属性和方法，但不提供实现。

```typescript
// 基础接口定义
interface Person {
  name: string;
  age: number;
}

// 使用接口
const alice: Person = {
  name: "Alice",
  age: 30
};

// 以下代码会报错，因为缺少必须的属性
// const bob: Person = {
//   name: "Bob"
// };

// 以下代码会报错，因为包含未在接口中声明的属性
// const charlie: Person = {
//   name: "Charlie",
//   age: 25,
//   address: "123 Main St" // 多余的属性
// };
```

## 5.2 可选属性和只读属性

### 5.2.1 可选属性

使用问号（?）标记属性为可选的。

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
  phone?: string; // 可选属性
}

// 有效，email是可选的
const user1: User = {
  id: 1,
  name: "User One"
};

// 有效，提供了可选属性
const user2: User = {
  id: 2,
  name: "User Two",
  email: "user2@example.com"
};
```

### 5.2.2 只读属性

使用 readonly 关键字使属性只能在创建时被赋值。

```typescript
interface Config {
  readonly apiKey: string;
  readonly apiUrl: string;
  timeout?: number;
}

const config: Config = {
  apiKey: "abc123",
  apiUrl: "https://api.example.com"
};

// 以下代码会报错，因为apiKey是只读的
// config.apiKey = "xyz456";

// 可以修改非只读的可选属性
config.timeout = 3000;
```

## 5.3 接口的属性检查绕过

TypeScript 对接口有"严格属性检查"，但有几种方法可以绕过这种检查：

```typescript
interface SubmitFormData {
  name: string;
  email: string;
}

// 方式1: 使用类型断言
const data1 = {
  name: "Alice",
  email: "alice@example.com",
  extraField: true
} as SubmitFormData; // 类型断言绕过多余属性检查

// 方式2: 使用中间变量
const rawData = {
  name: "Bob",
  email: "bob@example.com",
  extraField: 123
};
const data2: SubmitFormData = rawData; // 变量赋值绕过检查

// 方式3: 使用索引签名（推荐方式）
interface FlexibleFormData {
  name: string;
  email: string;
  [key: string]: any; // 索引签名允许任意额外属性
}

const data3: FlexibleFormData = {
  name: "Charlie",
  email: "charlie@example.com",
  extraField1: true,
  extraField2: 123
};
```

## 5.4 接口的方法

接口可以包含方法定义：

```typescript
interface Calculator {
  add(x: number, y: number): number;
  subtract(x: number, y: number): number;
  multiply?(x: number, y: number): number; // 可选方法
}

// 实现接口方法
const basicCalculator: Calculator = {
  add(x, y) {
    return x + y;
  },
  subtract(x, y) {
    return x - y;
  }
};

// 完整实现
const advancedCalculator: Calculator = {
  add(x, y) {
    return x + y;
  },
  subtract(x, y) {
    return x - y;
  },
  multiply(x, y) {
    return x * y;
  }
};
```

## 5.5 函数类型接口

接口可以描述函数类型：

```typescript
// 函数接口定义
interface SearchFunction {
  (source: string, subString: string): boolean;
}

// 实现函数接口
const searchString: SearchFunction = function(src, sub) {
  return src.includes(sub);
};

console.log(searchString("Hello world", "world")); // 输出 true
```

## 5.6 索引类型接口

接口可以描述"可索引"的类型，如数组或对象：

```typescript
// 数组索引接口
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["Bob", "Alice", "Eve"];
const firstItem: string = myArray[0]; // "Bob"

// 对象索引接口
interface Dictionary {
  [key: string]: string | number;
}

const dict: Dictionary = {
  name: "John",
  age: 30,
  city: "New York"
};
```

## 5.7 接口继承

接口可以通过 extends 关键字继承其他接口的属性和方法：

```typescript
// 基础接口
interface Shape {
  color: string;
}

// 继承单个接口
interface Square extends Shape {
  sideLength: number;
}

const square: Square = {
  color: "blue",
  sideLength: 10
};

// 继承多个接口
interface Circle extends Shape {
  radius: number;
}

interface Colorful {
  borderColor: string;
}

// 多重继承
interface ColorfulCircle extends Circle, Colorful {
  fillOpacity: number;
}

const circle: ColorfulCircle = {
  color: "red",
  radius: 15,
  borderColor: "black",
  fillOpacity: 0.5
};
```

## 5.8 类实现接口

接口可以被类实现，确保类包含特定的属性和方法：

```typescript
interface Vehicle {
  brand: string;
  speed: number;
  accelerate(speed: number): void;
  brake(): void;
}

class Car implements Vehicle {
  // 实现接口的属性
  brand: string;
  speed: number = 0;
  
  constructor(brand: string) {
    this.brand = brand;
  }
  
  // 实现接口的方法
  accelerate(amount: number): void {
    this.speed += amount;
    console.log(`${this.brand} accelerating to ${this.speed}mph`);
  }
  
  brake(): void {
    this.speed = 0;
    console.log(`${this.brand} stopped`);
  }
  
  // 类可以有额外的方法
  honk(): void {
    console.log("Beep beep!");
  }
}

const myCar = new Car("Toyota");
myCar.accelerate(30);  // Toyota accelerating to 30mph
myCar.brake();         // Toyota stopped
myCar.honk();          // Beep beep!

// 一个类可以实现多个接口
interface Lockable {
  lock(): void;
  unlock(): void;
  isLocked: boolean;
}

class SecureCar extends Car implements Lockable {
  isLocked: boolean = false;
  
  lock(): void {
    this.isLocked = true;
    console.log(`${this.brand} is now locked`);
  }
  
  unlock(): void {
    this.isLocked = false;
    console.log(`${this.brand} is unlocked`);
  }
}
```

## 5.9 接口合并

TypeScript 允许声明同名接口，它们会自动合并：

```typescript
// 第一个接口声明
interface API {
  getUsers(): Promise<string[]>;
}

// 第二个接口声明（会与第一个合并）
interface API {
  getPosts(): Promise<string[]>;
}

// 使用合并后的接口
const api: API = {
  getUsers: async () => ["user1", "user2"],
  getPosts: async () => ["post1", "post2"]
};

// 合并接口时的注意事项
interface Box {
  height: number;
  width: number;
  // color: string;  // 假设后面会定义
}

interface Box {
  scale: number;
  color: string;  // 提供之前声明的类型
}

// 最终的Box接口包含所有属性
const box: Box = {
  height: 10,
  width: 20,
  scale: 2,
  color: "red"
};
```

## 5.10 接口与类型别名(type)的区别

TypeScript 中，接口（interface）和类型别名（type）有很多相似之处，但也有一些关键区别：

```typescript
// 接口定义
interface Person {
  name: string;
  age: number;
}

// 等效的类型别名
type PersonType = {
  name: string;
  age: number;
};

// 相似点：两者都可以扩展
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 类型别名的扩展
type AnimalType = {
  name: string;
};

type DogType = AnimalType & {
  breed: string;
};

// 区别1: 接口可以被合并，类型别名不行
interface API {
  get(): void;
}
interface API {
  post(): void;
}
// API 现在有 get 和 post 方法

// 区别2: 类型别名可以用于其他类型，而不仅仅是对象
type ID = string | number;
type Callback = (data: string) => void;
type Pair<T> = [T, T];
type TreeNode<T> = {
  value: T;
  left?: TreeNode<T>;
  right?: TreeNode<T>;
};

// 区别3: 类实现时的差异
interface Clickable {
  click(): void;
}

class Button implements Clickable {
  click() {
    console.log("Button clicked");
  }
}

// 接口的优势：在大型项目中更容易进行声明合并
// 类型别名的优势：可以表达更复杂的类型组合
```

## 5.11 接口的实际应用场景

### 5.11.1 API 类型定义

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string; // API返回的是字符串格式的日期
}

// 在API函数中使用这些接口
async function fetchUsers(): Promise<UserResponse[]> {
  const response = await fetch('/api/users');
  return response.json();
}

async function createUser(user: CreateUserRequest): Promise<UserResponse> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return response.json();
}
```

### 5.11.2 组件 Props 定义

```typescript
// React组件的Props接口
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

// 在组件中使用
function Button(props: ButtonProps) {
  const { text, onClick, disabled = false, variant = 'primary', size = 'medium' } = props;
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {text}
    </button>
  );
}
```

### 5.11.3 配置对象

```typescript
interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
  connectionTimeoutMs?: number;
}

interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  server: {
    port: number;
    host: string;
  };
  database: DatabaseConfig;
}

// 使用配置接口
function initializeApp(config: AppConfig) {
  // 使用配置初始化应用
  const { environment, logLevel, server, database } = config;
  
  console.log(`Starting app in ${environment} mode`);
  console.log(`Server listening on ${server.host}:${server.port}`);
  
  // 连接数据库
  connectToDatabase(database);
}
```

### 5.11.4 策略模式实现

```typescript
interface PaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
  refund(paymentId: string, amount: number): Promise<boolean>;
  getBalance(): Promise<number>;
}

// 实现不同的支付处理器
class StripePaymentProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via Stripe`);
    // 调用Stripe API进行处理
    return true;
  }
  
  async refund(paymentId: string, amount: number): Promise<boolean> {
    console.log(`Refunding ${amount} for payment ${paymentId} via Stripe`);
    return true;
  }
  
  async getBalance(): Promise<number> {
    // 获取Stripe账户余额
    return 1000;
  }
}

class PayPalPaymentProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via PayPal`);
    // 调用PayPal API进行处理
    return true;
  }
  
  async refund(paymentId: string, amount: number): Promise<boolean> {
    console.log(`Refunding ${amount} for payment ${paymentId} via PayPal`);
    return true;
  }
  
  async getBalance(): Promise<number> {
    // 获取PayPal账户余额
    return 2000;
  }
}

// 使用支付处理器接口
class PaymentService {
  private processor: PaymentProcessor;
  
  constructor(processor: PaymentProcessor) {
    this.processor = processor;
  }
  
  async makePayment(amount: number): Promise<boolean> {
    // 验证余额
    const balance = await this.processor.getBalance();
    if (balance < amount) {
      return false;
    }
    
    // 处理付款
    return this.processor.processPayment(amount);
  }
  
  changeProcessor(processor: PaymentProcessor): void {
    this.processor = processor;
  }
}

// 使用示例
const stripeProcessor = new StripePaymentProcessor();
const paypalProcessor = new PayPalPaymentProcessor();

const paymentService = new PaymentService(stripeProcessor);
paymentService.makePayment(500);  // 使用Stripe处理付款

// 切换到PayPal
paymentService.changeProcessor(paypalProcessor);
paymentService.makePayment(300);  // 使用PayPal处理付款
```

### 5.11.5 泛型接口

```typescript
// 泛型接口定义
interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// 具体实体
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// 实现泛型接口
class ProductRepository implements Repository<Product> {
  private products: Product[] = [];
  
  async findAll(): Promise<Product[]> {
    return this.products;
  }
  
  async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }
  
  async create(item: Omit<Product, 'id'>): Promise<Product> {
    const product = {
      ...item,
      id: Date.now().toString()
    };
    this.products.push(product);
    return product;
  }
  
  async update(id: string, item: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...item
    };
    
    return this.products[index];
  }
  
  async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return initialLength > this.products.length;
  }
}

// 使用该仓库
const productRepo = new ProductRepository();
productRepo.create({ name: "Laptop", price: 1299, category: "Electronics" });
```

## 5.12 接口声明合并的高级用法

```typescript
// 为第三方库扩展接口
declare global {
  interface String {
    capitalize(): string;
  }
}

// 实现扩展的接口
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// 现在可以在任何字符串上使用这个方法
const greeting = "hello world";
console.log(greeting.capitalize()); // "Hello world"

// 为模块扩展接口
declare module 'express' {
  interface Request {
    currentUser?: {
      id: string;
      username: string;
      roles: string[];
    };
  }
}

// 这样在Express请求处理中可以安全地访问currentUser
// app.get('/profile', (req, res) => {
//   const user = req.currentUser;
//   // TypeScript 知道 user 可能是 undefined 或有 id, username, roles
// });
```

通过以上详细讲解，你应该对 TypeScript 接口有了全面的了解，包括其基本用法、高级特性以及实际应用场景。接口是 TypeScript 中非常强大的工具，能帮助你定义代码的结构和契约，提高代码的可读性和可维护性。

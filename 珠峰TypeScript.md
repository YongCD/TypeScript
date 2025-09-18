# 1 TS + Rollup 环境搭建/入门指南

本教程将引导你完成以下步骤：

*   初始化项目
*   安装所需的开发依赖
*   配置 TypeScript
*   配置 Rollup 以便打包 TypeScript 代码
*   添加一个开发服务器用于实时预览
*   配置 `package.json` 中的 `scripts` 命令

### **第一步：项目初始化**

首先，创建一个新的项目文件夹并进入该目录，然后初始化一个新的 Node.js 项目。

```bash
mkdir typescript-rollup-starter
cd typescript-rollup-starter
npm init -y
```

这会创建一个默认的 `package.json` 文件。

### **第二步：安装开发依赖**

接下来，安装所有需要的开发依赖项。

```bash
npm i typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D
```

*   `typescript`: TypeScript 编译器。
*   `rollup`: JavaScript 模块打包器。
*   `rollup-plugin-typescript2`: 一个 Rollup 插件，用于将 TypeScript 代码编译为 JavaScript。它还会报告 TypeScript 的语法和类型错误。
*   `@rollup/plugin-node-resolve`: 此插件可帮助 Rollup 在 `node_modules` 文件夹中查找第三方模块。
*   `rollup-plugin-serve`: 一个简单的 Rollup 开发服务器。

### **第三步：配置 TypeScript (`tsconfig.json`)**

在你的项目根目录下创建一个名为 `tsconfig.json` 的文件，这是 TypeScript 编译器的配置文件。

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "esnext",
    "target": "es5",
    "lib": ["es6", "dom", "es2016", "es2017"],
    "sourceMap": true,
    "declaration": true,
    "moduleResolution": "node",
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**关键配置项说明:**

*   `"outDir": "./dist"`: 指定编译后输出的文件夹。
*   `"module": "esnext"`: 使用最新的 ECMAScript 模块标准，以便 Rollup 可以进行 tree-shaking。
*   `"target": "es5"`: 将代码编译为 ES5，以获得更好的浏览器兼容性。
*   `"sourceMap": true`: 生成 sourcemap 文件，方便调试。
*   `"declaration": true`: 为库生成 `.d.ts` 类型声明文件。
*   `"moduleResolution": "node"`: 使用 Node.js 的模块解析策略。
*   `"include": ["src"]`: 指定需要编译的源文件目录。

### **第四步：配置 Rollup (`rollup.config.js`)**

在项目根目录下创建一个名为 `rollup.config.js` 的文件，这是 Rollup 的配置文件。

```javascript
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'MyLibrary', // 在 UMD 模式下，需要一个全局变量名
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript({
      clean: true,
    }),
    serve({
      open: true,
      contentBase: ['dist', '.'], // 服务的根目录
      port: 8080,
    }),
  ],
};
```

**关键配置项说明:**

*   `input: 'src/index.ts'`: 指定 Rollup 打包的入口文件。
*   `output`: 配置输出。这里我们配置了三种格式：CommonJS (`cjs`)、ES Module (`es`) 和 UMD (`umd`)，以适应不同的使用场景。
*   `plugins`:
    *   `resolve()`: 允许 Rollup 查找外部依赖。
    *   `typescript({ clean: true })`: 使用 `rollup-plugin-typescript2` 来处理 TypeScript 文件。`clean: true` 会在每次构建前清理缓存。
    *   `serve()`: 配置开发服务器。`open: true` 会在启动时自动打开浏览器，`contentBase` 指定了服务器的根目录，我们同时服务 `dist` 目录和项目根目录（这样可以访问 `index.html`）。

### **第五步：创建源文件和测试页面**

1.  **创建 TypeScript 源文件:**

    在项目根目录创建一个 `src` 文件夹，并在其中创建一个 `index.ts` 文件。

    ```typescript
    // src/index.ts
    function greet(name: string): string {
      return `Hello, ${name}!`;
    }

    const message = greet('World');
    console.log(message);

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<h1>${message}</h1>`;
    }
    ```

2.  **创建 HTML 测试页面:**

    在项目根目录创建一个 `index.html` 文件。

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TypeScript Rollup Starter</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="dist/bundle.umd.js"></script>
    </body>
    </html>
    ```

### **第六步：配置 `package.json` 脚本**

打开你的 `package.json` 文件，并添加 `scripts` 字段来定义构建和启动命令。

```json
"scripts": {
  "build": "rollup -c",
  "dev": "rollup -c -w"
},
```
*   `build`: 执行一次性的构建。
*   `dev`: 启动 Rollup 的 watch 模式，当文件发生变化时会自动重新构建，并启动开发服务器。

### **第七步：运行项目**

现在你已经完成了所有的配置。

*   **开发模式:**

    运行以下命令来启动开发服务器和文件监视：

    ```bash
    npm run dev
    ```

    这将会：
    1.  编译你的 TypeScript 代码。
    2.  将结果打包到 `dist` 文件夹。
    3.  启动一个本地服务器，并自动在浏览器中打开 `index.html`。
    4.  当你修改 `src` 目录下的任何文件时，它会自动重新构建并刷新浏览器。

*   **生产构建:**

    当你准备好构建用于生产的文件时，运行：

    ```bash
    npm run build
    ```

    这将在 `dist` 文件夹中生成 `bundle.cjs.js`, `bundle.esm.js` 和 `bundle.umd.js` 以及它们的 sourcemap 和类型声明文件。

# 2 ts 所有类型
这是一份关于 TypeScript 中所有类型的详细讲解，从基础类型到高级类型，帮助你全面理解 TypeScript 的类型系统。

### **一、 基础类型 (Basic Types)**

这些是 JavaScript 中最常见的基本数据类型，TypeScript 对它们进行了静态类型定义。

#### **1. `boolean` (布尔值)**
表示逻辑值 `true` 或 `false`。

```typescript
let isDone: boolean = false;
let isVisible: boolean = true;
```

#### **2. `number` (数字)**
和 JavaScript 一样，TypeScript 中所有的数字都是浮点数。支持十进制、十六进制、二进制和八进制字面量。

```typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

#### **3. `string` (字符串)**
表示文本数据，可以使用双引号 (`"`) 或单引号 (`'`)。也支持模板字符串，可以嵌入表达式。

```typescript
let color: string = "blue";
color = 'red';

let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`;
```

#### **4. `array` (数组)**
有两种方式可以定义数组。

第一种，在元素类型后接 `[]`：
```typescript
let list: number[] = [1, 2, 3];
```

第二种，使用数组泛型 `Array<元素类型>`：
```typescript
let list: Array<number> = [1, 2, 3];
```

#### **5. `tuple` (元组)**
元组类型允许你表示一个已知元素数量和类型的数组。各个元素的类型不必相同。

```typescript
// 定义一个包含 string 和 number 的元组
let x: [string, number];
// 初始化
x = ["hello", 10]; // 正确

// x = [10, "hello"]; // 错误，顺序和类型不匹配
```

#### **6. `enum` (枚举)**
`enum` 是对 JavaScript 标准数据类型的一个补充，它为一组数值赋予友好的名字。

```typescript
enum Color {
  Red,    // 默认从 0 开始
  Green,  // 1
  Blue    // 2
}
let c: Color = Color.Green; // c 的值为 1

// 也可以手动指定成员的数值
enum ColorWithValues {
  Red = 1,
  Green = 2,
  Blue = 4
}
let c2: ColorWithValues = ColorWithValues.Green; // c2 的值为 2

// 还可以通过数值反向查找名称
let colorName: string = Color[2]; // "Blue"
```

### **二、 特殊类型 (Special Types)**

这些类型在某些特定场景下非常有用。

#### **7. `any` (任意类型)**
`any` 类型可以让你绕过编译时的类型检查。如果你不希望某个值导致类型检查错误，可以将其指定为 `any`。这相当于让该变量回归到纯 JavaScript 的动态类型。**应谨慎使用 `any`**，因为它会削弱 TypeScript 的优势。

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 也可以是个布尔值

notSure.ifItExists(); // 编译时不会报错，但运行时会出错
notSure.toFixed(); // 编译时不会报错
```

#### **8. `unknown` (未知类型)**
`unknown` 是 `any` 类型的安全版本。任何类型的值都可以赋给 `unknown`，但 `unknown` 类型的值不能赋给除了 `any` 和 `unknown` 之外的任何其他类型。在使用 `unknown` 类型的值之前，必须先进行类型断言或类型收窄。

```typescript
let notSure: unknown = 4;
notSure = "maybe a string";

// let num: number = notSure; // 错误！不能将 unknown 赋给 number

if (typeof notSure === "string") {
  // 在这个代码块里，TypeScript 会将 notSure 推断为 string 类型
  console.log(notSure.toUpperCase()); // 正确
}
```

#### **9. `void` (无返回值)**
`void` 类型表示没有任何类型。通常用作函数没有返回值时的返回类型。

```typescript
function warnUser(): void {
  console.log("This is my warning message");
}
```

只能将 `null` 或 `undefined` 赋给 `void` 类型的变量（在 `strictNullChecks` 为 `false` 时）。

#### **10. `null` 和 `undefined`**
在 TypeScript 中，`null` 和 `undefined` 各有自己的类型，分别叫做 `null` 和 `undefined`。默认情况下，它们是所有类型的子类型，可以赋值给任何类型的变量。

但是，当你启用 `strictNullChecks` 配置时，`null` 和 `undefined` 只能赋值给 `void`、`any` 和它们各自的类型。这能帮助你避免很多常见的 bug。

```typescript
// strictNullChecks: false (默认)
let age: number = null; // 正确

// strictNullChecks: true
let name: string = null; // 错误！
let u: undefined = undefined; // 正确
let n: null = null; // 正确

// 如果希望一个变量可以为 null 或 undefined，可以使用联合类型
let nameOrNull: string | null = "Bob";
nameOrNull = null;
```

#### **11. `never` (永不存在的值)**
`never` 类型表示的是那些永不存在的值的类型。例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式的返回值类型。

```typescript
// 抛出异常的函数，永远不会有返回值
function error(message: string): never {
  throw new Error(message);
}

// 无限循环的函数，永远不会有返回值
function infiniteLoop(): never {
  while (true) {
  }
}
```

`never` 类型是任何类型的子类型，可以赋值给任何类型。但没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 自身之外）。

#### **12. `object` (对象类型)**
`object` 表示非原始类型，也就是除了 `number`, `string`, `boolean`, `symbol`, `null` 或 `undefined` 之外的类型。

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // 正确
create(null); // 正确

// create(42); // 错误
// create("string"); // 错误
```

### **三、 高级类型 (Advanced Types)**

#### **13. `Union Types` (联合类型)**
联合类型表示一个值可以是几种类型之一，使用 `|` 分隔。

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
  if (typeof id === "string") {
    // 在这里 id 的类型被收窄为 string
    console.log(id.toUpperCase());
  }
}

printId(101);
printId("202");
// printId({ myID: 22342 }); // 错误
```

#### **14. `Intersection Types` (交叉类型)**
交叉类型是将多个类型合并为一个类型，使用 `&` 连接。这让你可以将现有的多种类型叠加到一起，从而得到一个具备所有类型特征的新类型。

```typescript
interface Person {
  name: string;
  age: number;
}

interface Serializable {
  serialize(): string;
}

type PersonWithSerialization = Person & Serializable;

const person: PersonWithSerialization = {
  name: "Alice",
  age: 30,
  serialize: () => "name:Alice,age:30"
};
```

#### **15. `Literal Types` (字面量类型)**
字面量类型允许你将变量的类型限制为某个具体的字符串、数字或布尔值。

```typescript
let alignment: "left" | "right" | "center";
alignment = "left";
// alignment = "top"; // 错误

type Result = "success" | "failure";
let apiResult: Result = "success";
```

#### **16. `Type Aliases` (类型别名)**
使用 `type` 关键字可以为任何类型创建一个新名字。

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

#### **17. `Interfaces` (接口)**
接口是定义对象结构的一种方式，用于描述对象的形状。它与类型别名相似，但接口只能用于对象类型，并且可以被 `implements` 和 `extends`。

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

#### **18. `Generics` (泛型)**
泛型允许你创建可重用的组件，这些组件可以处理多种类型的数据，而不是单一类型。

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString"); // 明确指定类型
let output2 = identity(123); // 类型推断
```

#### **19. `Utility Types` (工具类型)**
TypeScript 内置了一些工具类型，用于帮助进行常见的类型转换。例如：
*   `Partial<T>`: 将 `T` 的所有属性变为可选。
*   `Readonly<T>`: 将 `T` 的所有属性变为只读。
*   `Pick<T, K>`: 从 `T` 中选择一组属性 `K` 来构造一个新类型。
*   `Omit<T, K>`: 从 `T` 中排除一组属性 `K` 来构造一个新类型。
*   `Record<K, T>`: 构造一个对象类型，其属性键为 `K`，属性值为 `T`。

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1: Todo = { title: "organize desk", description: "clear clutter" };
const todo2 = updateTodo(todo1, { description: "throw out trash" });
```

#### **20. `Mapped Types` (映射类型)**
映射类型允许你根据一个旧的类型来创建一个新的类型，通常与泛型结合使用。

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

以上就是 TypeScript 中几乎所有的类型。理解并熟练运用它们是掌握 TypeScript 的关键。

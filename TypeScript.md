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
- 配置文件 tsconfig.json
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
  1. "rootDir": "./src"
     * 作用：指定输入文件的根目录
     *  说明：TypeScript将从src目录查找源文件，并保持相同的目录结构输出到outDir
  2. "outDir": "./dist"
     * 作用：指定输出文件的目录
     * 说明：TypeScript将编译后的文件输出到dist目录
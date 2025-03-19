# 16 函数重载

函数重载是 TypeScript 中的一个高级特性，它允许我们为同一个函数提供多个函数类型定义。通过函数重载，我们可以根据不同的参数类型和数量，实现不同的功能逻辑，同时保持类型安全。

## 16.1 函数重载基础

函数重载允许一个函数接受不同数量或类型的参数，作出不同的处理。在 TypeScript 中，我们通过多个函数声明来定义重载，但只能有一个实现。

```typescript
// 函数重载基础示例
// 重载签名
function greet(person: string): string;
function greet(persons: string[]): string[];

// 实现签名（不会直接对外暴露）
function greet(person: string | string[]): string | string[] {
  if (typeof person === 'string') {
    return `Hello, ${person}!`;
  } else {
    return person.map(name => `Hello, ${name}!`);
  }
}

// 使用重载函数
const greeting1 = greet('Alice');       // 类型为 string
const greeting2 = greet(['Bob', 'Charlie']); // 类型为 string[]
```

在上面的例子中，`greet` 函数有两个重载签名，分别接受 `string` 和 `string[]` 类型的参数。当我们调用这个函数时，TypeScript 会根据我们传入的参数类型来选择正确的重载版本。

## 16.2 函数重载的工作原理

TypeScript 中的函数重载遵循以下工作流程：

1. 定义多个函数声明（重载签名）
2. 提供一个函数实现（实现签名）
3. 编译器在调用点根据参数匹配最适合的重载版本
4. 实现签名必须与所有重载签名兼容

```typescript
// 检查重载的匹配过程
function process(x: number): number;
function process(x: string): string;
function process(x: number | string): number | string {
  if (typeof x === 'number') {
    return x * 2;
  } else {
    return x.repeat(2);
  }
}

const a = process(10);    // 匹配第一个重载，返回类型是 number
const b = process("hi");  // 匹配第二个重载，返回类型是 string
// const c = process(true); // 错误：调用签名不匹配任何重载签名
```

## 16.3 重载签名的排序

重载签名的顺序很重要，因为 TypeScript 会按照定义的顺序来尝试匹配重载。应该把更具体的重载签名放在前面，把更通用的放在后面：

```typescript
// 不良排序示例
function badly(x: any): void;
function badly(x: string): void;
function badly(x: any): void {
  console.log(x);
}

badly("hello"); // 匹配第一个重载（any 类型），而不是更具体的 string 类型

// 良好排序示例
function properly(x: string): void;
function properly(x: any): void;
function properly(x: any): void {
  console.log(x);
}

properly("hello"); // 正确匹配第一个重载（string 类型）
```

## 16.4 函数重载与泛型结合

函数重载和泛型可以结合使用，创建更加灵活的 API：

```typescript
// 泛型与函数重载结合
function convert<T extends Date>(value: T): string;
function convert<T extends string>(value: T): Date;
function convert<T extends string | Date>(value: T): string | Date {
  if (value instanceof Date) {
    return value.toISOString();
  } else {
    return new Date(value);
  }
}

const dateStr = convert(new Date());  // 类型为 string
const date = convert("2023-01-01");   // 类型为 Date
```

## 16.5 类方法重载

类中的方法也可以使用重载：

```typescript
class Calculator {
  // 方法重载
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number | string, b: number | string): number | string {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    } else {
      return String(a) + String(b);
    }
  }
}

const calc = new Calculator();
const sum = calc.add(1, 2);      // 返回类型为 number
const text = calc.add("1", "2"); // 返回类型为 string
```

## 16.6 构造函数重载

类的构造函数也可以重载，允许使用不同的方式初始化对象：

```typescript
class User {
  name: string;
  age: number;
  email?: string;

  // 构造函数重载
  constructor(data: { name: string; age: number; email?: string });
  constructor(name: string, age: number, email?: string);
  constructor(nameOrData: string | { name: string; age: number; email?: string }, age?: number, email?: string) {
    if (typeof nameOrData === 'string') {
      this.name = nameOrData;
      this.age = age!;
      this.email = email;
    } else {
      this.name = nameOrData.name;
      this.age = nameOrData.age;
      this.email = nameOrData.email;
    }
  }
}

// 两种方式创建用户
const user1 = new User({ name: "Alice", age: 30, email: "alice@example.com" });
const user2 = new User("Bob", 25);
```

## 16.7 重载与 REST 参数

重载函数可以结合 REST 参数来处理可变数量的参数：

```typescript
// 使用 REST 参数的函数重载
function sum(a: number, b: number): number;
function sum(a: number, b: number, c: number): number;
function sum(...numbers: number[]): number;
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

const result1 = sum(1, 2);      // 类型为 number
const result2 = sum(1, 2, 3);   // 类型为 number
const result3 = sum(1, 2, 3, 4); // 类型为 number
```

## 16.8 函数重载的限制

函数重载虽然强大，但也有一些限制：

1. 实现签名必须兼容所有重载签名
2. 只有函数声明可以创建函数重载，函数表达式不行（但有替代方案）
3. 无法在实现签名中根据参数的具体类型来获得返回类型

```typescript
// 函数表达式无法直接重载
// 但可以使用类型定义来模拟重载
type OverloadedFunction = {
  (a: number): number;
  (a: string): string;
};

const processValue: OverloadedFunction = function(a: number | string): number | string {
  if (typeof a === 'number') {
    return a * 2;
  } else {
    return a.repeat(2);
  }
};

const result1 = processValue(10);   // 类型为 number
const result2 = processValue("hi"); // 类型为 string
```

## 16.9 实际应用场景

### 16.9.1 DOM 元素创建与操作

```typescript
// DOM 元素创建函数重载
function createElement(tag: 'a'): HTMLAnchorElement;
function createElement(tag: 'button'): HTMLButtonElement;
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const anchor = createElement('a');      // 类型为 HTMLAnchorElement
const button = createElement('button'); // 类型为 HTMLButtonElement
const div = createElement('div');       // 类型为 HTMLDivElement
const input = createElement('input');   // 类型为 HTMLInputElement

// 使用精确类型
anchor.href = "https://example.com";
button.disabled = true;
input.value = "Hello";
```

### 16.9.2 解析不同格式数据

```typescript
// 数据解析函数重载
function parse(data: string): string[];
function parse(data: string, separator: string): string[];
function parse<T>(data: string, reviver: (key: string, value: any) => T): T;
function parse(data: string, separatorOrReviver?: string | ((key: string, value: any) => any)): any {
  if (!separatorOrReviver) {
    return data.split(',');
  } else if (typeof separatorOrReviver === 'string') {
    return data.split(separatorOrReviver);
  } else {
    try {
      return JSON.parse(data, separatorOrReviver);
    } catch (e) {
      throw new Error('Invalid JSON string');
    }
  }
}

const simple = parse("a,b,c");                // 类型为 string[]
const custom = parse("a|b|c", "|");           // 类型为 string[]
const object = parse('{"name":"Alice"}', (_, v) => v); // 类型由 reviver 函数的返回类型决定
```

### 16.9.3 事件处理

```typescript
// 事件处理函数重载
type EventCallback<T> = (data: T) => void;

class EventManager {
  private handlers: Record<string, EventCallback<any>[]> = {};

  // 事件监听重载
  on<T>(event: string, handler: EventCallback<T>): void;
  on<T>(events: string[], handler: EventCallback<T>): void;
  on<T>(eventOrEvents: string | string[], handler: EventCallback<T>): void {
    if (Array.isArray(eventOrEvents)) {
      eventOrEvents.forEach(event => this.registerHandler(event, handler));
    } else {
      this.registerHandler(eventOrEvents, handler);
    }
  }

  private registerHandler<T>(event: string, handler: EventCallback<T>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  // 触发事件
  emit<T>(event: string, data: T): void {
    const eventHandlers = this.handlers[event] || [];
    eventHandlers.forEach(handler => handler(data));
  }
}

// 使用事件管理器
const events = new EventManager();

// 单个事件监听
events.on<string>("message", (data) => console.log(`Received message: ${data}`));

// 多个事件监听
events.on<number>(["update", "change"], (data) => console.log(`Value changed: ${data}`));

// 触发事件
events.emit("message", "Hello");  // Received message: Hello
events.emit("update", 42);        // Value changed: 42
```

### 16.9.4 工厂模式实现

```typescript
// 基于工厂模式的函数重载
interface Product {
  name: string;
  price: number;
}

interface DigitalProduct extends Product {
  downloadUrl: string;
  sizeInMB: number;
}

interface PhysicalProduct extends Product {
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

// 工厂函数重载
function createProduct(type: 'digital', name: string, price: number, downloadUrl: string, sizeInMB: number): DigitalProduct;
function createProduct(type: 'physical', name: string, price: number, weight: number, dimensions: { width: number, height: number, depth: number }): PhysicalProduct;
function createProduct(type: 'digital' | 'physical', name: string, price: number, ...rest: any[]): Product {
  if (type === 'digital') {
    return {
      name,
      price,
      downloadUrl: rest[0],
      sizeInMB: rest[1]
    } as DigitalProduct;
  } else {
    return {
      name,
      price,
      weight: rest[0],
      dimensions: rest[1]
    } as PhysicalProduct;
  }
}

// 创建不同类型的产品
const ebook = createProduct('digital', 'Programming TypeScript', 29.99, 'https://example.com/downloads/typescript-ebook', 15.4);
const book = createProduct('physical', 'TypeScript Handbook', 39.99, 0.8, { width: 7, height: 10, depth: 1 });

console.log(ebook.downloadUrl); // 类型安全访问 DigitalProduct 属性
console.log(book.weight);       // 类型安全访问 PhysicalProduct 属性
```

## 16.10 最佳实践

1. **从最具体到最一般进行排序**：将更具体的重载签名放在前面，确保 TypeScript 选择最精确的匹配。

2. **保持重载签名的数量合理**：过多的重载会使代码难以理解和维护，考虑使用泛型和条件类型替代部分重载。

3. **实现签名应兼容所有重载**：确保实现签名足够宽泛以处理所有重载情况。

4. **添加明确的文档注释**：为每个重载签名添加 JSDoc 注释，说明不同重载的用途和行为差异。

   ```typescript
   /**
    * 将值格式化为字符串
    * @param value 要格式化的数值
    * @returns 格式化后的字符串，带两位小数
    */
   function format(value: number): string;
   /**
    * 将值格式化为字符串
    * @param value 要格式化的日期
    * @returns 格式化后的日期字符串（YYYY-MM-DD）
    */
   function format(value: Date): string;
   function format(value: number | Date): string {
     if (value instanceof Date) {
       return value.toISOString().split('T')[0];
     }
     return value.toFixed(2);
   }
   ```

5. **优先使用联合类型和类型守卫**：对于简单情况，可以使用联合类型和类型守卫代替函数重载。

6. **避免重载具有相同数量和类型的参数但返回类型不同的函数**：这种情况下，TypeScript 只会根据参数进行重载匹配，不考虑返回类型。

通过本章的学习，你应该对 TypeScript 中的函数重载有了全面的了解，包括其基本概念、工作原理和实际应用场景。函数重载是一种强大的类型系统特性，能够帮助我们构建类型安全且灵活的 API。

# 17 泛型工厂函数类型

泛型工厂函数类型是 TypeScript 中一种强大的模式，它结合了泛型和工厂设计模式的优点，使我们能够创建高度灵活且类型安全的组件创建系统。

## 17.1 泛型工厂函数的基础概念

泛型工厂函数是一种特殊的函数，它能够根据提供的类型参数创建特定类型的对象。这种模式结合了泛型的类型安全和工厂模式的灵活性。

```typescript
// 最基本的泛型工厂函数类型
type Factory<T> = () => T;

// 使用示例
const createString: Factory<string> = () => "Hello World";
const createNumber: Factory<number> = () => 42;

const str = createString(); // 类型为 string
const num = createNumber(); // 类型为 number
```

## 17.2 带参数的泛型工厂函数

大多数工厂函数需要接受参数来定制创建的对象：

```typescript
// 带参数的泛型工厂函数类型
type FactoryWithParams<T, P> = (params: P) => T;

interface User {
  id: number;
  name: string;
  email: string;
}

type UserParams = Omit<User, 'id'>;

// 实现用户工厂
const createUser: FactoryWithParams<User, UserParams> = (params) => ({
  id: Math.floor(Math.random() * 10000),
  ...params
});

const user = createUser({ name: "Alice", email: "alice@example.com" });
console.log(user); // { id: 1234, name: "Alice", email: "alice@example.com" }
```

## 17.3 类构造函数作为泛型工厂

在 TypeScript 中，类的构造函数本身就可以看作是工厂。我们可以利用泛型类型来处理类构造函数：

```typescript
// 类构造函数类型
type Constructor<T> = new (...args: any[]) => T;

// 使用构造函数类型
function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args);
}

class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, my name is ${this.name}`;
  }
}

const person = createInstance(Person, "Bob", 30);
console.log(person.greet()); // "Hello, my name is Bob"
```

## 17.4 工厂模式与抽象类

结合泛型工厂和抽象类，我们可以创建强大的对象创建系统：

```typescript
// 抽象产品
abstract class Product {
  abstract getDescription(): string;
  abstract getPrice(): number;
}

// 具体产品
class Book extends Product {
  constructor(private title: string, private author: string, private price: number) {
    super();
  }

  getDescription() {
    return `Book: ${this.title} by ${this.author}`;
  }

  getPrice() {
    return this.price;
  }
}

class Electronics extends Product {
  constructor(private name: string, private brand: string, private price: number) {
    super();
  }

  getDescription() {
    return `Electronics: ${this.name} by ${this.brand}`;
  }

  getPrice() {
    return this.price;
  }
}

// 泛型工厂类型
type ProductFactory<T extends Product> = (config: any) => T;

// 工厂函数实现
const createBook: ProductFactory<Book> = (config) => {
  return new Book(config.title, config.author, config.price);
};

const createElectronics: ProductFactory<Electronics> = (config) => {
  return new Electronics(config.name, config.brand, config.price);
};

// 使用工厂
const book = createBook({ title: "TypeScript Design Patterns", author: "John Doe", price: 29.99 });
const laptop = createElectronics({ name: "Laptop", brand: "TechBrand", price: 999.99 });

console.log(book.getDescription()); // "Book: TypeScript Design Patterns by John Doe"
console.log(laptop.getDescription()); // "Electronics: Laptop by TechBrand"
```

## 17.5 基于映射类型的工厂注册表

我们可以创建一个类型安全的工厂注册表，使用映射类型确保类型安全：

```typescript
// 产品类型
interface Product {
  type: string;
  name: string;
  price: number;
}

interface Book extends Product {
  type: 'book';
  author: string;
  pages: number;
}

interface Electronics extends Product {
  type: 'electronics';
  brand: string;
  warranty: number; // in months
}

// 所有产品类型的联合
type AnyProduct = Book | Electronics;

// 基于产品类型创建对应的参数类型
type ProductParams<T extends AnyProduct> = Omit<T, 'type'>;

// 工厂函数类型
type ProductFactoryFn<T extends AnyProduct> = (params: ProductParams<T>) => T;

// 工厂注册表类型
type ProductFactories = {
  [K in AnyProduct['type']]: ProductFactoryFn<Extract<AnyProduct, { type: K }>>;
};

// 实现工厂注册表
const factories: ProductFactories = {
  book: (params) => ({
    type: 'book',
    ...params
  }),
  electronics: (params) => ({
    type: 'electronics',
    ...params
  })
};

// 创建产品实例
const myBook = factories.book({
  name: "TypeScript Advanced",
  price: 39.99,
  author: "Jane Smith",
  pages: 350
});

const myLaptop = factories.electronics({
  name: "UltraBook Pro",
  price: 1299.99,
  brand: "TechCorp",
  warranty: 24
});

console.log(myBook); // { type: 'book', name: 'TypeScript Advanced', ... }
console.log(myLaptop); // { type: 'electronics', name: 'UltraBook Pro', ... }
```

## 17.6 泛型工厂函数与依赖注入

泛型工厂函数可以与依赖注入模式结合，创建可测试和松耦合的组件：

```typescript
// 服务接口
interface Logger {
  log(message: string): void;
}

interface Database {
  save(data: unknown): void;
  find(query: unknown): unknown;
}

// 具体服务实现
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

class MongoDatabase implements Database {
  save(data: unknown): void {
    console.log(`Saving to MongoDB: ${JSON.stringify(data)}`);
  }

  find(query: unknown): unknown {
    console.log(`Finding in MongoDB with query: ${JSON.stringify(query)}`);
    return { result: "Data from MongoDB" };
  }
}

// 需要依赖的组件
class UserService {
  constructor(private logger: Logger, private db: Database) {}

  createUser(name: string, email: string): void {
    this.logger.log(`Creating user: ${name}`);
    this.db.save({ name, email });
  }

  findUser(email: string): unknown {
    this.logger.log(`Finding user with email: ${email}`);
    return this.db.find({ email });
  }
}

// 泛型工厂类型
type ServiceFactory<T> = (dependencies: any) => T;

// 服务工厂实现
type UserServiceDependencies = {
  logger: Logger;
  database: Database;
};

const createUserService: ServiceFactory<UserService> = (deps: UserServiceDependencies) => {
  return new UserService(deps.logger, deps.database);
};

// 创建服务并使用
const userService = createUserService({
  logger: new ConsoleLogger(),
  database: new MongoDatabase()
});

userService.createUser("Alice", "alice@example.com");
const user = userService.findUser("alice@example.com");
```

## 17.7 条件类型与泛型工厂函数

条件类型可以增强泛型工厂函数的灵活性：

```typescript
// 基于输入类型动态确定返回类型的工厂
type Response<T> = T extends { id: infer U } 
  ? { entity: T, id: U }
  : { entity: T & { id: string }, id: string };

// 泛型工厂函数
function processEntity<T>(data: T): Response<T> {
  if ('id' in data) {
    // @ts-ignore: 类型断言过于复杂，简化处理
    return { entity: data, id: data.id };
  }
  
  const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
  // @ts-ignore: 类型断言过于复杂，简化处理
  return { entity: { ...data, id }, id };
}

// 使用示例
const withId = processEntity({ id: 1, name: "Product" });
const withoutId = processEntity({ name: "New Product" });

console.log(withId.id); // 1
console.log(withoutId.id); // 自动生成的ID
console.log(withoutId.entity.id); // 相同的自动生成的ID
```

## 17.8 可组合的泛型工厂函数

创建可组合的工厂函数，以提高代码复用性：

```typescript
// 基础接口
interface Entity {
  id: string;
}

// 装饰器工厂类型
type DecoratorFactory<T> = (instance: T) => T;

// 创建可组合的装饰器工厂
function withTimestamps<T extends object>(): DecoratorFactory<T & { createdAt: Date; updatedAt: Date }> {
  return (instance) => ({
    ...instance,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

function withVersion<T extends object>(): DecoratorFactory<T & { version: number }> {
  return (instance) => ({
    ...instance,
    version: 1
  });
}

function withLogging<T extends Entity>(): DecoratorFactory<T> {
  return (instance) => {
    // 代理原始对象，添加日志行为
    return new Proxy(instance, {
      set(target, prop, value) {
        console.log(`Setting ${String(prop)} to ${value} for entity ${target.id}`);
        target[prop as keyof T] = value;
        return true;
      }
    });
  };
}

// 组合工厂函数
function compose<T>(...factories: Array<DecoratorFactory<any>>): DecoratorFactory<T> {
  return (instance) => factories.reduce((acc, factory) => factory(acc), instance as any);
}

// 基础实体工厂
function createUser(name: string, email: string): Entity & { name: string; email: string } {
  return {
    id: Math.random().toString(36).substring(2, 11),
    name,
    email
  };
}

// 组合增强的工厂
const createEnhancedUser = (name: string, email: string) => {
  const baseUser = createUser(name, email);
  
  const enhancer = compose(
    withTimestamps(),
    withVersion(),
    withLogging()
  );
  
  return enhancer(baseUser);
};

// 使用增强工厂
const user = createEnhancedUser("Alice", "alice@example.com");
console.log(user); // 包含 id, name, email, createdAt, updatedAt, version
user.name = "Alicia"; // 触发日志: Setting name to Alicia for entity xxx
```

## 17.9 实际应用场景示例

### 17.9.1 UI 组件工厂

```typescript
// 基础组件接口
interface Component {
  render(): string;
}

// 具体组件类型
interface Button extends Component {
  type: 'button';
  label: string;
  onClick: () => void;
}

interface Input extends Component {
  type: 'input';
  value: string;
  onChange: (value: string) => void;
}

interface Select extends Component {
  type: 'select';
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
}

// 组件联合类型
type AnyComponent = Button | Input | Select;

// 组件工厂类型
type ComponentFactory<T extends AnyComponent> = (props: Omit<T, 'type' | 'render'>) => T;

// 组件工厂实现
const createButton: ComponentFactory<Button> = (props) => ({
  type: 'button',
  ...props,
  render: () => `<button>${props.label}</button>`
});

const createInput: ComponentFactory<Input> = (props) => ({
  type: 'input',
  ...props,
  render: () => `<input value="${props.value}" />`
});

const createSelect: ComponentFactory<Select> = (props) => ({
  type: 'select',
  ...props,
  render: () => `
    <select>
      ${props.options.map(option => 
        `<option ${option === props.selected ? 'selected' : ''}>${option}</option>`
      ).join('')}
    </select>
  `
});

// 使用组件工厂
const submitButton = createButton({
  label: "Submit",
  onClick: () => console.log("Button clicked")
});

const nameInput = createInput({
  value: "",
  onChange: (val) => console.log(`Name changed: ${val}`)
});

const countrySelect = createSelect({
  options: ["USA", "Canada", "UK", "Australia"],
  selected: "USA",
  onChange: (val) => console.log(`Country selected: ${val}`)
});

// 渲染组件
console.log(submitButton.render()); // <button>Submit</button>
console.log(nameInput.render());    // <input value="" />
console.log(countrySelect.render()); // <select>...</select>
```

### 17.9.2 API 响应处理器工厂

```typescript
// API 响应类型
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

// 不同资源的数据类型
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  inventory: number;
}

// 响应处理器类型
interface ResponseHandler<T> {
  process(response: ApiResponse<T>): T;
  handleError(error: unknown): never;
}

// 响应处理器工厂类型
type ResponseHandlerFactory<T> = () => ResponseHandler<T>;

// 创建处理器的工厂函数
function createResponseHandler<T>(): ResponseHandler<T> {
  return {
    process(response: ApiResponse<T>): T {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(`API Error: ${response.message}`);
    },
    
    handleError(error: unknown): never {
      if (error instanceof Error) {
        throw new Error(`Failed to process response: ${error.message}`);
      }
      throw new Error('Failed to process response: Unknown error');
    }
  };
}

// 创建特定资源的处理器
const userResponseHandler = createResponseHandler<User>();
const productResponseHandler = createResponseHandler<Product>();

// 模拟 API 调用
async function fetchUser(id: number): Promise<User> {
  try {
    // 模拟 API 调用
    const response: ApiResponse<User> = {
      data: { id, name: "Alice Smith", email: "alice@example.com" },
      status: 200,
      message: "OK",
      timestamp: new Date().toISOString()
    };
    
    return userResponseHandler.process(response);
  } catch (error) {
    return userResponseHandler.handleError(error);
  }
}

async function fetchProduct(id: number): Promise<Product> {
  try {
    // 模拟 API 调用
    const response: ApiResponse<Product> = {
      data: { id, title: "Smartphone", price: 699, inventory: 42 },
      status: 200,
      message: "OK",
      timestamp: new Date().toISOString()
    };
    
    return productResponseHandler.process(response);
  } catch (error) {
    return productResponseHandler.handleError(error);
  }
}

// 使用处理器
async function run() {
  const user = await fetchUser(1);
  console.log(user.name); // Alice Smith
  
  const product = await fetchProduct(101);
  console.log(product.title); // Smartphone
}

// run();
```

## 17.10 最佳实践

1. **使用具体的类型参数名称**：使用描述性的类型参数名称，而不仅仅是 `T`，例如 `TProduct` 或 `TEntity`。

2. **限制泛型参数**：使用约束（`extends`）来限制泛型参数的范围，提高类型安全性。

3. **提供类型推导帮助**：设计 API 使调用者不必总是显式指定类型参数。

4. **组合而不是继承**：优先使用组合模式而不是深层继承结构来创建灵活的工厂。

5. **使用条件类型处理复杂场景**：对于复杂的类型逻辑，利用条件类型和映射类型。

6. **为每个工厂提供明确的返回类型**：确保每个工厂函数都有明确定义的返回类型。

7. **考虑添加运行时验证**：对于关键数据，结合 Zod 或其他验证库进行运行时类型检查。

泛型工厂函数类型是 TypeScript 中一种强大的模式，它结合了泛型的类型安全和工厂模式的灵活性。通过掌握这种模式，你可以创建高度灵活、可扩展且类型安全的代码库，特别适用于构建大型应用程序的组件系统、插件架构和依赖注入框架。

# 18 infer 工具类型

`infer` 关键字是 TypeScript 中的强大功能，它允许我们在条件类型中推断和提取类型的一部分。这个关键字只能在条件类型的 `extends` 子句中使用，使我们能够捕获和重用类型的组成部分。

## 18.1 infer 的基本概念

`infer` 关键字用于声明一个类型变量，该变量表示待推断的类型。它通常出现在条件类型的 `extends` 子句中：

```typescript
// infer 的基本语法
type ExtractType<T> = T extends infer R ? R : never;

// 使用示例
type Result = ExtractType<string>; // Result 类型为 string
```

在上述例子中，`infer R` 声明了一个名为 `R` 的类型变量，它代表我们想要从 `T` 中提取的类型。

## 18.2 infer 在条件类型中的应用

### 18.2.1 提取函数参数类型

```typescript
// 提取函数的第一个参数类型
type FirstParameter<T extends (...args: any[]) => any> = 
  T extends (first: infer First, ...rest: any[]) => any ? First : never;

// 示例
function greet(name: string, age: number): void {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

type NameType = FirstParameter<typeof greet>; // string
```

### 18.2.2 提取函数返回值类型

```typescript
// 提取函数返回值类型
type ReturnTypeCustom<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : any;

// 示例
function createUser(name: string, age: number) {
  return { name, age, createdAt: new Date() };
}

type User = ReturnTypeCustom<typeof createUser>; 
// { name: string; age: number; createdAt: Date; }
```

### 18.2.3 提取数组元素类型

```typescript
// 提取数组元素类型
type ArrayElement<T> = T extends Array<infer Element> ? Element : never;

// 示例
type Numbers = ArrayElement<number[]>; // number
type StringOrNumbers = ArrayElement<(string | number)[]>; // string | number
```

### 18.2.4 提取 Promise 包裹的类型

```typescript
// 提取 Promise 包裹的类型
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// 示例
type ResolvedType = UnpackPromise<Promise<string>>; // string
type NonPromiseType = UnpackPromise<number>; // number，保持不变
```

## 18.3 递归使用 infer 处理嵌套类型

我们可以递归地使用 `infer` 来处理嵌套类型：

```typescript
// 递归提取多层嵌套的 Promise 类型
type DeepUnpackPromise<T> = 
  T extends Promise<infer U> ? DeepUnpackPromise<U> : T;

// 示例
type NestedPromise = Promise<Promise<Promise<string>>>;
type FinalType = DeepUnpackPromise<NestedPromise>; // string
```

## 18.4 infer 在元组类型中的应用

### 18.4.1 提取元组的第一个元素类型

```typescript
// 提取元组的第一个元素类型
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

// 示例
type FirstElement = First<[string, number, boolean]>; // string
type EmptyTuple = First<[]>; // never
```

### 18.4.2 提取元组的最后一个元素类型

```typescript
// 提取元组的最后一个元素类型
type Last<T extends any[]> = 
  T extends [...any[], infer L] ? L : never;

// 示例
type LastElement = Last<[string, number, boolean]>; // boolean
```

### 18.4.3 移除元组的第一个元素

```typescript
// 移除元组的第一个元素
type Tail<T extends any[]> = 
  T extends [any, ...infer Rest] ? Rest : never;

// 示例
type TailElements = Tail<[string, number, boolean]>; // [number, boolean]
```

## 18.5 高级 infer 应用场景

### 18.5.1 从对象中提取特定属性的类型

```typescript
// 从对象中提取指定键的类型
type PropertyType<T, K extends keyof T> = T extends { [P in K]: infer R } ? R : never;

// 示例
interface User {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
  };
}

type AddressType = PropertyType<User, 'address'>;
// 类型为 { street: string; city: string; }
```

### 18.5.2 提取构造函数的实例类型

```typescript
// 提取构造函数的实例类型
type InstanceType<T extends new (...args: any[]) => any> = 
  T extends new (...args: any[]) => infer R ? R : never;

// 示例
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

type PersonInstance = InstanceType<typeof Person>; // Person
```

### 18.5.3 提取构造函数的参数类型

```typescript
// 提取构造函数的参数类型
type ConstructorParameters<T extends new (...args: any[]) => any> = 
  T extends new (...args: infer P) => any ? P : never;

// 示例
type PersonConstructorParams = ConstructorParameters<typeof Person>; // [name: string]
```

## 18.6 字符串操作与 infer

### 18.6.1 分割字符串字面量类型

```typescript
// 将字符串分割为前缀和后缀
type SplitString<S extends string, D extends string> = 
  S extends `${infer Prefix}${D}${infer Suffix}` ? [Prefix, Suffix] : [S, ""];

// 示例
type Parts = SplitString<"hello-world", "-">; // ["hello", "world"]
```

### 18.6.2 替换字符串字面量类型

```typescript
// 替换字符串中的子字符串
type ReplaceString<S extends string, From extends string, To extends string> = 
  S extends `${infer Prefix}${From}${infer Suffix}` 
    ? `${Prefix}${To}${Suffix}` 
    : S;

// 示例
type Replaced = ReplaceString<"hello world", "world", "TypeScript">; 
// "hello TypeScript"
```

## 18.7 条件类型分配与 infer

当我们将 `infer` 与联合类型结合使用时，需要了解条件类型分配的行为：

```typescript
// 从联合类型中提取字符串类型
type ExtractStringType<T> = T extends infer R 
  ? R extends string ? R : never 
  : never;

// 示例
type Mixed = string | number | boolean;
type OnlyStrings = ExtractStringType<Mixed>; // string
```

## 18.8 内置的使用 infer 的工具类型

TypeScript 内置了许多使用 `infer` 的工具类型，例如：

```typescript
// 内置的 ReturnType - 提取函数返回值类型
type MyFunc = () => string;
type MyFuncReturn = ReturnType<MyFunc>; // string

// 内置的 Parameters - 提取函数参数类型元组
type MyFunc2 = (a: string, b: number) => void;
type MyFuncParams = Parameters<MyFunc2>; // [string, number]

// 内置的 InstanceType - 提取构造函数实例类型
class Example {}
type ExampleInstance = InstanceType<typeof Example>; // Example
```

## 18.9 实际应用示例

### 18.9.1 类型安全的事件系统

```typescript
// 事件类型定义
interface EventMap {
  click: { x: number; y: number };
  change: { oldValue: string; newValue: string };
  submit: { data: Record<string, unknown> };
}

// 使用 infer 提取事件数据类型
type EventData<E extends keyof EventMap> = EventMap[E];

// 事件处理器类型
type EventHandler<E extends keyof EventMap> = (data: EventData<E>) => void;

// 事件系统
class EventEmitter {
  private handlers: Partial<{
    [E in keyof EventMap]: EventHandler<E>[];
  }> = {};

  // 添加事件监听器
  on<E extends keyof EventMap>(event: E, handler: EventHandler<E>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    (this.handlers[event] as EventHandler<E>[]).push(handler);
  }

  // 触发事件
  emit<E extends keyof EventMap>(event: E, data: EventData<E>): void {
    const handlers = this.handlers[event] as EventHandler<E>[] | undefined;
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// 使用事件系统
const emitter = new EventEmitter();

// 类型安全的事件监听
emitter.on("click", ({ x, y }) => {
  console.log(`Clicked at (${x}, ${y})`);
});

emitter.on("change", ({ oldValue, newValue }) => {
  console.log(`Value changed from '${oldValue}' to '${newValue}'`);
});

// 类型安全的事件触发
emitter.emit("click", { x: 100, y: 200 });
emitter.emit("change", { oldValue: "old", newValue: "new" });

// 类型错误示例 - 会在编译时捕获
// emitter.emit("click", { oldValue: "old", newValue: "new" }); // 错误！
// emitter.emit("submit", { x: 100, y: 200 }); // 错误！
```

### 18.9.2 API 响应类型提取

```typescript
// API 响应类型
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 使用 infer 提取 API 响应中的数据类型
type ExtractApiData<T> = T extends ApiResponse<infer Data> ? Data : never;

// 具体响应类型
interface UserResponse extends ApiResponse<{ id: number; name: string }> {}
interface ProductResponse extends ApiResponse<{ id: number; title: string; price: number }> {}

// 提取数据类型
type UserData = ExtractApiData<UserResponse>; // { id: number; name: string }
type ProductData = ExtractApiData<ProductResponse>; // { id: number; title: string; price: number }

// 类型安全的 API 处理函数
function processApiResponse<T>(response: ApiResponse<T>): T {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(`API Error: ${response.message}`);
}

// 使用示例
const userResponse: UserResponse = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "OK"
};

const userData = processApiResponse(userResponse);
console.log(userData.name); // 类型安全访问
```

## 18.10 最佳实践与注意事项

1. **使用描述性名称**：为使用 `infer` 声明的类型变量使用描述性名称，例如 `infer ReturnType` 而不是 `infer R`。

2. **避免过度嵌套的条件类型**：过于复杂的嵌套条件类型可能难以理解和维护。

3. **结合类型约束**：将 `infer` 与类型约束结合使用，可以更精确地提取所需类型。

4. **测试边缘情况**：确保类型工具能够正确处理空类型、联合类型等边缘情况。

5. **适当使用递归条件类型**：对于嵌套或递归数据结构，递归条件类型可能是必要的，但要注意可能的类型计算限制。

6. **了解分配条件类型**：当条件类型与联合类型一起使用时，条件类型会分配到联合的每个成员上。

通过掌握 `infer` 关键字，你可以创建强大的类型工具来提取、转换和操作类型，使 TypeScript 代码更加类型安全和表达力更强。无论是处理函数类型、对象类型、字符串操作还是复杂的嵌套数据结构，`infer` 都是一个不可或缺的工具。
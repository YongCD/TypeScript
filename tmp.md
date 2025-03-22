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

# 19 扁平模块化属性名

扁平模块化属性名是 TypeScript 中一种强大的类型操作技术，它允许我们将嵌套的属性结构转换为扁平化的字符串路径。这在处理大型模块化状态管理、事件系统或配置对象时特别有用。

## 19.1 基本概念

扁平模块化属性名使用模板字面量类型和映射类型，将多层嵌套的对象结构转换成单层的字符串键路径，通常使用分隔符（如 "/"）连接。

```typescript
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
}[keyof T]
// 这是关键点，[keyof T] 是在从上面创建的映射类型中提取所有属性值，并将它们合并为一个联合类型。

type TestResult = ModulesSpliceKeys<Modules>
// 结果：type TestResult = "menu/setActiveIndex" | "menu/setCollapse" | "tabs/seteditableTabsValue" | "tabs/setTabs" | "tabs/setTabsList"

type Test = {
  a: '1' | '2'
  b: '3' | '4'
}

type Test1 = Test[keyof Test] // 结果：type Test1 = "1" | "2" | "3" | "4"
```

## 19.2 核心理解

上面示例的核心工作原理是：

1. `MB<T, U>` 是一个模板字面量类型，用于连接两个类型参数，使用 `/` 作为分隔符
2. `ModulesSpliceKeys<T>` 定义了一个映射类型，它遍历 T 的每个键
3. 对于每个键，使用 `MB<key, keyof T[key]>` 来生成模块化路径
4. `[keyof T]` 索引访问语法从映射类型中提取所有值，得到一个联合类型

这样，原本的嵌套结构就被转换成了扁平化的路径字符串联合类型。

## 19.3 扩展示例

### 19.3.1 处理更深层次的嵌套

我们可以扩展这个技术来处理更深层次的嵌套结构：

```typescript
// 处理任意深度的嵌套结构
type NestedModules = {
  user: {
    profile: {
      update: (data: any) => void
      view: (id: string) => void
    }
    settings: {
      theme: {
        change: (theme: string) => void
      }
    }
  }
  products: {
    list: (filter: any) => void
    details: (id: string) => void
  }
}

// 处理两层嵌套
type TwoLevelKeys<T> = {
  [K1 in keyof T]: {
    [K2 in keyof T[K1]]: `${K1 & string}/${K2 & string}`
  }[keyof T[K1]]
}[keyof T]

// 处理三层嵌套
type ThreeLevelKeys<T> = {
  [K1 in keyof T]: {
    [K2 in keyof T[K1]]: {
      [K3 in keyof T[K1][K2]]: `${K1 & string}/${K2 & string}/${K3 & string}`
    }[keyof T[K1][K2]]
  }[keyof T[K1]]
}[keyof T]

type TwoLevelResult = TwoLevelKeys<NestedModules>;
// 结果: "user/profile" | "user/settings" | "products/list" | "products/details"

type ThreeLevelResult = ThreeLevelKeys<NestedModules>;
// 结果: "user/profile/update" | "user/profile/view" | "user/settings/theme" | "products/list" | "products/details"
```

### 19.3.2 递归处理任意深度

使用条件类型和递归，我们可以处理任意深度的嵌套结构：

```typescript
type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type IsObject<T> = T extends object ? (T extends Primitive ? false : true) : false;

// 递归生成路径，使用 P 参数记录当前路径
type RecursivePaths<T, P extends string = ''> = {
  [K in keyof T]: IsObject<T[K]> extends true
    ? RecursivePaths<T[K], `${P}${P extends '' ? '' : '/'}${K & string}`>
    : `${P}${P extends '' ? '' : '/'}${K & string}`;
}[keyof T];

type RecursiveResult = RecursivePaths<NestedModules>;
// 包含所有嵌套层级的路径
```

## 19.4 实际应用场景

### 19.4.1 状态管理中的路径类型

在使用 Redux 或其他状态管理库时，扁平模块化属性名可以用来类型安全地访问嵌套状态：

```typescript
// 应用状态定义
type AppState = {
  auth: {
    user: {
      id: string;
      name: string;
    } | null;
    isLoggedIn: boolean;
  };
  ui: {
    theme: 'light' | 'dark';
    sidebar: {
      isOpen: boolean;
      width: number;
    };
  };
};

// 生成所有可能的状态路径
type StateKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}` | `${K & string}.${StateKeys<T[K]>}`
    : `${K & string}`;
}[keyof T];

type AppStateKeys = StateKeys<AppState>;
// 结果包含: "auth" | "auth.user" | "auth.user.id" | "auth.user.name" | "auth.isLoggedIn" | ...

// 类型安全的状态访问函数
function getStateValue<T, P extends StateKeys<T>>(
  state: T,
  path: P
): any {
  return path.split('.').reduce((obj, key) => obj?.[key as keyof typeof obj], state as any);
}

// 使用示例
const state: AppState = {/* ... */};
const userName = getStateValue(state, "auth.user.name");
```

### 19.4.2 事件总线系统

扁平模块化属性名可用于创建类型安全的事件总线系统：

```typescript
// 定义事件映射
type EventMap = {
  user: {
    login: { id: string; name: string };
    logout: { reason: string };
  };
  system: {
    error: { code: number; message: string };
    notification: { title: string; body: string };
  };
};

// 生成事件路径
type EventPath<T> = {
  [K in keyof T]: {
    [E in keyof T[K]]: `${K & string}/${E & string}`;
  }[keyof T[K]];
}[keyof T];

// 获取特定事件的数据类型
type EventData<T, P extends EventPath<T>> = P extends `${infer M}/${infer E}`
  ? M extends keyof T
    ? E extends keyof T[M]
      ? T[M][E]
      : never
    : never
  : never;

// 事件总线实现
class EventBus<T> {
  private listeners: Record<string, Function[]> = {};

  // 订阅事件
  on<P extends EventPath<T>>(path: P, callback: (data: EventData<T, P>) => void) {
    if (!this.listeners[path]) {
      this.listeners[path] = [];
    }
    this.listeners[path].push(callback);
  }

  // 触发事件
  emit<P extends EventPath<T>>(path: P, data: EventData<T, P>) {
    const callbacks = this.listeners[path] || [];
    callbacks.forEach(callback => callback(data));
  }
}

// 使用事件总线
const bus = new EventBus<EventMap>();

bus.on("user/login", (data) => {
  // data 类型为 { id: string; name: string }
  console.log(`User ${data.name} logged in`);
});

bus.emit("user/login", { id: "123", name: "Alice" });
```

## 19.5 最佳实践与技巧

1. **使用分隔符的一致性**：在整个应用中使用一致的分隔符（如 `/` 或 `.`）

2. **性能考虑**：复杂的嵌套类型可能导致 TypeScript 编译器性能问题，对于非常复杂的结构，可能需要分解为更小的类型

3. **结合其他类型工具**：扁平模块化属性名可以与 `Pick`、`Omit` 等工具类型结合使用，创建更强大的类型系统

4. **生成类型和值的映射**：使用类型生成实际的路径字符串映射对象，确保代码和类型的一致性

```typescript
// 生成路径常量对象
const createPathConstants<T>() {
  // 实现根据类型 T 生成实际路径常量的逻辑
  // ...
}

// 使用示例
const PATHS = createPathConstants<Modules>();
dispatch(PATHS.menu.setActiveIndex, "1"); // 类型安全的路径字符串
```

扁平模块化属性名是 TypeScript 类型系统中的一项强大技术，它可以帮助我们在处理复杂的嵌套结构时保持类型安全，同时简化 API 设计和状态访问。通过将多层嵌套的对象结构转换为扁平化的字符串路径，我们可以更轻松地处理模块化的应用架构。

# 20 Record

Record 是 TypeScript 中一个非常实用的工具类型，它用于创建一个对象类型，其中所有键都是指定类型，所有值都是另一个指定类型。Record 类型可以帮助我们更安全地定义键值对集合，特别适用于字典、映射或对象字面量。

## 20.1 Record 的基本概念与语法

Record 类型接受两个类型参数：键类型和值类型，语法为 `Record<K, V>`。

```typescript
// Record 基本语法
type StringNumberRecord = Record<string, number>;

// 相当于
// type StringNumberRecord = { [key: string]: number };

// 使用示例
const scores: StringNumberRecord = {
  Alice: 95,
  Bob: 85,
  Charlie: 90
};

// 类型检查会确保所有值都是数字
// scores.David = "A"; // 错误: 不能将类型"string"分配给类型"number"
```

## 20.2 使用字面量类型作为键

Record 特别适合与字面量联合类型结合使用，可以创建固定键集合的对象类型：

```typescript
// 使用字面量联合类型作为键
type UserRole = "admin" | "user" | "guest";
type RoleDescription = Record<UserRole, string>;

const roleDescriptions: RoleDescription = {
  admin: "Full access to system",
  user: "Limited access to resources",
  guest: "View-only access"
};

// 类型系统会确保所有键都被定义
// 遗漏任何键都会导致类型错误
const incompleteRoles: RoleDescription = {
  admin: "Full access",
  user: "Limited access"
  // 错误: 缺少属性 'guest'
};

// 添加不在联合类型中的键也会导致错误
const extraRoles: RoleDescription = {
  admin: "Full access",
  user: "Limited access",
  guest: "View-only",
  moderator: "Moderation rights" // 错误: 'moderator' 不存在于类型 'UserRole' 中
};
```

## 20.3 Record 的内部实现

Record 的内部实现非常简单，它利用了映射类型：

```typescript
// Record 的伪代码实现
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};
```

这个实现表明：
- `K` 必须是可用作对象键的类型（string、number、symbol或它们的联合）
- `V` 可以是任何类型
- 结果是一个具有所有键 `K` 和值类型 `V` 的对象类型

## 20.4 与其他类型工具结合使用

Record 可以与其他类型工具结合使用，创建更复杂的类型：

```typescript
// Record 与 Partial 结合
type PartialRecord<K extends keyof any, V> = Partial<Record<K, V>>;

// 这创建了一个对象类型，其中所有键都是可选的
type OptionalUserRoles = PartialRecord<UserRole, boolean>;

// 可以只指定部分键
const userPermissions: OptionalUserRoles = {
  admin: true
  // user 和 guest 是可选的
};

// Record 与 Pick 结合
interface User {
  id: number;
  name: string;
  email: string;
  address: string;
}

type UserSummary = Record<"basic" | "contact", Pick<User, "name" | "email">>;

// 结果类型为: {
//   basic: { name: string; email: string },
//   contact: { name: string; email: string }
// }
```

## 20.5 实际应用场景

### 20.5.1 API 响应映射

Record 非常适合处理 API 响应或缓存数据：

```typescript
// 使用 Record 管理 API 缓存
interface User {
  id: number;
  name: string;
  email: string;
}

// 按 ID 缓存用户数据
type UserCache = Record<number, User>;

class UserService {
  private cache: UserCache = {};

  async getUser(id: number): Promise<User> {
    // 如果已缓存，直接返回
    if (this.cache[id]) {
      return this.cache[id];
    }
    
    // 否则从 API 获取
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    
    // 存入缓存
    this.cache[id] = user;
    return user;
  }
}
```

### 20.5.2 查找表和映射

Record 适用于创建查找表或映射关系：

```typescript
// 状态映射
type RequestStatus = "idle" | "loading" | "success" | "error";

const statusMessages: Record<RequestStatus, string> = {
  idle: "Waiting to start",
  loading: "Loading data...",
  success: "Data loaded successfully",
  error: "Failed to load data"
};

function getStatusMessage(status: RequestStatus): string {
  return statusMessages[status];
}

// 组件映射
type ComponentType = "button" | "input" | "select" | "checkbox";

const componentMap: Record<ComponentType, React.ComponentType<any>> = {
  button: Button,
  input: Input,
  select: Select,
  checkbox: Checkbox
};

function renderComponent(type: ComponentType, props: any): JSX.Element {
  const Component = componentMap[type];
  return <Component {...props} />;
}
```

### 20.5.3 状态管理

在状态管理中使用 Record 可以更好地组织数据：

```typescript
// 实体规范化
interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  authorId: number;
}

// 规范化的状态
interface NormalizedState {
  users: Record<number, User>;
  posts: Record<number, Post>;
  userPosts: Record<number, number[]>; // 用户 ID -> 帖子 ID 数组
}

// 初始状态
const initialState: NormalizedState = {
  users: {},
  posts: {},
  userPosts: {}
};

// 添加用户
function addUser(state: NormalizedState, user: User): NormalizedState {
  return {
    ...state,
    users: {
      ...state.users,
      [user.id]: user
    },
    userPosts: {
      ...state.userPosts,
      [user.id]: state.userPosts[user.id] || []
    }
  };
}
```

## 20.6 Record 与索引签名的比较

Record 类型和索引签名有相似之处，但也有重要区别：

```typescript
// 索引签名
type StringToNumber = {
  [key: string]: number;
};

// 等效的 Record 类型
type StringToNumberRecord = Record<string, number>;

// 区别1: Record 可以使用字面量联合类型作为键
type Status = "pending" | "fulfilled" | "rejected";
type StatusMap = Record<Status, number>;

// 区别2: Record 与其他工具类型结合更容易
type NullableStringRecord = Record<string, string | null>;
```

## 20.7 动态键名与 Record

Record 类型的一个常见用例是处理动态键：

```typescript
// 动态收集数据
function collectMetrics<K extends string>(
  keys: K[]
): Record<K, number> {
  const result = {} as Record<K, number>;
  
  keys.forEach(key => {
    result[key] = 0; // 初始化所有指标为0
  });
  
  return result;
}

const metrics = collectMetrics(["clicks", "impressions", "conversions"]);
// metrics 的类型为 Record<"clicks" | "impressions" | "conversions", number>

metrics.clicks += 1; // 有类型安全
// metrics.unknown += 1; // 错误: 属性 'unknown' 不存在
```

## 20.8 嵌套 Record 类型

Record 可以嵌套使用，创建复杂的层次结构：

```typescript
// 嵌套 Record 类型
type NestedRecord = Record<string, Record<string, number>>;

const userData: NestedRecord = {
  Alice: {
    age: 30,
    score: 95
  },
  Bob: {
    age: 25,
    score: 85
  }
};

// 更深层次的嵌套
type DeepNestedRecord = Record<string, Record<string, Record<string, any>>>;

// 或者递归类型
type RecursiveRecord = {
  [key: string]: RecursiveRecord | number;
};
```

## 20.9 最佳实践

1. **优先使用字面量类型作为键**：当键的集合是已知且有限的，使用字面量联合类型可提高类型安全性。

2. **避免过度嵌套**：过深的 Record 嵌套可能导致类型难以理解，考虑拆分或使用接口。

3. **结合其他工具类型**：将 Record 与 Partial、Pick 等其他工具类型结合，可以构建更灵活的类型。

4. **为值提供更具体的类型**：避免使用 `any` 作为值类型，尽可能提供更具体的类型。

5. **考虑扩展性**：如果对象的键可能会增加，考虑使用更通用的索引签名或将 Record 与其他类型联合。

Record 是 TypeScript 中一个简单但功能强大的工具类型，掌握它可以帮助你更好地组织和类型化基于对象的数据结构，增强代码的类型安全性和可维护性。
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

# 21 装饰器

装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、访问器、属性或参数上。装饰器使用 `@expression` 形式，其中 `expression` 必须计算为一个函数，该函数将在运行时被调用，提供有关被装饰声明的信息。

## 21.1 装饰器基础

装饰器是实验性的功能，需要在 `tsconfig.json` 中启用：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### 21.1.1 装饰器的基本结构

装饰器是一个函数，接收特定的参数，具体参数取决于装饰器的类型：

```typescript
// 类装饰器的基本结构
function classDecorator(constructor: Function) {
  // 可以修改或增强类
  console.log(`类 ${constructor.name} 已被装饰`);
}

// 使用装饰器
@classDecorator
class Example {
  // 类的内容
}
```

## 21.2 类装饰器

类装饰器应用于类的构造函数，可以用来观察、修改或替换类定义。

```typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  console.log(`类 ${constructor.name} 已被密封`);
}

@sealed
class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 21.2.1 工厂装饰器

装饰器工厂是一个返回装饰器的函数，允许我们自定义装饰器的行为：

```typescript
// 装饰器工厂
function logger(prefix: string) {
  return function(constructor: Function) {
    console.log(`${prefix} ${constructor.name}`);
  };
}

@logger("创建了类:")
class Person {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}
```

### 21.2.2 替换构造函数的类装饰器

类装饰器可以返回一个新的构造函数来替换原始类：

```typescript
// 替换构造函数的类装饰器
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://example.com";
    
    report() {
      console.log(`Reporting to ${this.reportingURL}`);
    }
  };
}

@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;
  
  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("需要修复的错误");
(bug as any).report(); // 输出: Reporting to http://example.com
```

## 21.3 方法装饰器

方法装饰器应用于类的方法上，可以用于观察、修改或替换方法定义。

```typescript
// 方法装饰器
function enumerable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 21.3.1 方法装饰器参数解析

方法装饰器接收三个参数：
1. `target`: 静态成员的类构造函数或实例成员的原型
2. `propertyKey`: 方法名称
3. `descriptor`: 属性描述符，与 `Object.defineProperty` 中使用的相同

### 21.3.2 修改方法实现的装饰器

```typescript
// 修改方法实现的装饰器
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`调用 ${propertyKey} 方法，参数: ${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} 方法返回: ${JSON.stringify(result)}`);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(1, 2); // 输出日志并返回3
```

## 21.4 访问器装饰器

访问器装饰器应用于属性的 get 或 set 访问器，与方法装饰器类似。

```typescript
// 访问器装饰器
function configurable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;
  
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  
  @configurable(false)
  get x() {
    return this._x;
  }
  
  @configurable(false)
  get y() {
    return this._y;
  }
}
```

## 21.5 属性装饰器

属性装饰器应用于类的属性，接收两个参数：
1. `target`: 静态成员的类构造函数或实例成员的原型
2. `propertyKey`: 属性名称

```typescript
// 属性装饰器
function format(formatString: string) {
  return function(target: any, propertyKey: string) {
    // 创建一个私有属性来存储原始值
    const privatePropKey = `_${propertyKey}`;
    
    // 替换属性的getter和setter
    Object.defineProperty(target, propertyKey, {
      get: function() {
        const value = this[privatePropKey];
        if (formatString === 'uppercase') {
          return value.toUpperCase();
        }
        return value;
      },
      set: function(value: string) {
        this[privatePropKey] = value;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class Greeter {
  @format('uppercase')
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  greet() {
    return `Hello, ${this.greeting}`;
  }
}

const greeter = new Greeter('world');
console.log(greeter.greeting); // 输出: "WORLD"
console.log(greeter.greet()); // 输出: "Hello, WORLD"
```

## 21.6 参数装饰器

参数装饰器应用于函数或构造函数的参数，接收三个参数：
1. `target`: 静态成员的类构造函数或实例成员的原型
2. `propertyKey`: 方法名称
3. `parameterIndex`: 参数在函数参数列表中的索引

```typescript
// 参数装饰器
function required(target: any, propertyKey: string, parameterIndex: number) {
  // 获取原始方法
  const method = target[propertyKey];
  
  // 替换方法实现
  target[propertyKey] = function(...args: any[]) {
    // 检查指定的参数是否存在
    if (args[parameterIndex] === undefined || args[parameterIndex] === null) {
      throw new Error(`参数 ${parameterIndex} 是必需的`);
    }
    return method.apply(this, args);
  };
}

class UserService {
  login(username: string, @required password: string) {
    // 登录逻辑
    return `登录: ${username}, ${password}`;
  }
}

const userService = new UserService();
console.log(userService.login("admin", "123456")); // 正常工作
// userService.login("admin", null); // 抛出错误: 参数 1 是必需的
```

## 21.7 装饰器执行顺序

多个装饰器同时应用于一个声明时，它们的执行顺序如下：

1. 从上到下计算装饰器表达式
2. 得到的结果会从下到上调用

```typescript
function first() {
  console.log("first(): 计算装饰器表达式");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): 调用装饰器函数");
  };
}

function second() {
  console.log("second(): 计算装饰器表达式");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): 调用装饰器函数");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}

// 输出:
// first(): 计算装饰器表达式
// second(): 计算装饰器表达式
// second(): 调用装饰器函数
// first(): 调用装饰器函数
```

对于类中不同成员上的装饰器的执行顺序是：

1. 参数装饰器，然后方法装饰器，然后访问器或属性装饰器应用于实例成员
2. 参数装饰器，然后方法装饰器，然后访问器或属性装饰器应用于静态成员
3. 类装饰器

## 21.8 实际应用场景

### 21.8.1 依赖注入

```typescript
// 简单的依赖注入实现
const serviceSymbol = Symbol("services");

// 服务装饰器
function Service() {
  return function(constructor: Function) {
    Reflect.defineMetadata("isService", true, constructor);
  };
}

// 注入装饰器
function Inject(serviceName: string) {
  return function(target: any, propertyKey: string) {
    const services = Reflect.getOwnMetadata(serviceSymbol, target) || {};
    services[propertyKey] = serviceName;
    Reflect.defineMetadata(serviceSymbol, services, target);
  };
}

@Service()
class UserService {
  getUserDetails(id: string) {
    return { id, name: "User" + id };
  }
}

@Service()
class ProductService {
  getProductDetails(id: string) {
    return { id, name: "Product" + id };
  }
}

class AppController {
  @Inject("UserService")
  private userService: UserService;
  
  @Inject("ProductService")
  private productService: ProductService;
  
  getUserProduct(userId: string, productId: string) {
    const user = this.userService.getUserDetails(userId);
    const product = this.productService.getProductDetails(productId);
    return { user, product };
  }
}
```

### 21.8.2 路由和中间件

```typescript
// 简单的路由装饰器
function Route(path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.routes) {
      target.routes = [];
    }
    
    target.routes.push({
      path,
      method: propertyKey,
      handler: descriptor.value
    });
  };
}

// 中间件装饰器
function Use(middleware: Function) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.middlewares) {
      target.middlewares = {};
    }
    
    if (!target.middlewares[propertyKey]) {
      target.middlewares[propertyKey] = [];
    }
    
    target.middlewares[propertyKey].push(middleware);
  };
}

// 权限检查中间件
function checkAdmin(req: any, res: any, next: Function) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send('禁止访问');
  }
  next();
}

class UserController {
  @Route('/users')
  getUsers(req: any, res: any) {
    res.send('返回所有用户');
  }
  
  @Route('/users/admin')
  @Use(checkAdmin)
  getAdminPanel(req: any, res: any) {
    res.send('管理员面板');
  }
}
```

### 21.8.3 ORM 和数据验证

```typescript
// 实体装饰器
function Entity(tableName: string) {
  return function(constructor: Function) {
    constructor.prototype.tableName = tableName;
  };
}

// 列装饰器
function Column(options: { type: string; primary?: boolean }) {
  return function(target: any, propertyKey: string) {
    if (!target.columns) {
      target.columns = {};
    }
    
    target.columns[propertyKey] = options;
  };
}

// 验证装饰器
function Length(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    if (!target.validations) {
      target.validations = {};
    }
    
    if (!target.validations[propertyKey]) {
      target.validations[propertyKey] = [];
    }
    
    target.validations[propertyKey].push({
      type: 'length',
      min,
      max,
      validate: (value: string) => value.length >= min && value.length <= max
    });
  };
}

@Entity('users')
class User {
  @Column({ type: 'int', primary: true })
  id: number;
  
  @Column({ type: 'varchar' })
  @Length(3, 50)
  name: string;
  
  @Column({ type: 'varchar' })
  @Length(5, 100)
  email: string;
  
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
```

## 21.9 装饰器与反射元数据

使用 `reflect-metadata` 库可以增强装饰器的功能，允许存储和检索元数据：

```typescript
// 安装: npm install reflect-metadata

import "reflect-metadata";

// 类型装饰器与元数据
function Typed() {
  return function(target: any, propertyKey: string) {
    const type = Reflect.getMetadata("design:type", target, propertyKey);
    console.log(`${propertyKey} 的类型是: ${type.name}`);
  };
}

class Example {
  @Typed()
  name: string;
  
  @Typed()
  age: number;
}

// 输出:
// name 的类型是: String
// age 的类型是: Number
```

## 21.10 装饰器的限制与最佳实践

### 21.10.1 限制

1. 装饰器是实验性功能，API 可能会在未来版本中改变
2. 装饰器无法访问构造函数参数属性
3. 装饰器在运行时执行，不是在编译时
4. 方法装饰器不能改变方法的参数类型

### 21.10.2 最佳实践

1. 使用装饰器工厂提供自定义参数
2. 保持装饰器的单一职责
3. 使用反射元数据增强类型信息
4. 避免在装饰器中产生副作用
5. 为装饰器提供完善的类型定义和文档
6. 在关键代码路径上进行性能测试，因为装饰器可能引入性能开销

## 21.11 TypeScript 5.0+ 装饰器更新

TypeScript 5.0 引入了新的装饰器标准，与旧版实验性装饰器有一些重要区别：

```typescript
// 新的类装饰器语法
function logged(value: any, context: ClassDecoratorContext) {
  if (context.kind === "class") {
    return class extends value {
      constructor(...args: any[]) {
        super(...args);
        console.log(`实例化类: ${context.name}`);
      }
    };
  }
  return value;
}

@logged
class Person {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}

// 新的方法装饰器语法
function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  if (context.kind === "method") {
    return function(this: any, ...args: any[]) {
      console.log(`调用方法: ${String(context.name)}`);
      return originalMethod.apply(this, args);
    };
  }
  return originalMethod;
}

class Calculator {
  @logged
  add(a: number, b: number): number {
    return a + b;
  }
}
```

新的装饰器标准提供了更好的类型安全性和更灵活的应用方式。

装饰器是 TypeScript 中非常强大的功能，能够帮助实现面向切面编程、依赖注入、元编程等高级概念。尽管仍在实验阶段，但已在多个主流框架中得到广泛应用，如 Angular、NestJS 和 TypeORM 等。
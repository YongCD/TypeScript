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

装饰器(Decorators)是一种特殊类型的声明，它能够被附加到类声明、方法、访问符、属性或参数上。装饰器使用 `@expression` 形式，`expression` 必须求值为一个函数，该函数在运行时被调用，被装饰的声明信息会被作为参数传入。

## 21.1 装饰器基础

### 21.1.1 启用装饰器

在 TypeScript 中使用装饰器需要在 `tsconfig.json` 中启用相关选项：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true // 可选，用于反射元数据
  }
}
```

### 21.1.2 装饰器执行时机

装饰器是在类定义时执行的函数，而不是在实例化类时。

```typescript
function log(target: any) {
  console.log("类装饰器被执行");
}

@log
class MyClass {
  // 类定义
}

// 输出 "类装饰器被执行"，即使没有实例化类
```

## 21.2 装饰器类型

TypeScript 支持五种类型的装饰器：

1. 类装饰器
2. 方法装饰器
3. 访问器装饰器
4. 属性装饰器
5. 参数装饰器

### 21.2.1 类装饰器

类装饰器应用于类构造函数，可以用来监视、修改或替换类定义。

```typescript
function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    newProperty = "新属性";
    hello = "重写的属性";
  };
}

@classDecorator
class Greeter {
  property = "原始属性";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

const greeter = new Greeter("世界");
console.log(greeter.property); // 输出 "原始属性"
console.log(greeter.hello); // 输出 "重写的属性" 
console.log((greeter as any).newProperty); // 输出 "新属性"
```

### 21.2.2 方法装饰器

方法装饰器应用于类的方法上，可以用来监视、修改或替换方法定义。

```typescript
function methodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // 保存原始方法
  const originalMethod = descriptor.value;
  
  // 修改方法实现
  descriptor.value = function(...args: any[]) {
    console.log(`调用方法 ${propertyKey} 参数:`, args);
    // 调用原始方法并返回结果
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${propertyKey} 返回值:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @methodDecorator
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(1, 2);
// 输出:
// 调用方法 add 参数: [1, 2]
// 方法 add 返回值: 3
```

### 21.2.3 访问器装饰器

访问器装饰器应用于访问器的属性描述符，可用于监听、修改或替换访问器的定义。

```typescript
function accessorDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // 获取原始 getter
  const originalGetter = descriptor.get;
  
  // 修改 getter
  descriptor.get = function() {
    console.log(`获取属性 ${propertyKey} 的值`);
    // 调用原始 getter
    return originalGetter?.call(this);
  };
  
  return descriptor;
}

class Person {
  private _name: string;
  
  constructor(name: string) {
    this._name = name;
  }
  
  @accessorDecorator
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    this._name = value;
  }
}

const person = new Person("张三");
console.log(person.name);
// 输出:
// 获取属性 name 的值
// 张三
```

### 21.2.4 属性装饰器

属性装饰器声明在属性声明之前，可用于监听类中属性的变化。

```typescript
function propertyDecorator(target: any, propertyKey: string) {
  // 在这里我们可以使用属性名称做一些事情
  
  // 创建一个新的属性，前缀为 _
  const newKey = `_${propertyKey}`;
  
  // 通过重新定义属性，添加日志或校验
  Object.defineProperty(target, propertyKey, {
    get() {
      console.log(`获取属性 ${propertyKey} 的值`);
      return this[newKey];
    },
    set(value: any) {
      console.log(`设置属性 ${propertyKey} 的值为 ${value}`);
      this[newKey] = value;
    },
    enumerable: true,
    configurable: true
  });
}

class Product {
  @propertyDecorator
  price: number;
  
  constructor(price: number) {
    this.price = price;
  }
}

const product = new Product(100);
product.price = 200;
console.log(product.price);
// 输出:
// 设置属性 price 的值为 100
// 设置属性 price 的值为 200
// 获取属性 price 的值
// 200
```

### 21.2.5 参数装饰器

参数装饰器应用于类构造函数或方法声明的参数之前，可以为方法参数添加额外的元数据。

```typescript
function paramDecorator(target: any, methodName: string, paramIndex: number) {
  console.log(`方法 ${methodName} 的第 ${paramIndex} 个参数被装饰`);
  
  // 可以存储参数元数据
  const existingParameters: number[] = Reflect.getOwnMetadata("custom:parameters", target, methodName) || [];
  existingParameters.push(paramIndex);
  Reflect.defineMetadata("custom:parameters", existingParameters, target, methodName);
}

class OrderService {
  placeOrder(
    @paramDecorator orderId: string,
    @paramDecorator quantity: number
  ) {
    console.log(`下单: ${orderId}, 数量: ${quantity}`);
  }
}

const orderService = new OrderService();
orderService.placeOrder("ORD-123", 5);
// 输出:
// 方法 placeOrder 的第 0 个参数被装饰
// 方法 placeOrder 的第 1 个参数被装饰
// 下单: ORD-123, 数量: 5
```

## 21.3 装饰器工厂

装饰器工厂是一个函数，它返回一个装饰器函数，这样可以让我们传入参数来定制装饰器的行为。

```typescript
function logWithPrefix(prefix: string) {
  // 返回装饰器函数
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 保存原始方法
    const originalMethod = descriptor.value;
    
    // 修改方法
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix} 调用方法 ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class TaskManager {
  @logWithPrefix("TASK")
  runTask(taskName: string): void {
    console.log(`执行任务: ${taskName}`);
  }
  
  @logWithPrefix("DEBUG")
  debugTask(taskName: string): void {
    console.log(`调试任务: ${taskName}`);
  }
}

const manager = new TaskManager();
manager.runTask("数据备份");
manager.debugTask("性能检测");
// 输出:
// TASK 调用方法 runTask
// 执行任务: 数据备份
// DEBUG 调用方法 debugTask
// 调试任务: 性能检测
```

## 21.4 装饰器组合

多个装饰器可以应用到同一个声明上，它们的执行顺序是：

1. 从上到下依次对装饰器表达式求值
2. 求值的结果会被当作函数，从下到上依次调用

```typescript
function first() {
  console.log("first(): 装饰器工厂");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): 装饰器调用");
  };
}

function second() {
  console.log("second(): 装饰器工厂");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): 装饰器调用");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}

// 输出:
// first(): 装饰器工厂
// second(): 装饰器工厂
// second(): 装饰器调用
// first(): 装饰器调用
```

## 21.5 实际应用场景

### 21.5.1 依赖注入

装饰器可用于实现依赖注入系统，如 Angular、NestJS 等框架中的用法。

```typescript
// 简化版的依赖注入系统
const dependenciesRegistry = new Map<any, any[]>();

// 服务装饰器
function Service() {
  return function<T extends new (...args: any[]) => {}>(constructor: T) {
    // 注册服务
    console.log(`服务 ${constructor.name} 已注册`);
    return constructor;
  };
}

// 注入装饰器
function Inject(service: any) {
  return function(target: any, propertyKey: string | symbol) {
    const existingInjections = dependenciesRegistry.get(target.constructor) || [];
    dependenciesRegistry.set(target.constructor, [
      ...existingInjections,
      { propertyKey, service }
    ]);
  };
}

// 服务类
@Service()
class UserService {
  getUsers() {
    return ["User1", "User2"];
  }
}

@Service()
class ProductService {
  getProducts() {
    return ["Product1", "Product2"];
  }
}

// 使用服务的控制器
@Service()
class UserController {
  @Inject(UserService)
  private userService: UserService;
  
  @Inject(ProductService)
  private productService: ProductService;
  
  getUsersAndProducts() {
    return {
      users: this.userService.getUsers(),
      products: this.productService.getProducts()
    };
  }
}

// 手动处理依赖注入
function initializeService<T>(Service: new (...args: any[]) => T): T {
  const instance = new Service();
  const injections = dependenciesRegistry.get(Service) || [];
  
  injections.forEach(({ propertyKey, service }) => {
    (instance as any)[propertyKey] = new service();
  });
  
  return instance;
}

// 使用
const userController = initializeService(UserController);
console.log(userController.getUsersAndProducts());
```

### 21.5.2 验证

装饰器可以用于验证类属性和方法参数。

```typescript
// 简单的验证装饰器
function Min(minValue: number) {
  return function(target: any, propertyKey: string) {
    // 获取属性描述符
    let value: any;
    
    // 创建 getter 和 setter
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: any) {
        if (newValue < minValue) {
          throw new Error(`${propertyKey} 不能小于 ${minValue}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

function MaxLength(maxLength: number) {
  return function(target: any, propertyKey: string) {
    // 获取属性描述符
    let value: any;
    
    // 创建 getter 和 setter
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: any) {
        if (typeof newValue === 'string' && newValue.length > maxLength) {
          throw new Error(`${propertyKey} 长度不能超过 ${maxLength} 个字符`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @MaxLength(10)
  name: string;
  
  @Min(0)
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

try {
  const user1 = new User("张三", 20); // 正常
  console.log(user1);
  
  const user2 = new User("这个名字肯定超过了十个字符", 20); // 抛出错误
} catch (error) {
  console.error(error.message); // name 长度不能超过 10 个字符
}

try {
  const user3 = new User("李四", -5); // 抛出错误
} catch (error) {
  console.error(error.message); // age 不能小于 0
}
```

### 21.5.3 方法缓存

使用装饰器实现方法结果的缓存：

```typescript
function Memoize() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, any>();
    
    descriptor.value = function(...args: any[]) {
      // 使用参数创建缓存键
      const key = JSON.stringify(args);
      
      // 检查是否已缓存
      if (cache.has(key)) {
        console.log(`[缓存命中] ${propertyKey}(${key})`);
        return cache.get(key);
      }
      
      // 没有缓存，调用原方法
      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      console.log(`[缓存存储] ${propertyKey}(${key})`);
      
      return result;
    };
    
    return descriptor;
  };
}

class MathService {
  @Memoize()
  fibonacci(n: number): number {
    console.log(`计算 fibonacci(${n})`);
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const math = new MathService();
console.log(math.fibonacci(6)); // 首次计算
console.log(math.fibonacci(6)); // 从缓存返回
```

### 21.5.4 权限控制

使用装饰器实现方法的权限控制：

```typescript
// 权限枚举
enum Role {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

// 权限检查装饰器
function RequireRole(role: Role) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      // 模拟获取当前用户角色
      const currentUserRole = getCurrentUserRole();
      
      if (!hasPermission(currentUserRole, role)) {
        throw new Error(`当前用户没有 ${role} 角色的权限`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// 模拟权限检查
function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.ADMIN]: 3,
    [Role.USER]: 2,
    [Role.GUEST]: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// 模拟获取当前用户角色
function getCurrentUserRole(): Role {
  // 实际应用中，这可能来自用户会话或认证服务
  return Role.USER;
}

class AdminPanel {
  @RequireRole(Role.USER)
  viewDashboard() {
    return "仪表盘数据";
  }
  
  @RequireRole(Role.ADMIN)
  deleteUser(userId: string) {
    return `用户 ${userId} 已删除`;
  }
}

const panel = new AdminPanel();

try {
  console.log(panel.viewDashboard()); // 成功，因为当前用户是 USER
} catch (error) {
  console.error(error.message);
}

try {
  console.log(panel.deleteUser("123")); // 失败，因为需要 ADMIN 角色
} catch (error) {
  console.error(error.message); // 当前用户没有 admin 角色的权限
}
```

## 21.6 装饰器和元数据反射

结合 `reflect-metadata` 库，装饰器可以提供更强大的元数据程序设计能力。

```typescript
import 'reflect-metadata';

// 自定义元数据键
const API_METHOD_METADATA = 'api:method';
const API_PATH_METADATA = 'api:path';

// HTTP 方法装饰器
function Get(path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(API_METHOD_METADATA, 'GET', target, propertyKey);
    Reflect.defineMetadata(API_PATH_METADATA, path, target, propertyKey);
    return descriptor;
  };
}

function Post(path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(API_METHOD_METADATA, 'POST', target, propertyKey);
    Reflect.defineMetadata(API_PATH_METADATA, path, target, propertyKey);
    return descriptor;
  };
}

// 控制器装饰器
function Controller(basePath: string) {
  return function<T extends new (...args: any[]) => {}>(target: T) {
    Reflect.defineMetadata('controller:base-path', basePath, target);
    return target;
  };
}

// API 控制器
@Controller('/users')
class UserController {
  @Get('/')
  getUsers() {
    return { users: ['User1', 'User2'] };
  }
  
  @Post('/')
  createUser() {
    return { status: 'created' };
  }
  
  @Get('/:id')
  getUserById() {
    return { user: 'User1' };
  }
}

// 路由扫描器（简化版）
function scanControllers(controllers: any[]) {
  const routes: { method: string; path: string; handler: Function }[] = [];
  
  for (const Controller of controllers) {
    const basePath = Reflect.getMetadata('controller:base-path', Controller) || '';
    const controller = new Controller();
    
    // 获取所有方法
    const methodKeys = Object.getOwnPropertyNames(Controller.prototype).filter(
      key => key !== 'constructor' && typeof controller[key] === 'function'
    );
    
    for (const methodKey of methodKeys) {
      const method = Reflect.getMetadata(API_METHOD_METADATA, Controller.prototype, methodKey);
      const path = Reflect.getMetadata(API_PATH_METADATA, Controller.prototype, methodKey);
      
      if (method && path) {
        routes.push({
          method,
          path: `${basePath}${path}`,
          handler: controller[methodKey].bind(controller)
        });
      }
    }
  }
  
  return routes;
}

// 扫描路由
const routes = scanControllers([UserController]);
console.log(routes);
// 输出类似:
// [
//   { method: 'GET', path: '/users/', handler: [Function] },
//   { method: 'POST', path: '/users/', handler: [Function] },
//   { method: 'GET', path: '/users/:id', handler: [Function] }
// ]

// 模拟请求处理
function handleRequest(method: string, path: string) {
  const route = routes.find(r => r.method === method && r.path === path);
  if (route) {
    console.log(`执行路由 ${method} ${path}`);
    return route.handler();
  }
  return { error: 'Not Found' };
}

console.log(handleRequest('GET', '/users/')); // { users: ['User1', 'User2'] }
console.log(handleRequest('POST', '/users/')); // { status: 'created' }
```

## 21.7 最佳实践

1. **保持装饰器的专注性**：每个装饰器应该只做一件事，符合单一职责原则。

2. **使用装饰器工厂**：通过装饰器工厂传递参数，而不是在装饰器中硬编码值。

3. **考虑副作用**：装饰器会在类定义时执行，而不是在实例化时，注意这可能导致的副作用。

4. **组合优于继承**：使用装饰器组合功能，通常比使用继承更灵活。

5. **正确处理 `this` 上下文**：在装饰器中改变方法时，确保正确绑定 `this` 上下文。

6. **文档化装饰器**：为你的装饰器提供良好的文档，说明它们的用途、参数和行为。

7. **测试装饰器**：装饰器应该和其他代码一样经过彻底测试，尤其是边界情况。

## 21.8 装饰器的限制

1. **实验性特性**：装饰器在 TypeScript 中仍是一个实验性特性，API 可能会在未来版本中改变。

2. **执行顺序复杂性**：当多个装饰器组合使用时，执行顺序可能不直观。

3. **调试困难**：装饰器可能使代码调试变得更加困难，因为它们在运行时修改行为。

4. **元数据反射依赖**：许多高级装饰器模式依赖 `reflect-metadata` 库，增加了项目依赖。

5. **浏览器兼容性**：使用装饰器可能需要额外的转译步骤和 polyfill 来支持所有目标浏览器。

TypeScript 的装饰器是一个强大的工具，可以帮助我们编写更干净、更具表达力的代码。通过装饰器，我们可以以非侵入式的方式向类和类成员添加功能，实现关注点分离，提高代码的可维护性。

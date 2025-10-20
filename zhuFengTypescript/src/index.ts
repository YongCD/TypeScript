import 'reflect-metadata'

function Injectable(_target: any): void {}

function LogType(_target: any, _propertyKey: string) {}

@Injectable
class User {
  @LogType
  name: string
  @LogType
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

const userParamTypes = Reflect.getMetadata('design:paramtypes', User)
console.log('userParamTypes:', userParamTypes) // 输出构造函数参数的类型名称
// userParamTypes.forEach((item: any) => {
//   console.dir(item) // 输出构造函数参数的类型名称
// })

const userNameType = Reflect.getMetadata('design:type', User.prototype, 'name')
const userAgeType = Reflect.getMetadata('design:type', User.prototype, 'age')
console.log('userNameType:', userNameType)
console.log('String:', String)
console.log(String)
console.log('userAgeType:', userAgeType)

export {}

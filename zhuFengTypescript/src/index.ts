import 'reflect-metadata'

function Required(target: any, propertyKey: string) {
  Reflect.defineMetadata('required', true, target, propertyKey)
}

function validateRequired(target: any) {
  console.log(target)
  for (const key of Object.keys(target)) {
    // 从实例的原型上获取元数据
    const isRequired = Reflect.getMetadata('required', target, key)
    if (isRequired && !target[key]) {
      throw new Error(`Field ${key} is required`)
    }
  }
}

class Person {
  @Required
  name: string
  age: number
}
const person = new Person()
person.name = '' // 设置为空字符串以触发验证错误
validateRequired(person) // Throws error: Field name is required

export {}

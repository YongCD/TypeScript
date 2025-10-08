function propertyDecorator(target: any, propertyKey: string) {
  // 在这里我们可以使用属性名称做一些事情

  // 创建一个新的属性，前缀为 _
  const newKey = `_${propertyKey}`

  // 通过重新定义属性，添加日志或校验
  Object.defineProperty(target, propertyKey, {
    get() {
      console.log(`获取属性 ${propertyKey} 的值`)
      return this[newKey]
    },
    set(value: any) {
      console.log(`设置属性 ${propertyKey} 的值为 ${value}`)
      this[newKey] = value
    },
    enumerable: true,
    configurable: true,
  })
}

class Product {
  @propertyDecorator
  price: number

  constructor(price: number) {
    this.price = price
  }
}

const product = new Product(100)
product.price = 200
console.log('product', product)
// 输出:
// 设置属性 price 的值为 100
// 设置属性 price 的值为 200
// 获取属性 price 的值
// 200

export {}

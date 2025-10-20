import 'reflect-metadata'
import { container } from './container'
import { UserController } from './services'

console.log('Application starting...')
console.log('Requesting UserController from the IoC container...')

// 我们只请求顶层的 UserController，容器会为我们处理一切
const controller = container.get(UserController)

console.log('UserController instance received. Executing handleRequest...')
controller.handleRequest()

console.log('Application finished.')

export {}

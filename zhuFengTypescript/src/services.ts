export function Injectable(): ClassDecorator {
  return _target => {} // 装饰器本身可以是空的
}

@Injectable()
export class DatabaseService {
  getData() {
    return 'Data from database'
  }
}

@Injectable()
export class UserService {
  // 依赖 DatabaseService
  constructor(private dbService: DatabaseService) {}

  getUserData() {
    console.log('UserService is getting data...')
    return this.dbService.getData()
  }
}

@Injectable()
export class UserController {
  // 依赖 UserService
  constructor(private userService: UserService) {}

  handleRequest() {
    console.log('Controller is handling a request...')
    const data = this.userService.getUserData()
    console.log(`Controller received: ${data}`)
  }
}

export {}

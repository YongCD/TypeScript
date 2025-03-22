interface Todo {
  title: string;
  completed: boolean;
  description: string;
}

type PickTodoList = Record<string, Omit<Todo, 'description'>>

let todoList: Todo[] = [
  {
    title: '开发权限管理模块',
    completed: true,
    description: '开发权限管理模块',
  },
  {
    title: '年会',
    completed: false,
    description: '12月29日上午开心酒店1楼105'
  }
]

function pickTitle<T extends Todo> (todo: T) {
  return todo.title
}

function pickTodoList<T extends Todo[]> (todoList: T) {
  const pickTodoList: PickTodoList = {}
  todoList.forEach((todo) => {
    const { description, ...restTodo } = todo;
    pickTodoList[pickTitle(todo)] = restTodo
  })
  return pickTodoList
}

const pickTodoListResult = pickTodoList(todoList)
console.log(pickTodoListResult)

export {}

type obj = { a: 'a', b: 'b' }
type Test = Exclude<obj, 'b'>

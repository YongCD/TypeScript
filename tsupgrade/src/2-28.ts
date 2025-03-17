class Person {
  name: string;
  age: number;
  address: string;
  static count: number = 0;

  constructor(name: string, age: number, address: string) {
    this.name = name;
    this.age = age;
    this.address = address;
    Person.count++;
  }

  introduce(): string {
    return `Hello, my name is ${this.name}, I am ${this.age} years old, and I live at ${this.address}.`;
  }
}

const mark = new Person('Mark', 23, 'Seoul');
const jane = new Person('Jane', 32, 'New York');

console.log(mark.introduce()); // Hello, my name is Mark, I am 23 years old, and I live at Seoul.
console.log(Person.count); // 2

export {}
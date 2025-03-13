let str: string = "abc"
console.log("str: ", str) // 在控制台中输入：npx tsc 文件名.ts 会编译成 文件名.js 放在当前目录下

export {}
/**
 * 为什么要在TypeScript文件末尾添加 export {}
 * 在TypeScript文件末尾添加 export {} 是一种常见做法，主要有以下原因：
 * 1. 避免全局作用域污染：使用 export {} 可以确保这个文件的内容不会与其他文件中的变量或类型冲突。
 *    -添加任何导出语句会将文件视为模块(module)而非脚本(script)
 *    -模块有自己的独立作用域，变量不会污染全局命名空间
 * 2. 避免命名冲突：没有export的情况下，同名变量在不同文件中会被视为同一个全局变量。
 *    -这会导致"Cannot redeclare block-scoped variable"错误
 * 3. 空导出技巧: export {}是一个空导出，不会实际导出任何内容, 仅用于将文件标记为模块
 * 4. 适用场景
 *    -特别适合单文件测试或示例代码
 *    -对于实际项目中需要被其他文件导入的模块，应该导出有意义的内容
 * 
 * 如果不添加export {}，TypeScript会将该文件视为全局脚本，变量可能与其他文件中的同名变量冲突。
 */

// container.ts
import 'reflect-metadata'

type Constructor<T> = new (...args: any[]) => T

class IoCContainer {
  private instances = new Map<Constructor<any>, any>()

  // `get` 方法是实现控制反转的入口
  public get<T>(target: Constructor<T>): T {
    // 如果实例已存在，直接返回（单例模式）
    if (this.instances.has(target)) {
      return this.instances.get(target)
    }

    // --- 控制反转的核心逻辑开始 ---

    // 1. 读取“依赖清单” (利用 design:paramtypes 元数据)
    const paramTypes: Constructor<any>[] | undefined = Reflect.getMetadata(
      'design:paramtypes',
      target,
    )

    // 2. 如果没有依赖
    if (!paramTypes || paramTypes.length === 0) {
      console.log(`[IoC] Creating instance of ${target.name} (no dependencies)`)
      const instance = new target()
      this.instances.set(target, instance)
      return instance
    }

    // 3. 如果有依赖，则递归地解析它们
    console.log(
      `[IoC] Resolving dependencies for ${target.name}: [${paramTypes
        .map(p => p.name)
        .join(', ')}]`,
    )
    const dependencies = paramTypes.map(paramType => this.get(paramType))

    // 4. 所有依赖都解析完毕后，创建目标实例，并将依赖注入
    console.log(
      `[IoC] All dependencies for ${target.name} are resolved. Creating instance...`,
    )
    const instance = new target(...dependencies)
    this.instances.set(target, instance)

    return instance
  }
}

// 导出一个全局的容器实例
export const container = new IoCContainer()

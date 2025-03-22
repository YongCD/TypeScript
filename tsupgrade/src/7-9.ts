class CommerCialBank {
  public address: string = "beijing"
  public name: string = "wangwu"
  static count: number

  constructor (name: string, address: string) {
    this.address = address
    this.name = name
  }
  loan (): void {
    console.log("银行贷款")
  }
}

type ConstructorType = new (name: string, address: string) => CommerCialBank

export {}
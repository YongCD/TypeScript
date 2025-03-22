interface Customer {
  customerName: string;
  buyMoney: number;
}

type CustFn = (params: Customer) => string;
type CustParaTyp = CustFn extends (params: infer P) => string ? P : CustFn;

export {}

enum AuditStatus {
  NO_AUDIT = 0,
  MANAGER_AUDIT_SUCCESS = 1,
  FINANCE_AUDIT_SUCCESS = 2
}

type Expense = {
  id: number;
  events: string;
  time: Date;
  enumAuditStatus: AuditStatus;
}

class MyAudit {
  getAuditStatus(status: AuditStatus): void {
    switch (status) {
      case AuditStatus.NO_AUDIT:
        console.log('未审核');
        break;
      case AuditStatus.MANAGER_AUDIT_SUCCESS:
        console.log('经理审核通过');
        const expense: Expense = {
          id: 1,
          events: '购买办公用品',
          time: new Date(),
          enumAuditStatus: AuditStatus.MANAGER_AUDIT_SUCCESS
        }
        console.log(expense);
        break;
      case AuditStatus.FINANCE_AUDIT_SUCCESS:
        console.log('财务审核通过');
        break;
      default:
        console.log('未知状态');
    }
  }
}

const myAudit = new MyAudit();
myAudit.getAuditStatus(AuditStatus.MANAGER_AUDIT_SUCCESS);

export {}
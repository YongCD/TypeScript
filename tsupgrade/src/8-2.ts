class Subject {
  constructor (subId: number, subName: string) {

  }
}

const chineseSubject = new Subject(1, 'Chinese');
const mathSubject = new Subject(2, 'Math');
const englishSubject = new Subject(3, 'English');
const setZSSUbject = new Set([chineseSubject, mathSubject, englishSubject])

type subjectType<P> = P extends Set<infer K> ? K : never
type leixin = subjectType<typeof setZSSUbject>

export {}

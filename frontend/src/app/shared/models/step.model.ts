export class Step {
  id: number;
  order: number;
  title: string;
  desc: string;
  next!: Step;
  prev!: Step;

  constructor(id: number, order: number, title: string, desc: string) {
    this.id = id;
    this.order = order;
    this.title = title;
    this.desc = desc;
  }

   getPrev() {
    return this.prev;
  }

   getNext() {
    return this.next;
  }
   setNext(step:Step |null) {
    this.next=step!
  }
   setPrev(step:Step|null){
    this.prev=step!
  }
}

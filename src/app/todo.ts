export class Todo {
  id: number;
  title = '';
  timeSpent: number;
  complete = false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

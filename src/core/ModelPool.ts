export default class ModelPool<T> {
  private pool: T[] = [];

  constructor(private createFunc: () => T) {}

  public get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFunc();
  }

  public release(obj: T): void {
    this.pool.push(obj);
  }
}

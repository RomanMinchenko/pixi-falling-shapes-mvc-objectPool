export default class ShapePool<T extends { shapeType?: K }, K> {
  private pool: T[] = [];

  constructor(private createFunc: () => T) {}

  public get(type: K): T {
    const item = this.pool.find((item) => item.shapeType === type);
    if (item) {
      this.pool.splice(this.pool.indexOf(item), 1);
      return item;
    }
    return this.createFunc();
  }

  public release(obj: T): void {
    this.pool.push(obj);
  }
}

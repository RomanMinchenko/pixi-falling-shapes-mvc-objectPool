import ShapeType from "../core/ShapeType.enum";

export default class ShapeModel {
  public id: number = -1;
  public shapeType!: ShapeType | undefined;
  public position = { x: 0, y: 0 };
  public velocity = { x: 0, y: 0 };
  public surfaceSizeArea: number = 2500;
  public color: number = 0xffffff;
  public rotation: number = 0;
  public rotationSpeed: number = 0;
  public mass: number = 1;

  public setData(
    shapeType: ShapeType,
    x: number,
    y: number,
    surfaceSizeArea: number,
    color: number,
    rotation: number = 0,
    rotationSpeed: number = 0,
    mass: number = 1,
  ): void {
    this.shapeType = shapeType;
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.surfaceSizeArea = surfaceSizeArea;
    this.color = color;
    this.rotation = rotation;
    this.rotationSpeed = rotationSpeed;
    this.mass = mass;
  }

  public reset(): void {
    this.shapeType = undefined;
    this.position.x = 0;
    this.position.y = 0;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.surfaceSizeArea = 2500;
    this.color = 0xffffff;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.mass = 1;
  }

  public applyImpulse(ix: number, iy: number): void {
    this.velocity.x += ix / this.mass;
    this.velocity.y += iy / this.mass;
  }

  public update(dt: number, gravity: number): void {
    this.velocity.y += gravity * dt;

    this.position.y += this.velocity.y * dt;
    this.position.x += this.velocity.x * dt;
    this.rotation += this.rotationSpeed * dt;
  }

  public getSurfaceSizeArea(): number {
    return this.surfaceSizeArea;
  }
}

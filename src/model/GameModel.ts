import ModelPool from "../core/ModelPool";
import ShapeType from "../core/ShapeType.enum";
import ShapeModel from "./ShapeModel";

const TIME_SCALE = 0.0001;

export default class GameModel {
  public gameAreaSize = { width: 800, height: 600 };

  private shapesNumber: number = 0;
  private shapesSurfaceArea: number = 0;
  private gravity: number = 1;
  private spawnPerSec: number = 1;

  private shapeModels: Set<ShapeModel> = new Set();
  private modelPool!: ModelPool<ShapeModel>;

  private modelIdCounter = 0;

  constructor() {
    this.initModelPool();
  }

  public update(dt: number): void {
    this.shapeModels.forEach((model) => {
      const gravity = this.gravity * TIME_SCALE;
      model.update(dt, gravity);
    });
  }

  public getRandomShapeData() {
    const shapeTypes = Object.values(ShapeType);

    const randomType =
      shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const surfaceSizeArea = Math.random() * 2000 + 500;
    const color = Math.floor(Math.random() * 0xffffff);
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * TIME_SCALE * 10;

    return { randomType, surfaceSizeArea, color, rotation, rotationSpeed };
  }

  public spawnShapeModel(
    shapeType: ShapeType,
    x: number,
    y: number,
    surfaceSizeArea: number,
    color: number,
    rotation: number = 0,
    rotationSpeed: number = 0,
    mass: number = 1,
  ): ShapeModel {
    const model = this.modelPool.get();
    model.setData(
      shapeType,
      x,
      y,
      surfaceSizeArea,
      color,
      rotation,
      rotationSpeed,
      mass,
    );
    this.shapeModels.add(model);
    return model;
  }

  public removeModel(model: ShapeModel): void {
    if (this.shapeModels.delete(model)) {
      model.reset();
      this.modelPool.release(model);
    }
  }

  public models(): Set<ShapeModel> {
    return this.shapeModels;
  }

  public getShapesNumber(): number {
    return this.shapesNumber;
  }

  public getShapesSurfaceArea(): number {
    return this.shapesSurfaceArea;
  }

  public getGravity(): number {
    return this.gravity;
  }

  public getSpawnPerSec(): number {
    return this.spawnPerSec;
  }

  public updateNumberShapes(amount: number): void {
    this.shapesNumber += amount;
  }

  public updateShapesSurfaceArea(amount: number): void {
    this.shapesSurfaceArea += amount;
  }

  public updateGravity(delta: number): void {
    this.gravity = this.gravity + delta;
  }

  public updateSpawnPerSec(delta: number): void {
    this.spawnPerSec = this.spawnPerSec + delta;
  }

  private initModelPool(): void {
    this.modelPool = new ModelPool<ShapeModel>(() => {
      const model = new ShapeModel();
      model.id = this.modelIdCounter++;
      return model;
    });
  }

  public explodeModel(model: ShapeModel): void {
    const { surfaceSizeArea, position } = model;
    const pieceArea = 10;
    const piecesNumber = Math.floor(surfaceSizeArea / pieceArea);

    for (let i = 0; i < piecesNumber; i++) {
      const { randomType, color, rotation, rotationSpeed } =
        this.getRandomShapeData();
      const angle = Math.random() * Math.PI * 2;
      const mass = Math.random() * 0.5 + 0.1;

      const pieceModel = this.spawnShapeModel(
        randomType,
        position.x,
        position.y,
        pieceArea,
        color,
        rotation,
        rotationSpeed * 10,
        mass,
      );

      const impulseStrength = Math.random() * 0.05 - 0.025;
      const ix = Math.cos(angle) * impulseStrength;
      const iy = Math.sin(angle) * impulseStrength;
      pieceModel.applyImpulse(ix, iy);
    }

    this.updateNumberShapes(piecesNumber);
    this.updateShapesSurfaceArea(pieceArea * piecesNumber);
  }
}

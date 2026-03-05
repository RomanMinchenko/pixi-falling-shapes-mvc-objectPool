import { Container, Graphics } from "pixi.js";
import ShapeModel from "../model/ShapeModel";
import AbstractShape from "./shapes/Shape.abstract";
import ShapeType from "../core/ShapeType.enum";
import { createShapeInstance } from "./shapes/ShapeFactory";
import { ViewEvent } from "./events";

export default class ShapeView extends Container {
  public id: number = -1;
  public shape: AbstractShape | undefined;
  public shapeType: ShapeType | undefined;
  public model: ShapeModel | undefined;

  private gfx!: Graphics;

  constructor() {
    super();

    this.gfx = new Graphics();
    this.addChild(this.gfx);

    this.interactive = true;
    this.cursor = "pointer";
    this.on("pointerdown", (e) => {
      e.stopPropagation();
      this.emit(ViewEvent.shapeClick, this.model);
    });
  }

  public redraw() {
    this.gfx.clear();
    this.shape?.draw(this.gfx);
    this.shape?.applySurfaceArea(this.gfx);
  }

  public updateColor(): void {
    if (this.model) {
      this.gfx.tint = this.model.color;
    }
  }

  public update() {
    if (!this.model) return;
    this.position.set(this.model.position.x, this.model.position.y);
    this.rotation = this.model.rotation;
  }

  public init(model: ShapeModel) {
    if (this.model) return;

    this.model = model;
    this.shapeType = model.shapeType as ShapeType;

    this.shape = createShapeInstance(model, this.shapeType);
    this.rotation = this.model.rotation;
  }

  public clear(): void {
    if (this.gfx) {
      this.gfx.clear();
      this.gfx.position.set(0, 0);
      this.gfx.scale.set(1, 1);
      this.gfx.rotation = 0;
    }
    this.position.set(0, 0);
    this.scale.set(1, 1);
    this.rotation = 0;

    this.shape = undefined;
    this.model = undefined;
  }
}

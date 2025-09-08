import { Graphics } from "pixi.js";
import ShapeModel from "../../model/ShapeModel";

export default abstract class AbstractShape {
  protected defaultRadius: number = 50;
  protected points: { x: number; y: number }[] = [];

  constructor(protected model: ShapeModel) {}
  abstract draw(graphics: Graphics): void;
  abstract applySurfaceArea(graphics: Graphics): void;
}

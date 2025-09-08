import { Graphics } from "pixi.js";
import AbstractShape from "./Shape.abstract";
import { getRandomInt } from "../../utils/random";

export default class Ellipse extends AbstractShape {
  private ellipseRadiusX!: number;
  private ellipseRadiusY!: number;

  public draw(graphics: Graphics): void {
    const { defaultRadius } = this;

    const ellipseRadiusX = (this.ellipseRadiusX = getRandomInt(
      defaultRadius / 2,
      defaultRadius,
    ));
    const ellipseRadiusY = (this.ellipseRadiusY = getRandomInt(
      defaultRadius / 4,
      defaultRadius / 2,
    ));
    graphics.ellipse(0, 0, ellipseRadiusX, ellipseRadiusY);
    graphics.closePath();

    graphics.fill({ color: this.model.color, alpha: 1 });
    graphics.pivot.set(0, 0);
  }

  public applySurfaceArea(graphics: Graphics): void {
    const { ellipseRadiusX, ellipseRadiusY, model } = this;
    const defaultArea = Math.PI * ellipseRadiusX * ellipseRadiusY;
    const scale = Math.sqrt(model.surfaceSizeArea / defaultArea);
    graphics.scale.set(scale, scale);
  }
}

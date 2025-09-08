import { Graphics } from "pixi.js";
import AbstractShape from "./Shape.abstract";

export default class Circle extends AbstractShape {
  public draw(graphics: Graphics): void {
    graphics.circle(0, 0, this.defaultRadius / 2);
    graphics.closePath();

    graphics.fill({ color: this.model.color, alpha: 1 });
    graphics.pivot.set(0, 0);
  }

  public applySurfaceArea(graphics: Graphics): void {
    const { defaultRadius, model } = this;
    const defaultArea = Math.PI * Math.pow(defaultRadius / 2, 2);
    const scale = Math.sqrt(model.surfaceSizeArea / defaultArea);
    graphics.scale.set(scale, scale);
  }
}

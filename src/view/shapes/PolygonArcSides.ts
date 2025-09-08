import { Graphics } from "pixi.js";
import Polygon from "./Polygon";
import { getRandomInt } from "../../utils/random";

export default class PolygonArcSides extends Polygon {
  public draw(graphics: Graphics): void {
    this.sidesCount = getRandomInt(5, 12);

    super.draw(graphics);
  }

  public applySurfaceArea(graphics: Graphics): void {
    const { model, points } = this;

    let defaultArea = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      defaultArea += p1.x * p2.y - p2.x * p1.y;
    }
    defaultArea = Math.abs(defaultArea / 2);

    const scale = Math.sqrt(model.surfaceSizeArea / defaultArea);
    graphics.scale.set(scale, scale);
  }

  protected drawShape(
    graphics: Graphics,
    points: { x: number; y: number }[],
  ): void {
    const pts = (this.points = this.updatePointsRadius(
      points,
      this.defaultRadius * 2,
    ));

    let p1 = pts[pts.length - 1];
    let p2 = pts[0];
    const midpoint = this.getMidpoint(p1, p2);
    graphics.moveTo(midpoint.x, midpoint.y);

    for (let i = 0; i < pts.length; i++) {
      p1 = pts[i];
      p2 = pts[(i + 1) % pts.length];
      const mid = this.getMidpoint(p1, p2);
      graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
    }
    graphics.closePath();
    graphics.fill({ color: this.model.color, alpha: 1 });
  }

  private updatePointsRadius(
    points: { x: number; y: number }[],
    radius: number,
  ): { x: number; y: number }[] {
    return points.map((p, i) => {
      if (i % 2 === 0) return p;
      const length = Math.sqrt(p.x * p.x + p.y * p.y);
      return { x: (p.x / length) * radius, y: (p.y / length) * radius };
    });
  }

  private getMidpoint(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ): { x: number; y: number } {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }
}

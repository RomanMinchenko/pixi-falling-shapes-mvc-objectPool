import { Graphics } from "pixi.js";
import AbstractShape from "./Shape.abstract";
import { getRandomFloat } from "../../utils/random";

export default class Polygon extends AbstractShape {
  protected sidesCount: number = 3;
  protected minAngleStep: number = 0.6;

  public draw(graphics: Graphics): void {
    const points = (this.points = this.getPoints(
      this.defaultRadius,
      this.sidesCount,
    ));

    this.drawShape(graphics, points);

    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    graphics.pivot.set(centerX, centerY);
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

  protected getPoints(
    radius: number,
    count: number,
  ): { x: number; y: number }[] {
    const { minAngleStep } = this;
    const points = [];
    const angleStep = (Math.PI * 2) / count;
    const minAngle = Math.min(angleStep, minAngleStep);
    let prevAngle = 0;

    for (let i = 0; i < count; i++) {
      const maxAngle =
        prevAngle +
        Math.min(
          Math.PI * 2 - prevAngle - minAngle * (count - i),
          angleStep * 2,
        );

      const randomAngle = getRandomFloat(prevAngle, maxAngle);
      const angle = Math.max(minAngle + prevAngle, randomAngle);
      const theta = angle - Math.PI / 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      points.push({ x, y });

      prevAngle = angle;
    }
    return points;
  }

  protected drawShape(
    graphics: Graphics,
    points: { x: number; y: number }[],
  ): void {
    points.forEach((point, index) => {
      if (index === 0) {
        graphics.moveTo(point.x, point.y);
      } else {
        graphics.lineTo(point.x, point.y);
      }
    });

    graphics.lineTo(points[0].x, points[0].y);
    graphics.closePath();
    graphics.fill({ color: this.model.color, alpha: 1 });
  }
}

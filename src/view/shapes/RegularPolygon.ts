import Polygon from "./Polygon";

export default class RegularPolygon extends Polygon {
  protected getPoints(
    radius: number,
    count: number,
  ): { x: number; y: number }[] {
    const points = [];
    const angleStep = (Math.PI * 2) / count;
    let prevAngle = 0;

    for (let i = 0; i < count; i++) {
      const angle = prevAngle + angleStep;
      const theta = angle - Math.PI / 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      points.push({ x, y });

      prevAngle = angle;
    }
    return points;
  }
}

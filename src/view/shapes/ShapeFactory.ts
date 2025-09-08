import ShapeModel from "../../model/ShapeModel";
import AbstractShape from "./Shape.abstract";
import Circle from "./Circle";
import Ellipse from "./Ellipse";
import Triangle from "./Triangle";
import Pentagon from "./Pentagon";
import Hexagon from "./Hexagon";
import Square from "./Square";
import { getRandomInt } from "../../utils/random";
import RegularTriangle from "./RegularTriangle";
import RegularPentagon from "./RegularPentagon";
import RegularHexagon from "./RegularHexagon";
import PolygonArcSides from "./PolygonArcSides";
import Quadrilateral from "./Quadrilateral";

const SHAPE_BY_TYPE: Record<
  string,
  (new (model: ShapeModel) => AbstractShape)[]
> = {
  circle: [Circle],
  ellipse: [Ellipse],
  rectangle: [Quadrilateral, Square],
  triangle: [Triangle, RegularTriangle],
  pentagon: [Pentagon, RegularPentagon],
  hexagon: [Hexagon, RegularHexagon],
  arcShape: [PolygonArcSides],
};

export const createShapeInstance = (
  model: ShapeModel,
  type: keyof typeof SHAPE_BY_TYPE,
): AbstractShape => {
  const ShapeClasses = SHAPE_BY_TYPE[type];
  const randomIndex = getRandomInt(0, ShapeClasses.length - 1);
  return new ShapeClasses[randomIndex](model);
};

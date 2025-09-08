import ShapeModel from "../model/ShapeModel";

export interface ViewEvents {
  areaClick: (x: number, y: number) => void;
  shapeClick: (m: ShapeModel) => void;
  changeSpawnRate: (delta: number) => void;
  changeGravity: (delta: number) => void;
}

export const ViewEvent: { [K in keyof ViewEvents]: K } = {
  areaClick: "areaClick",
  shapeClick: "shapeClick",
  changeSpawnRate: "changeSpawnRate",
  changeGravity: "changeGravity",
};

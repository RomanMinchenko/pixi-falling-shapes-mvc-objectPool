import GameModel from "./model/GameModel";
import ShapeModel from "./model/ShapeModel";
import { ViewEvent } from "./view/events";
import GameView from "./view/GameView";

export default class GameController {
  private uiTimer = 0;
  private lastTime = 0;

  constructor(
    private model: GameModel,
    private view: GameView,
  ) {
    this.listenSignals();
  }

  public update(dt: number, time: number): void {
    this.model.update(dt);

    this.uiTimer += dt * 0.001;
    if (this.uiTimer > 0.1) {
      this.uiTimer = 0;
      this.view.renderHud({
        shapeCount: this.model.getShapesNumber(),
        surfaceArea: this.model.getShapesSurfaceArea(),
        spawnPerSec: this.model.getSpawnPerSec(),
        gravity: this.model.getGravity(),
      });
    }

    if (time - this.lastTime > 1000 / this.model.getSpawnPerSec()) {
      this.lastTime = time;

      this.spawnModel(Math.random() * this.model.gameAreaSize.width, -50);
    }

    const { width, height } = this.model.gameAreaSize;
    const toRemove: ShapeModel[] = [];
    for (const model of this.model.models()) {
      if (
        model.position.x < 0 ||
        model.position.x > width ||
        model.position.y > height
      ) {
        toRemove.push(model);
      }
    }
    toRemove.forEach((model) => this.removeModel(model));

    this.view.syncFromModel(this.model);
  }

  private listenSignals() {
    const { view } = this;
    view.events.on(ViewEvent.areaClick, (x: number, y: number) => {
      this.spawnModel(x, y);
    });

    view.events.on(ViewEvent.shapeClick, (shapeModel: ShapeModel) => {
      this.model.explodeModel(shapeModel);
      this.removeModel(shapeModel);
    });

    view.events.on(ViewEvent.changeGravity, (g: number) => {
      this.model.updateGravity(g);
    });

    view.events.on(ViewEvent.changeSpawnRate, (r: number) => {
      this.model.updateSpawnPerSec(r);
    });
  }

  private spawnModel(x: number, y: number): void {
    const { model } = this;
    const { randomType, surfaceSizeArea, color, rotation, rotationSpeed } =
      model.getRandomShapeData();

    model.spawnShapeModel(
      randomType,
      x,
      y,
      surfaceSizeArea,
      color,
      rotation,
      rotationSpeed,
    );
    model.updateNumberShapes(1);
    model.updateShapesSurfaceArea(surfaceSizeArea);
  }

  private removeModel(shapeModel: ShapeModel): void {
    const { model } = this;

    model.updateNumberShapes(-1);
    model.updateShapesSurfaceArea(-shapeModel.getSurfaceSizeArea());
    model.removeModel(shapeModel);
  }
}

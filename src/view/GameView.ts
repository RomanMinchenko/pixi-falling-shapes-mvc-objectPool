import { FederatedPointerEvent, Graphics, Rectangle } from "pixi.js";
import { EventEmitter } from "eventemitter3";
import App from "../core/App";
import GameModel from "../model/GameModel";
import ShapeView from "./ShapeView";
import ShapePool from "../core/ShapePool";
import ShapeType from "../core/ShapeType.enum";
import ShapeModel from "../model/ShapeModel";
import { ViewEvent, ViewEvents } from "./events";
import HudView from "./HudView";

export default class GameView {
  public events!: EventEmitter<ViewEvents>;

  private shapePool!: ShapePool<ShapeView, ShapeType>;
  private modelToView = new Map<ShapeModel, ShapeView>();
  private hudView!: HudView;

  private shapeIdCounter = 0;

  constructor(
    private app: App,
    private model: GameModel,
  ) {
    this.initEmitter();
    this.initShapePool();

    this.initGameArea();
    this.initHud();
    this.listenAppStageSignals();
  }

  public syncFromModel(gameModel: GameModel) {
    const alive = new Set<ShapeModel>();

    for (const model of gameModel.models()) {
      alive.add(model);
      if (!this.modelToView.has(model)) {
        const view = this.shapePool.get(model.shapeType as ShapeType);
        view.clear();
        view.init(model);
        view.redraw();
        view.off(ViewEvent.shapeClick);
        view.on(ViewEvent.shapeClick, (model: ShapeModel) => {
          this.events.emit(ViewEvent.shapeClick, model);
        });

        this.modelToView.set(model, view);
      }
    }

    for (const [model, view] of this.modelToView) {
      if (!alive.has(model)) {
        view.clear();
        this.shapePool.release(view);
        this.modelToView.delete(model);
      } else {
        view.update();
      }
    }
  }

  public renderHud(data: {
    shapeCount: number;
    surfaceArea: number;
    spawnPerSec: number;
    gravity: number;
  }): void {
    this.hudView.render(data);
  }

  private initEmitter(): void {
    this.events = new EventEmitter<ViewEvents>();
  }

  private initHud(): void {
    const hudView = (this.hudView = new HudView(this.app.getContainer()));

    hudView.events.on(ViewEvent.changeSpawnRate, (delta: number) => {
      this.events.emit(ViewEvent.changeSpawnRate, delta);
    });

    hudView.events.on(ViewEvent.changeGravity, (delta: number) => {
      this.events.emit(ViewEvent.changeGravity, delta);
    });
  }

  private initShapePool(): void {
    this.shapePool = new ShapePool<ShapeView, ShapeType>(() => {
      const shapeView = new ShapeView();
      shapeView.id = this.shapeIdCounter++;
      this.app.getAppStage().addChild(shapeView);

      return shapeView;
    });
  }

  private initGameArea(): void {
    const { app, model } = this;
    const { width, height } = model.gameAreaSize;

    const stage = app.getAppStage();

    const graphics = new Graphics();
    graphics.rect(0, 0, width, height);
    graphics.stroke({ color: 0xf54927, width: 2 });

    stage.addChild(graphics);
  }

  private listenAppStageSignals(): void {
    const { app, model } = this;
    const { width, height } = model.gameAreaSize;
    const stage = app.getAppStage();

    stage.interactive = true;
    stage.hitArea = new Rectangle(0, 0, width, height);

    stage.on("pointerdown", (event: FederatedPointerEvent) => {
      const { x, y } = event.data.global;
      if (x < model.gameAreaSize.width && y < model.gameAreaSize.height) {
        this.events.emit(ViewEvent.areaClick, x, y);
      }
    });
  }
}

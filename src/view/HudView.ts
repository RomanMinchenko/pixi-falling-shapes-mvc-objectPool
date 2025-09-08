import { EventEmitter } from "eventemitter3";
import { ViewEvent, ViewEvents } from "./events";

export default class HudView {
  private root!: HTMLElement;
  private countEl!: HTMLElement;
  private areaEl!: HTMLElement;
  private spawnEl!: HTMLElement;
  private gravEl!: HTMLElement;
  public events!: EventEmitter<ViewEvents>;

  constructor(private container: HTMLElement | null) {
    this.init();
  }

  private init(): void {
    this.initEmitter();
    this.initRoot();
    this.initStats();
    this.initControls();
  }

  public render(data: {
    shapeCount: number;
    surfaceArea: number;
    spawnPerSec: number;
    gravity: number;
  }): void {
    const { countEl, areaEl, spawnEl, gravEl } = this;
    const { shapeCount, surfaceArea, spawnPerSec, gravity } = data;
    countEl.textContent = String(shapeCount);
    areaEl.textContent = String(Math.round(surfaceArea));
    spawnEl.textContent = String(spawnPerSec);
    gravEl.textContent = String(gravity);
  }

  private initEmitter(): void {
    this.events = new EventEmitter();
  }

  private initRoot(): void {
    if (!this.container) return;

    this.root = document.createElement("div");
    this.root.className = "hud";
    this.container.appendChild(this.root);
  }

  private initStats(): void {
    if (!this.root) return;

    const stats = document.createElement("div");
    stats.className = "hud-stats";

    this.countEl = document.createElement("span");
    this.areaEl = document.createElement("span");
    stats.innerHTML = `
      <div>Shapes: <span class="val count"></span></div>
      <div>Area px²: <span class="val area"></span></div>
    `;
    stats.querySelector(".count")!.appendChild(this.countEl);
    stats.querySelector(".area")!.appendChild(this.areaEl);
    this.root.appendChild(stats);
  }

  private initControls(): void {
    if (!this.root) return;

    const ctrls = document.createElement("div");
    ctrls.className = "hud-ctrls";

    const spawn = this.createButtons("Spawn/sec", (d) =>
      this.events.emit(ViewEvent.changeSpawnRate, d),
    );
    const grav = this.createButtons("Gravity", (d) =>
      this.events.emit(ViewEvent.changeGravity, d),
    );
    this.spawnEl = spawn.val;
    this.gravEl = grav.val;
    ctrls.append(spawn.wrap, grav.wrap);
    this.root.appendChild(ctrls);
  }

  private createButtons(
    label: string,
    onDelta: (d: number) => void,
  ): { wrap: HTMLElement; val: HTMLElement } {
    const wrap = document.createElement("div");
    const minus = document.createElement("button");
    const plus = document.createElement("button");
    [minus, plus].forEach((el) => (el.className = "stepper__btn"));
    const val = document.createElement("span");
    val.className = "stepper__val";
    minus.textContent = "–";
    plus.textContent = "+";
    wrap.append(label + ": ", minus, val, plus);
    minus.onclick = () => onDelta(-1);
    plus.onclick = () => onDelta(+1);
    return { wrap, val };
  }
}

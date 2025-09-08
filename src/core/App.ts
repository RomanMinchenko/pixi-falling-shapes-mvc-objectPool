import { Application, Ticker } from "pixi.js";

export default class App {
  public app!: Application;
  private container!: HTMLElement | null;

  public onAppInit?: () => void;

  constructor(containerName: string, size: { width: number; height: number }) {
    this.container = document.getElementById(containerName);

    this.initApplication(containerName, size);
  }

  public getAppStage() {
    return this.app.stage;
  }

  public getContainer() {
    return this.container;
  }

  public start(): void {
    this.app.start();
  }

  public stop(): void {
    this.app.stop();
  }

  public tickerAdd(fn: (ticker: Ticker) => void): void {
    this.app.ticker.add(fn);
  }

  private async initApplication(
    containerName: string,
    size: { width: number; height: number },
  ) {
    const app = (this.app = new Application());
    await app.init({
      width: size.width || 800,
      height: size.height || 600,
      preference: "webgl",
    });

    if (!this.container) {
      throw new Error(`Container with id "${containerName}" not found.`);
    }

    this.container.appendChild(app.canvas);
    this.onAppInit?.();
  }
}

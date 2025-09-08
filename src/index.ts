import App from "./core/App";
import GameController from "./GameController";
import GameModel from "./model/GameModel";
import GameView from "./view/GameView";
import Stats from "stats.js";

declare global {
  interface Window {
    Stats: typeof Stats;
  }
}

(async () => {
  const app = new App("pixi-container", { width: 800, height: 600 });
  app.onAppInit = () => {
    const model = new GameModel();
    const view = new GameView(app, model);
    const controller = new GameController(model, view);

    const stats = new Stats();
    const container = app.getContainer();
    if (container) {
      stats.showPanel(0);
      stats.dom.style.position = "absolute";
      stats.dom.style.top = "0px";
      stats.dom.style.left = "auto";
      stats.dom.style.right = "0px";
      container.appendChild(stats.dom);
    }
    app.tickerAdd(() => {
      stats.update();
    });

    app.tickerAdd((ticker) => {
      controller.update(ticker.deltaMS, ticker.lastTime);
    });
  };
})();

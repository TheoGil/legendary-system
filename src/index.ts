import "./style.css";

class App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  previousTime = 0;
  delta = 0;
  fixedAcculumator = 0;
  fixedInterval = 1 / 60;
  backgroundFill = "#3f72af";
  player: Player;

  constructor() {
    this.onUpdate = this.onUpdate.bind(this);
    this.onFixedUpdate = this.onFixedUpdate.bind(this);

    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.player = new Player(this.ctx);

    this.onUpdate();
  }

  onUpdate(now = performance.now()) {
    this.delta = (now - this.previousTime) / 1000;

    this.previousTime = now;

    this.fixedAcculumator += this.delta;

    while (this.fixedAcculumator >= this.fixedInterval) {
      this.onFixedUpdate();

      this.fixedAcculumator -= this.fixedInterval;
    }

    window.requestAnimationFrame(this.onUpdate);
  }

  onFixedUpdate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.backgroundFill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.update();
    this.player.render();
  }
}

class Player {
  ctx: CanvasRenderingContext2D;
  width = 20;
  height = 40;
  fillColor = "#F9F7F7";
  angle = 0;
  rotationSpeed = 0.05;
  x = window.innerWidth / 2;
  y = window.innerHeight / 2;
  keys = {
    left: false,
    right: false,
  };
  velocityX = 0;
  velocityY = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.ctx = ctx;

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "ArrowRight":
        this.keys.right = true;
        break;
      default:
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "ArrowRight":
        this.keys.right = false;
        break;
      default:
        break;
    }
  }

  update() {
    if (this.keys.left) {
      this.angle -= this.rotationSpeed;
    }

    if (this.keys.right) {
      this.angle += this.rotationSpeed;
    }
  }

  render() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();

    this.ctx.save();

    const halfPI = Math.PI / 2;

    // Computation repeats for every Nth angle, we can use modulo.
    // Now our angle always ranges from 0 to Math.PI / 2 (quarter of a circle).
    const fract = Math.abs(this.angle) % halfPI;

    const normalize = fract / halfPI;

    // Remap the range [0, 0.5, 1] to [0, 1, 0]
    const speed = 1 - Math.abs((normalize - 0.5) * 2);

    console.log(speed);

    const offset = 0;
    this.velocityX = -Math.sin(this.angle + offset) * speed;
    this.velocityY = Math.cos(this.angle + offset) * speed;

    this.x += -this.velocityX;
    this.y += -this.velocityY;
  }
}

new App();

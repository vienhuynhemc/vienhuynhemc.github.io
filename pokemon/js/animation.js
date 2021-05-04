import * as configuration from "./configuration.js";

export class Animation {

    x;
    y;
    w;
    h;
    c;
    r;
    W;
    H;
    img;
    currentImage;
    lastTimeUpdate;
    isComplete;
    waitTimes;
    sx;
    sy;

    constructor(x, y, w, h, W, H, r, c, img, time, sx, sy) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.W = W;
        this.H = H;
        this.w = w;
        this.h = h;
        this.r = r;
        this.c = c;
        this.sx = sx;
        this.sy = sy;
        this.currentImage = 0;
        this.lastTimeUpdate = 0;
        this.isComplete = false;
        this.waitTimes = [];
        for (let i = 0; i < r * c; i++) {
            this.waitTimes.push(time);
        }
    }

    update(currentTime) {
        if (!this.isComplete) {
            if (this.lastTimeUpdate == 0) {
                this.lastTimeUpdate = currentTime;
            }
            if (this.currentImage < this.waitTimes.length) {
                if (currentTime - this.lastTimeUpdate > this.waitTimes[this.currentImage]) {
                    this.lastTimeUpdate = currentTime;
                    this.currentImage++;
                }
            } else {
                if (currentTime - this.lastTimeUpdate > this.waitTimes[0]) {
                    this.isComplete = true;
                }
            }
            // Xử lý việc di chuyển
            if (this.sx != undefined) {
                this.x += this.sx;
                this.y += this.sy;
                if (this.x > configuration.MAIN_WIDTH) {
                    this.isComplete = true;
                }
                if (this.x + this.w < 0) {
                    this.isComplete = true;
                }
                if (this.y + this.h < 0) {
                    this.isComplete = true;
                }
                if (this.y > configuration.MAIN_HEIGHT) {
                    this.isComplete = true;
                }
            }
        }
    }

    draw(paint_main_canvas) {
        let row = parseInt(this.currentImage / this.c);
        let col = parseInt(this.currentImage % this.c);
        let width = parseInt(this.W / this.c);
        let height = parseInt(this.H / this.r);
        paint_main_canvas.drawImage(this.img,
            col * width, row * height,
            width, height,
            this.x, this.y,
            this.w, this.h);
    }
}
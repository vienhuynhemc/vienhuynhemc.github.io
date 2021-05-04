import * as configuration from "./configuration.js";
import * as imageManager from "./image_manager.js";
import * as algorithm from "./algorithm.js";

export class AnimationScale {

    isComplete;
    x1;
    y1;
    x2;
    y2;
    timeX;
    timeY;
    xCenter;
    yCenter;
    isOke;
    isMove;
    value;
    w;
    h;
    a;
    count;
    lastTimeUpdate;

    constructor(move1, move2, value) {
        this.x1 = (move1.x - 1) * configuration.box_width + configuration.xStartDraw;
        this.y1 = (move1.y - 1) * configuration.box_height + configuration.yStartDraw;
        this.x2 = (move2.x - 1) * configuration.box_width + configuration.xStartDraw;
        this.y2 = (move2.y - 1) * configuration.box_height + configuration.yStartDraw;
        this.xCenter = Math.abs(this.x1 - this.x2) / 2 + Math.min(this.x1, this.x2);
        this.yCenter = Math.abs(this.y1 - this.y2) / 2 + Math.min(this.y1, this.y2);;
        this.timeX = parseInt(this.xCenter / 25);
        this.timeY = parseInt(this.xCenter / 25);
        if (this.timeX == 0) {
            this.timeX = 1;
        }
        if (this.timeY == 0) {
            this.timeY == 1;
        }
        this.value = value;
        this.lastTimeUpdate = 0;
        this.isComplete = false;
        this.isOke = false;
        this.isMove = false;
        this.w = configuration.box_width;
        this.h = configuration.box_height;
        this.count = 0;
        this.a = 1;
    }

    update(currentTime) {
        if (!this.isComplete) {
            if (this.lastTimeUpdate == 0) {
                this.lastTimeUpdate = currentTime;
            }
            if (!this.isOke) {
                if (currentTime - this.lastTimeUpdate > 100) {
                    this.lastTimeUpdate = currentTime;
                    this.isOke = true;
                }
            } else if (!this.isMove) {
                if (this.x1 != this.xCenter || this.x2 != this.xCenter || this.y1 != this.yCenter || this.y2 != this.yCenter) {
                    if (currentTime - this.lastTimeUpdate > 10) {
                        this.lastTimeUpdate = currentTime;
                        if (this.x1 > this.xCenter) {
                            this.x1 -= this.x1 - this.timeX >= this.xCenter ? this.timeX : this.x1 - this.xCenter;
                        } else {
                            this.x1 += this.x1 + this.timeX <= this.xCenter ? this.timeX : this.xCenter - this.x1;
                        }
                        if (this.x2 > this.xCenter) {
                            this.x2 -= this.x2 - this.timeX >= this.xCenter ? this.timeX : this.x2 - this.xCenter;
                        } else {
                            this.x2 += this.x2 + this.timeX <= this.xCenter ? this.timeX : this.xCenter - this.x2;
                        }
                        if (this.y1 > this.yCenter) {
                            this.y1 -= this.y1 - this.timeY >= this.yCenter ? this.timeY : this.y1 - this.yCenter;
                        } else {
                            this.y1 += this.y1 + this.timeY <= this.yCenter ? this.timeY : this.yCenter - this.y1;
                        }
                        if (this.y2 > this.yCenter) {
                            this.y2 -= this.y2 - this.timeY >= this.yCenter ? this.timeY : this.y2 - this.yCenter;
                        } else {
                            this.y2 += this.y2 + this.timeY <= this.yCenter ? this.timeY : this.yCenter - this.y2;
                        }
                    }
                } else {
                    this.isMove = true;
                }
            } else {
                if (this.count < 38) {
                    if (currentTime - this.lastTimeUpdate > 10) {
                        this.lastTimeUpdate = currentTime;
                        this.count++;
                        this.x1--;
                        this.y1--;
                        this.w += 2;
                        this.h += 2;
                        this.a -= 0.025;
                    }
                } else {
                    this.isComplete = true;
                }
            }
        }
    }

    draw(paint_main_canvas) {
        if (this.isOke) {
            let imageBackground = imageManager.images[0];
            paint_main_canvas.lineWidth = "3";
            paint_main_canvas.strokeStyle = "rgb(0,254,0)"
            let indexImageSelect = this.value;
            let imageSelect = imageManager.images[indexImageSelect];
            if (this.isMove) {
                paint_main_canvas.globalAlpha = this.a;
            }
            paint_main_canvas.drawImage(imageBackground, this.x1, this.y1, this.w, this.h);
            paint_main_canvas.drawImage(imageSelect, this.x1, this.y1, this.w, this.h);
            if (this.isMove) {
                paint_main_canvas.globalAlpha = 1;
            }
            if (!this.isMove) {
                paint_main_canvas.drawImage(imageBackground, this.x2, this.y2, configuration.box_width, configuration.box_height);
                paint_main_canvas.drawImage(imageSelect, this.x2, this.y2, this.w, this.h);
                algorithm.roundRect(paint_main_canvas, this.x1, this.y1, configuration.box_width - 2, configuration.box_height - 3, 0);
                algorithm.roundRect(paint_main_canvas, this.x2, this.y2, configuration.box_width - 2, configuration.box_height - 3, 0);
            }
        }
    }

}
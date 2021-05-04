import * as configuration from "./configuration.js";
import * as imageManager from "./image_manager.js";
import * as animationClass from "./animation.js";

export class AnimationIntroLevel {

    x;
    y;
    w;
    h;
    lastTimeUpdate;
    isComplete;
    text;
    maxXText;
    nowXText;
    isCompleteRun;
    isCompleteShow;
    isCompleteAnim;
    opacity;
    opacityText;
    animation;

    constructor(text) {
        this.isComplete = false
        this.isCompleteRun = false;
        this.isCompleteShow = false;
        this.isCompleteAnim = false;
        this.text = text;
        this.x = 0;
        this.y = 100;
        this.w = configuration.MAIN_WIDTH;
        this.h = 100;
        this.maxXText = 420;
        this.nowXText = -160;
        this.lastTimeUpdate = 0;
        this.opacity = 1;
        this.opacityText = 1;
    }

    update(currentTime) {
        if (!this.isComplete) {
            if (!this.isCompleteRun) {
                if (this.lastTimeUpdate == 0) {
                    this.lastTimeUpdate = currentTime;
                }
                if (currentTime - this.lastTimeUpdate > 5) {
                    this.lastTimeUpdate = currentTime;
                    if (this.nowXText < this.maxXText) {
                        this.nowXText += 24;
                    } else {
                        this.isCompleteRun = true;
                    }
                }
            } else if (!this.isCompleteShow) {
                if (currentTime - this.lastTimeUpdate > 1000) {
                    this.lastTimeUpdate = currentTime;
                    this.isCompleteShow = true;
                    this.animation = new animationClass.Animation(this.nowXText - 70, this.y - 100,
                        250, 250,
                        959, 926, 5, 5, imageManager.animationHideLevel, 50);
                    this.opacityText = 0;
                }
            } else if (!this.isCompleteAnim) {
                this.animation.update(currentTime);
                if (currentTime - this.lastTimeUpdate > 200) {
                    this.isCompleteAnim = true;
                    this.lastTimeUpdate = currentTime;
                }
            }
            else {
                this.animation.update(currentTime);
                if (currentTime - this.lastTimeUpdate > 50) {
                    this.lastTimeUpdate = currentTime;
                    if (this.opacity > 0) {
                        this.opacity -= 0.05;
                    } else {
                        this.isComplete = true;
                        this.isCompleteRun = false;
                        this.isCompleteShow = false;
                        this.isCompleteAnim = false;
                        this.nowXText = -160;
                        this.opacity = 1;
                        this.opacityText = 1;
                    }
                }
            }
        }
    }

    draw(paint_main_canvas) {
        paint_main_canvas.fillStyle = `rgba(48,51,46,${this.opacity})`;
        paint_main_canvas.fillRect(this.x, this.y, this.w, this.h);
        paint_main_canvas.fillStyle = `rgba(255,255,255,${this.opacityText})`;
        paint_main_canvas.font = "bold 36px monospace";
        paint_main_canvas.fillText(this.text, this.nowXText, this.y + 65);
        if (this.isCompleteShow) {
            this.animation.draw(paint_main_canvas);
        }
    }

}
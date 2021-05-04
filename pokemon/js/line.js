import * as configuration from "./configuration.js";
import * as imageManager from "./image_manager.js";

export class Line {

    // Danh sách các move
    moves;
    lastTimeUpdate;
    isComplete;

    constructor(moves) {
        this.moves = moves;
        this.lastTimeUpdate = 0;
        this.isComplete = false;
    }

    update(currentTime) {
        if (this.lastTimeUpdate == 0) {
            this.lastTimeUpdate = currentTime;
        }
        if (!this.isComplete) {
            if (currentTime - this.lastTimeUpdate > 150) {
                this.isComplete = true;
            }
        }
    }

    draw(paint_main_canvas) {
        for (let i = 0; i < this.moves.length - 1; i++) {
            // Tạo độ đầu đuôi
            let x1 = configuration.xStartDraw + (this.moves[i].x - 1) * configuration.box_width;
            let x2 = configuration.xStartDraw + (this.moves[i + 1].x - 1) * configuration.box_width;
            let y1 = configuration.yStartDraw + (this.moves[i].y - 1) * configuration.box_height;
            let y2 = configuration.yStartDraw + (this.moves[i + 1].y - 1) * configuration.box_height;
            // Xem hướng
            if (x1 == x2) {
                // Dọc
                let img = imageManager.images[39];
                let start = y1;
                let end = y2;
                if (y1 > y2) {
                    start = y2;
                    end = y1;
                }
                let space = end - start;
                let startX = x1 + 20;
                let startY = start + 34;
                while (space > 0) {
                    let length = space - 105 >= 0 ? 105 : space;

                    paint_main_canvas.drawImage(img,
                        0, 0,
                        30, length,
                        startX, startY,
                        30, length);
                    startY = space - 105 > 0 ? startY + 105 : startY + space;
                    space = space - 105 >= 0 ? space - 105 : 0;
                }
            } else {
                // Ngang
                let img = imageManager.images[38];
                let start = x1;
                let end = x2;
                if (x1 > x2) {
                    start = x2;
                    end = x1;
                }
                let space = end - start;
                let startX = start + 22;
                let startY = y1 + 29;
                while (space > 0) {
                    let length = space - 105 >= 0 ? 105 : space;
                    paint_main_canvas.drawImage(img,
                        0, 0,
                        length, 30,
                        startX, startY,
                        length, 30);
                    startX = space - 105 > 0 ? startX + 105 : startX + space;
                    space = space - 105 >= 0 ? space - 105 : 0;
                }
            }
        }
    }
}
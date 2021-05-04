export class BackgroundMap {

    // Mảng các background
    arrayImage;

    constructor() {
    }

    init() {
        this.arrayImage = [];
        // ở đây ta có 14 level nên ta sẽ có 14 thẻ img
        for (let i = 1; i <= 15; i++) {
            let img = document.createElement("img");
            if (i > 8 && i < 12) {
                img.src = `img/b${i}.png`;
            } else {
                img.src = `img/b${i}.jpg`;
            }
            this.arrayImage[i - 1] = img;
        }
    }

    draw(x, y, width, height, level, paint_main_canvas) {
        paint_main_canvas.drawImage(this.arrayImage[level - 1], x, y, width, height);
    }

}
export class Music {

    // Element audio trong html
    sound;
    // Địa chỉ của sound
    src
    // Biến để biến trạng thái có bị stop   
    isStop;

    constructor(source) {
        // Tạo audio
        this.sound = document.createElement("audio");
        this.sound.src = source;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        // Lưu vết nguồn
        this.src = source;
    }

    loop() {
        this.sound.setAttribute("loop", true);
    }

    play() {
        if (this.isStop) {
            this.isStop = false;
            this.sound.src = this.src;
        }
        this.sound.play();
    }

    stop() {
        this.sound.src = "";
        this.isStop = true;
    }

    pause() {
        this.sound.pause();
    }

}
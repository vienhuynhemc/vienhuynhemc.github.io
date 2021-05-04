import * as musicManager from "./music_manager.js";
import * as configuration from "./configuration.js";

export class ProgressBar {

    // Đối tượng lottie 
    // Có frame khi đầy là 420, khi zero là 18
    lottie;
    // Thời gian bắt đầu cập nhật
    // Ta cho nó = 0
    // Khi từ start world chuyển qua thì xử lý cho nó thời gian bắt đầu chuyển qua
    // Thời hạn một cây là 404s
    // 16-420 là 405 frame => 1 frame tương đương 1s 
    lastTimeUpdate;
    nowFrame;
    // Biến để xem thử có hết thời gian hay chưa
    isComplete;

    constructor() {
    }

    init() {
        // container
        let lottie_container = document.getElementById("time");
        // Khởi tạo lottie
        this.lottie = bodymovin.loadAnimation({
            container: lottie_container, // the dom element that will contain the animation
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'json/progressBar.json' // the path to the animation json
        });
        // Fill đầy
        this.nowFrame = 420;
        this.lottie.goToAndStop(this.nowFrame, true);
        // Cho lastTime update = 0
        this.lastTimeUpdate = 0;
    }

    update(currentTime) {
        // Check lúc ban đầu cập nhật
        if (this.lastTimeUpdate == 0) {
            this.lastTimeUpdate = currentTime;
        }
        if (!this.isComplete) {
            // Nếu như >16 frame thì cứ 1s giảm 1 frame
            if (this.nowFrame > 16) {
                if (currentTime - this.lastTimeUpdate > 1000) {
                    this.lastTimeUpdate = currentTime;
                    this.nowFrame--;
                    this.lottie.goToAndStop(this.nowFrame, true);
                    // Cảnh báo khi còn 60s
                    if (this.nowFrame == 76) {
                        if (configuration.isPlayMusic) {
                            musicManager.pika2.play();
                        }
                    }
                }
            } else {
                this.isComplete = true;
            }
        }
    }

    isOverTime() {
        return this.isComplete;
    }

}
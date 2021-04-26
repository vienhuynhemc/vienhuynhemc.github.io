// Import ----------------
import * as configuration from "./configuration.js";
import * as musicManager from "./music_manager.js"
//------------------------

// Các thuộc tính ----------
// Button mute
let lottie_4;
//--------------------------

// Chạy game ---------------
// Chạy khởi tạo
init();
//--------------------------

// Phương thức --------------------------
// Hàm khởi tạo
function init() {
    let lottie_4_container = document.getElementById("lottie_4");
    // Khởi tạo lottie_4
    lottie_4 = bodymovin.loadAnimation({
        container: lottie_4_container, // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'json/buttonMute.json' // the path to the animation json
    });
    // Gán action cho button mute
    lottie_4_container.onclick = function () { openCloseMusic() };
    // Cho nó ở trạng thái dựa theo file configuraion
    if (configuration.isPlayMusic) {
        lottie_4.goToAndStop(40, true);
    } else {
        lottie_4.goToAndStop(0, true);
    }
    // Gán action cho button goto
    let waitScreen_button_goto = document.getElementById("waitScreen_button_goto");
    waitScreen_button_goto.onclick = function () { goToStartWorld() };
    // Gán action cho button từ startGame -> playgame
    let lottie_2_name = document.getElementById("lottie_2_name");
    lottie_2_name.onclick = function () { startGame() };
    let lottie_2 = document.getElementById("lottie_2");
    lottie_2.onclick = function () { startGame() };
}

// Phương thức bậc tắt nhạc
export function openCloseMusic() {
    if (configuration.isPlayMusic) {
        configuration.stopMusic();
        lottie_4.playSegments([40, 100], true);
        // Dừng nhạc nền
        musicManager.backgroundMusic.pause();
    } else {
        lottie_4.playSegments([0, 40], true);
        configuration.playMusic();
        // Chạy nhạc nền
        musicManager.backgroundMusic.play();
    }
}

// Phương thức từ màn hình chờ -> Màn hình vào game 
export function goToStartWorld() {
    if (configuration.isPlayMusic) {
        musicManager.cursor.play();
    }
    // Cho màn hình chờ chạy animation
    let waitScreen_white = document.getElementById("waitScreen_white");
    waitScreen_white.style.animationName = "waitScreen_white";
    // Đợi 3  giây rồi chuyển vào màn hình game
    setTimeout(function () {
        document.getElementById("waitScreen").style.display = "none";
        document.getElementById("startScreen").style.display = "block";
        // Chạy nhạc nền
        musicManager.backgroundMusic.play();
    }, 3000);
    // reset animation
    setTimeout(function () {
        waitScreen_white.style.animationName = "";
    }, 6000);
}

// Phương thức từ màn hình startGame -> play game
export function startGame() {
    if (configuration.isPlayMusic) {
        musicManager.cursor.play();
    }
    // Cho màn hình chờ chạy animation
    let waitScreen_white = document.getElementById("waitScreen_white");
    waitScreen_white.style.animationName = "waitScreen_white";
    // Đợi 3  giây rồi chuyển vào màn hình play game
    setTimeout(function () {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("screenPlayGame").style.display = "block";
    }, 3000);
    // reset animation
    setTimeout(function () {
        waitScreen_white.style.animationName = "";
    }, 6000);
}
//---------------------------------------
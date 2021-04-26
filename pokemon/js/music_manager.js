import * as music from "./music.js"

// Các thuộc tính ----------
// Nhạc nền
export let backgroundMusic;
// Các nhạc effects
export let cursor;
//--------------------------

// Chạy game ---------------
// Chạy khởi tạo
init();
//--------------------------

// Phương thức --------------------------
// Phương thức khởi tạo
function init() {
    // Tạo nhạc nền
    backgroundMusic = new music.Music("music/backgroundMusic.mp3");
    backgroundMusic.loop();
    // Tạo các nhạc hiệu ứng
    cursor = new music.Music("music/cursor.mp3");
}
//---------------------------------------
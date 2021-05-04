import * as music from "./music.js"

// Các thuộc tính ----------
// Nhạc nền
export let backgroundMusic;
// Các nhạc effects
export let cursor;
export let no;
export let pika2;
export let eat;
export let smooth;
export let refresh;
export let lost;
export let nextLevel;
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
    no = new music.Music("music/no.mp3");
    pika2 = new music.Music("music/pika2.mp3");
    eat = new music.Music("music/eat.wav");
    smooth = new music.Music("music/smooth.mp3");
    nextLevel = new music.Music("music/nextLevel.mp3");
    lost = new music.Music("music/lostGame.mp3");
    refresh = new music.Music("music/refresh.mp3");
}
//---------------------------------------
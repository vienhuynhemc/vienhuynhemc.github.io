// Số khung hình trên giây
export let FPS = 160;

// Kích thước của màn hình game
export let MAIN_WIDTH = "1000";
export let MAIN_HEIGHT = "610";

// Tình trạng phát nhạc
export let isPlayMusic = true;
export function playMusic() {
    isPlayMusic = true;
}
export function stopMusic() {
    isPlayMusic = false;
}

// Tình trạng chạy của game
export let isStartGame = true;
export function pauseGame() {
    isStartGame = false;
}
export function startGame() {
    isStartGame = true;
}

// Vị trí bắt đầu vẽ các box pokemon
export let xStartDraw = 100;
export let yStartDraw = 90;

// Kích thước các box pokemon 
export let box_width = 47;
export let box_height = 60;

// Kích thước của animationHide
export let animationHide_width = 94;
export let animationHide_height = 106;




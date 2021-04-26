// Import ----------------
import * as configuration from "./configuration.js";
//------------------------

// Các thuộc tính ----------
// 1. Thời gian cuối cùng update
let lastTimeUpdate;
// 2. Canvas vẽ chính
let main_canvas;
let paint_main_canvas;
// --> Thời gian của một khung hình
let timeForOneFrame;
//--------------------------

// Chạy game ---------------
// Chạy khởi tạo game
init();
// Chạy luồng game
window.requestAnimationFrame(main);
//--------------------------

// Phương thức --------------------------
// Hàm khởi tạo
function init() {
    // Cho thời gian bắt đầu là 0
    lastTimeUpdate = 0;
    // FPS ở đây chuyển mili -> nano để có độ chính xác cao nhất
    timeForOneFrame = 1000000000 / configuration.FPS;
    // Lấy canvas chính và thiết lập chiều rộng chiều cao
    main_canvas = document.getElementById("main_canvas");
    main_canvas.width = configuration.MAIN_WIDTH;
    main_canvas.height = configuration.MAIN_HEIGHT;
    paint_main_canvas = main_canvas.getContext("2d");
}

// Hàm chính của luồng
function main(currentTime) {
    // Đệ quy lặp lại để tạo thành luồng
    window.requestAnimationFrame(main);
    // Tính thời gian cập nhật
    // 1. Tính thời gian đã trôi qua
    let timePast = currentTime - lastTimeUpdate;
    // 2. Chuyển thời gian trôi qua thành nano time
    timePast *= 1000000;
    // 3. Nếu thời gian đã trôi qua lớn hơn thời gian một khung hình thì cập nhật không thì thôi
    if (timePast > timeForOneFrame) {
        // Cho thời gian cuối cập nhật là thời gian hiện tại
        lastTimeUpdate = currentTime;
        // Cập nhật
        update(currentTime);
        // Vẽ
        draw(paint_main_canvas);
    }
}

// Hàm cập nhật
function update(currentTime) {
}

// Hàm vẽ
function draw(/** @type {CanvasRenderingContext2D} */ paint_main_canvas) {
    // Xóa vũ vẽ mới
    paint_main_canvas.clearRect(0, 0, configuration.MAIN_WIDTH, configuration.MAIN_HEIGHT)
    // Vẽ
    paint_main_canvas.fillStyle = "black";
    paint_main_canvas.fillRect(0, 0, configuration.MAIN_WIDTH, configuration.MAIN_HEIGHT);
}
//---------------------------------------
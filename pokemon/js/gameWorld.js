// Import ----------------
import * as configuration from "./configuration.js";
import * as progressBarClass from "./progressbar.js";
import * as backgroundMapClass from "./backgroundMap.js";
import * as musicManager from "./music_manager.js"
import * as scoreClass from "./score.js";
import * as imageManager from "./image_manager.js";
import * as algorithm from "./algorithm.js";
import * as moveClass from "./move.js";
import * as animationClass from "./animation.js";
import * as animationIntroLevelClass from "./animationIntroLevel.js";
import * as nextLevelClass from "./nextLevel.js";
import * as animationScaleClass from "./animationScale.js";
//------------------------

// Các thuộc tính ----------
// 1. Thời gian cuối cùng update
let lastTimeUpdate;
// 2. Canvas vẽ chính
let main_canvas;
let paint_main_canvas;
// 3. Progress bar đếm thời gian
let progressBar;
// 4. Đối tượng vẽ background map
let backgroundMap;
// 5. Cấp độ
let level;
// 6. Button pause - play
let buttonPausePlay;
let buttonPausePlayLottie;
// 7. Button tắt/ bật âm thanh
let buttonOffOnMusic;
let buttonOffOnMusicLottie;
// 8. Button Refresh
let buttonRefresh;
let countRefresh;
// 9. Button Tìm kiếm
let buttonFind;
let countFind;
// 10. Điểm
let scoreObject;
// 11. Mảng để lưu các pokemon
let arrayPokemon;
// 12. Vị trí ô hover
let moveHover;
// 13. Vị trí ô đang được chọn
let moveSelect;
let valueMoveSelect;
let moveSelect2;
// 14. Danh sách các line
let listLine;
// 15. List animation
let animations;
// 16. Introduc level
let animationIntroLevel;
// 17. Tạo snow
let lastTimeCreateSnow;
// 18. Biến kiểm tra có show dialog hay chưa
let isShowDialog;
// 19. Object show lên mỗi lần hoàn thành một màn
let nextLevel;
// 20. List animamtion scale
let animationScales;
// --> Thời gian của một khung hình
let timeForOneFrame;
//--------------------------

// Chạy game ---------------
// Chạy khởi tạo game
init();
//--------------------------

// Phương thức --------------------------
// Hàm chạy luồng game
export function run() {
    if (configuration.isPlayMusic) {
        buttonOffOnMusicLottie.goToAndStop(40, true);
    } else {
        buttonOffOnMusicLottie.goToAndStop(0, true);
    }
    window.requestAnimationFrame(main);
}

// Hàm khởi tạo
function init() {
    // Cho thời gian bắt đầu là 0
    lastTimeUpdate = 0;
    lastTimeCreateSnow = 0;
    isShowDialog = false;
    // FPS ở đây chuyển mili -> nano để có độ chính xác cao nhất
    timeForOneFrame = 1000000000 / configuration.FPS;
    // Lấy canvas chính và thiết lập chiều rộng chiều cao
    main_canvas = document.getElementById("main_canvas");
    main_canvas.width = configuration.MAIN_WIDTH;
    main_canvas.height = configuration.MAIN_HEIGHT;
    paint_main_canvas = main_canvas.getContext("2d");
    // Tạo progressbar thời gian
    progressBar = new progressBarClass.ProgressBar();
    progressBar.init();
    // Tạo backgroundMap
    backgroundMap = new backgroundMapClass.BackgroundMap();
    backgroundMap.init();
    // Tạo cấp độ
    level = 1;
    document.getElementById("level").innerText = "CẤP ĐỘ " + level;
    // Tạo điểm
    scoreObject = new scoreClass.Score(0);
    // Thiết lập số lần tìm kiếm
    countFind = 15;
    document.getElementById("countFind").innerText = countFind;
    // Thiết lập số lần refresh
    countRefresh = 10;
    document.getElementById("countRefresh").innerText = countRefresh;
    // Thiết lập button tìm kiếm
    buttonFind = document.getElementById("find");
    buttonFind.onclick = function () { find() };
    // Thiết lập button refresh
    buttonRefresh = document.getElementById("refresh");
    buttonRefresh.onclick = function () { refresh() };
    // Thiết lập button bật tắt âm thanh
    buttonOffOnMusic = document.getElementById("mute");
    buttonOffOnMusicLottie = bodymovin.loadAnimation({
        container: buttonOffOnMusic.children[0], // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'json/buttonMute.json' // the path to the animation json
    });
    if (configuration.isPlayMusic) {
        buttonOffOnMusicLottie.goToAndStop(40, true);
    } else {
        buttonOffOnMusicLottie.goToAndStop(0, true);
    }
    buttonOffOnMusic.onclick = function () { algorithm.pauseStartMusic(buttonOffOnMusicLottie) };
    // Thiết lập button dừng và chạy
    buttonPausePlay = document.getElementById("pause");
    buttonPausePlay.onclick = function () { algorithm.pauseStartGame(buttonPausePlayLottie) };
    buttonPausePlayLottie = bodymovin.loadAnimation({
        container: buttonPausePlay.children[0], // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'json/startAndPause.json' // the path to the animation json
    });
    if (configuration.isStartGame) {
        buttonPausePlayLottie.goToAndStop(0, true);
    } else {
        buttonPausePlayLottie.goToAndStop(30, true);
    }
    // Thiết lập thao tác chuột cho canvas
    document.getElementById("screenPlayGame").addEventListener("mouseup", function () { handleClickOnCanvas(event) });
    document.getElementById("screenPlayGame").addEventListener("mousemove", function () { handleMoveOnCanvas(event) });
    // Tạo mảng các pokemon
    arrayPokemon = algorithm.createArrayPokemon();
    // Tạo vị trí hover mặc định là -1, -1;
    moveHover = new moveClass.Move(-1, -1);
    // Tạo vị trí chọn là chưa chọn, mặc định là -1,-1;
    moveSelect = new moveClass.Move(-1, -1);
    moveSelect2 = new moveClass.Move(-1, -1);
    valueMoveSelect = -1;
    // Tạo danh sách các dường khi ăn 1 cặp
    listLine = [];
    // Tạo danh sách animation
    animations = [];
    // Tạo introductLevel
    animationIntroLevel = new animationIntroLevelClass.AnimationIntroLevel("CẤP ĐỘ " + level);
    // Tạo next Level
    nextLevel = new nextLevelClass.NextLevel();
    // Tạo ăn gian next level  :v
    document.getElementById("levelIcon").onclick = function () {
        configuration.pauseGame();
        nextLevel.reset(level, arrayPokemon, algorithm, countFind, countRefresh,
            musicManager, progressBar, animationIntroLevel, scoreObject, countFind, countRefresh, scoreObject.score, progressBar.nowFrame - 16);
    }
    // Tạo list animation scale
    animationScales = [];
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
        if (configuration.isStartGame) {
            // Cập nhật
            update(currentTime);
            // Vẽ
            draw(paint_main_canvas);
        }
        // Vì next level là riêng biệt nên thôi cho update draw riêng biệt luôn
        nextLevel.update(currentTime);
    }
}

// Hàm cập nhật
function update(currentTime) {
    // Update progress bar và kiểm tra hết thời gian
    progressBar.update(currentTime);
    if (progressBar.isOverTime() && !isShowDialog) {
        musicManager.lost.play();
        isShowDialog = true;
        let loseGame = document.getElementById("loseGame");
        let loseGameH3 = document.getElementById("loseGameH3");
        let loseGameP = document.getElementById("loseGameP");
        let loseGameButton = document.getElementById("loseGameButton");
        loseGame.style.display = "flex";
        loseGameButton.style.animationName = "move_top";
        loseGameH3.style.animationName = "move_right";
        loseGameP.style.animationName = "move_right";
        loseGameP.innerText = "Vì bạn đã hết giờ";
        // action cho button lostGame
        loseGameButton.onclick = function () {
            loseGame.style.display = "none";
            loseGameButton.style.animationName = "";
            loseGameH3.style.animationName = "";
            loseGameP.style.animationName = "";
            level = 1;
            document.getElementById("level").innerText = "CẤP ĐỘ " + level;
            arrayPokemon = algorithm.createArrayPokemon();
            countFind = 15;
            document.getElementById("countFind").innerText = countFind;
            countRefresh = 10;
            document.getElementById("countRefresh").innerText = countRefresh;
            progressBar.nowFrame = 420;
            animationIntroLevel.isComplete = false;
            animationIntroLevel.text = "CẤP ĐỘ " + level;
            isShowDialog = false;
            scoreObject.score = 0;
            // progressbar
            progressBar.isComplete = false;
        }
    }
    // update list line
    let count = 0;
    while (count < listLine.length) {
        listLine[count].update(currentTime);
        if (listLine[count].isComplete) {
            listLine.splice(count, 1);
        } else {
            count++;
        }
    }
    // update list animation
    count = 0;
    while (count < animations.length) {
        animations[count].update(currentTime);
        if (animations[count].isComplete) {
            animations.splice(count, 1);
        } else {
            count++;
        }
    }
    // update score
    scoreObject.update(currentTime);
    // update level
    count = 0;
    for (let i = 1; i < arrayPokemon.length - 1; i++) {
        for (let j = 1; j < arrayPokemon[i].length - 1; j++) {
            if (arrayPokemon[i][j] != 0) {
                count++;
                break;
            }
        }
    }
    if (count == 0 && configuration.isStartGame) {
        configuration.pauseGame();
        nextLevel.reset(level, arrayPokemon, algorithm, countFind, countRefresh,
            musicManager, progressBar, animationIntroLevel, scoreObject, countFind, countRefresh, scoreObject.score, progressBar.nowFrame - 16);
    }
    // Introduct level
    animationIntroLevel.update(currentTime);
    // Tạo snow
    if (lastTimeCreateSnow == 0) {
        lastTimeCreateSnow = currentTime;
    }
    if (currentTime - lastTimeCreateSnow > 100) {
        lastTimeCreateSnow = currentTime;
        let xSnow = algorithm.getRandomInt(-50, configuration.MAIN_WIDTH);
        let ySnow = algorithm.getRandomInt(0, 500);
        let sx = algorithm.getRandomInt(-1, 1);
        let sy = algorithm.getRandomInt(1, 1);
        let whSnow = algorithm.getRandomInt(5, 25);
        animations.push(new animationClass.Animation(xSnow, ySnow,
            whSnow, whSnow,
            937, 1291, 7, 5, imageManager.animationSnow, 70,
            sx, sy));
    }
    // next level
    nextLevel.update(currentTime);
    // update list animation scale
    count = 0;
    while (count < animationScales.length) {
        animationScales[count].update(currentTime);
        if (animationScales[count].isComplete) {
            animationScales.splice(count, 1);
        } else {
            count++;
        }
    }
}

export function next() {
    if (level == 15) {
        level = 1;
        scoreObject.score = 0;
        document.getElementById("level").innerText = "CẤP ĐỘ " + level;
        arrayPokemon = algorithm.createArrayPokemon();
        countFind = 15;
        document.getElementById("countFind").innerText = countFind;
        countRefresh = 10;
        document.getElementById("countRefresh").innerText = countRefresh;
        progressBar.nowFrame = 420;
        musicManager.nextLevel.play();
        animationIntroLevel.isComplete = false;
        animationIntroLevel.text = "CẤP ĐỘ " + level;
        document.getElementById("winScreen").style.display = "none";
        configuration.startGame();
    } else {
        level++;
        document.getElementById("level").innerText = "CẤP ĐỘ " + level;
        arrayPokemon = algorithm.createArrayPokemon();
        countFind += 5;
        document.getElementById("countFind").innerText = countFind;
        countRefresh += 2;
        document.getElementById("countRefresh").innerText = countRefresh;
        progressBar.nowFrame = 420;
        musicManager.nextLevel.play();
        animationIntroLevel.isComplete = false;
        animationIntroLevel.text = "CẤP ĐỘ " + level;
        document.getElementById("winScreen").style.display = "none";
        configuration.startGame();
    }
}

// Hàm vẽ
function draw(/** @type {CanvasRenderingContext2D} */ paint_main_canvas) {
    // Xóa vũ vẽ mới
    paint_main_canvas.clearRect(0, 0, configuration.MAIN_WIDTH, configuration.MAIN_HEIGHT)
    // Vẽ
    // Dùng canvas
    // Vẽ backgroundmap
    backgroundMap.draw(0, 0, configuration.MAIN_WIDTH, configuration.MAIN_HEIGHT, level, paint_main_canvas);
    // Vẽ line
    listLine.forEach(element => {
        element.draw(paint_main_canvas);
    });
    // Vẽ các nền nút
    let xStart = configuration.xStartDraw;
    let yStart = configuration.yStartDraw;
    for (let i = 1; i < 9; i++) {
        for (let j = 1; j < 18; j++) {
            if (arrayPokemon[i][j] != 0 || (arrayPokemon[i][j] == 0 && ((moveSelect.x == j && moveSelect.y == i) || (moveSelect2.x == j && moveSelect2.y == i)))) {
                // Vẽ nền
                // Check hover
                let imageBackground = imageManager.images[0];
                if (moveHover.x == j && moveHover.y == i) {
                    imageBackground = imageManager.images[1];
                }
                paint_main_canvas.drawImage(imageBackground, xStart, yStart, configuration.box_width, configuration.box_height);
                // Vẽ hình 
                let indexImage = arrayPokemon[i][j];
                let image = imageManager.images[indexImage];
                paint_main_canvas.drawImage(image, xStart, yStart, configuration.box_width, configuration.box_height);
                // Vẽ đối tượng đang được lựa chọn 
                if ((moveSelect.x == j && moveSelect.y == i) || (moveSelect2.x == j && moveSelect2.y == i)) {
                    paint_main_canvas.lineWidth = "3";
                    paint_main_canvas.strokeStyle = "rgb(0,254,0)"
                    if (valueMoveSelect != -1 && (moveSelect2.x != -1 && moveSelect2.y != -1)) {
                        let indexImageSelect = valueMoveSelect;
                        let imageSelect = imageManager.images[indexImageSelect];
                        paint_main_canvas.drawImage(imageSelect, xStart, yStart, configuration.box_width, configuration.box_height);
                    }
                    algorithm.roundRect(paint_main_canvas, xStart, yStart, configuration.box_width - 2, configuration.box_height - 3, 0);
                }
            }
            xStart += configuration.box_width;
        }
        xStart = configuration.xStartDraw;
        yStart += configuration.box_height;
    }

    // Vẽ không dùng canvas
    // Vẽ điểm
    scoreObject.draw();
    // Vẽ animation
    animations.forEach(anim => {
        anim.draw(paint_main_canvas);
    });
    // Introduct level
    if (!animationIntroLevel.isComplete) {
        animationIntroLevel.draw(paint_main_canvas);
    }
    // next level
    if (nextLevel.isDraw) {
        nextLevel.draw(paint_main_canvas);
    }
    // Vẽ animation scale
    animationScales.forEach(anim => {
        anim.draw(paint_main_canvas);
    });
}

// Hàm tìm kiếm cho buttonFind
function find() {
    if (configuration.isStartGame) {
        if (countFind > 0) {
            if (configuration.isPlayMusic) {
                musicManager.cursor.play();
            }
            countFind--;
            document.getElementById("countFind").innerText = countFind;

            let line = null;
            let move1 = null;
            let move2 = null;
            let value = null;
            for (let i = 1; i < arrayPokemon.length - 1; i++) {
                for (let j = 1; j < arrayPokemon[i].length - 1; j++) {
                    if (arrayPokemon[i][j] != 0) {
                        let ml = new moveClass.Move(j, i);
                        for (let k = 1; k < arrayPokemon.length - 1; k++) {
                            for (let k2 = 1; k2 < arrayPokemon[k].length - 1; k2++) {
                                if (arrayPokemon[k][k2] == arrayPokemon[i][j]) {
                                    let mn = new moveClass.Move(k2, k);
                                    if (i != k || j != k2) {
                                        let lineFind = algorithm.getLineConnected(ml, mn, arrayPokemon);
                                        if (lineFind != null) {
                                            line = lineFind;
                                            move1 = ml;
                                            move2 = mn;
                                            value = arrayPokemon[i][j];
                                            break;
                                        }
                                    }
                                }
                            }
                            if (line != null) {
                                break;
                            }
                        }
                        if (line != null) {
                            break;
                        }
                    }
                }
                if (line != null) {
                    break;
                }
            }
            // Thêm line vào danh sách line
            listLine.push(line);
            // Ẩn 2 đối tượng đã bị chọn trúng
            valueMoveSelect = value;
            arrayPokemon[move1.y][move1.x] = 0;
            arrayPokemon[move2.y][move2.x] = 0;
            let whatHide = algorithm.getRandomInt(1, 2);
            if (whatHide == 1) {
                // Tạo 2 animation hide
                let posX1 = configuration.xStartDraw + (move1.x - 1) * configuration.box_width - 23;
                let posY1 = configuration.yStartDraw + (move1.y - 1) * configuration.box_height - 23;
                let posX2 = configuration.xStartDraw + (move2.x - 1) * configuration.box_width - 23;
                let posY2 = configuration.yStartDraw + (move2.y - 1) * configuration.box_height - 23;
                animations.push(new animationClass.Animation(posX1, posY1, configuration.animationHide_width, configuration.animationHide_height, 728, 824, 4, 4, imageManager.animationHide, 25));
                animations.push(new animationClass.Animation(posX2, posY2, configuration.animationHide_width, configuration.animationHide_height, 728, 824, 4, 4, imageManager.animationHide, 25));
            } else {
                let animationScale = new animationScaleClass.AnimationScale(new moveClass.Move(move1.x, move1.y),
                    new moveClass.Move(move2.x, move2.y), value);
                animationScales.push(animationScale);
            }
            // Chạy âm thanh ăn
            if (configuration.isPlayMusic) {
                musicManager.eat.play();
            }
            // Cho đối tượng select là chưa chọn (-1,-1);
            moveSelect2.x = move2.x;
            moveSelect2.y = move2.y;
            setTimeout(function () {
                moveSelect.x = -1;
                moveSelect.y = -1;
                moveSelect2.x = -1;
                moveSelect2.y = -1;
            }, 100);
            // Hành xử level
            algorithm.handleLevel(level, arrayPokemon);
            // Tính điểm
            scoreObject.scoreNeedGoTo = algorithm.getScore(level);
            // Kiểm tra xem thử có hết đường ?
            if (algorithm.isDeadWay(arrayPokemon)) {
                if (countRefresh > 0) {
                    countRefresh--;
                    document.getElementById("countRefresh").innerText = countRefresh;
                    algorithm.refreshArray(arrayPokemon);
                    musicManager.refresh.play();
                } else {
                    musicManager.lost.play();
                    isShowDialog = true;
                    let loseGame = document.getElementById("loseGame");
                    let loseGameH3 = document.getElementById("loseGameH3");
                    let loseGameP = document.getElementById("loseGameP");
                    let loseGameButton = document.getElementById("loseGameButton");
                    loseGame.style.display = "flex";
                    loseGameButton.style.animationName = "move_top";
                    loseGameH3.style.animationName = "move_right";
                    loseGameP.style.animationName = "move_right";
                    loseGameP.innerText = "Vì bạn đã hết đường đi";
                    // action cho button lostGame
                    loseGameButton.onclick = function () {
                        loseGame.style.display = "none";
                        loseGameButton.style.animationName = "";
                        loseGameH3.style.animationName = "";
                        loseGameP.style.animationName = "";
                        level = 1;
                        document.getElementById("level").innerText = "CẤP ĐỘ " + level;
                        arrayPokemon = algorithm.createArrayPokemon();
                        countFind = 15;
                        document.getElementById("countFind").innerText = countFind;
                        countRefresh = 10;
                        document.getElementById("countRefresh").innerText = countRefresh;
                        progressBar.nowFrame = 420;
                        animationIntroLevel.isComplete = false;
                        animationIntroLevel.text = "CẤP ĐỘ " + level;
                        scoreObject.score = 0;
                        isShowDialog = false;
                        // progressbar
                        progressBar.isComplete = false;
                    }
                }
            }
        } else {
            if (configuration.isPlayMusic) {
                musicManager.no.play();
            }
        }
    }
}

// Hàm refresh cho buttonRefresh
function refresh() {
    if (configuration.isStartGame) {
        if (countRefresh > 0) {
            if (configuration.isPlayMusic) {
                musicManager.cursor.play();
            }
            countRefresh--;
            document.getElementById("countRefresh").innerText = countRefresh;
            // refresh
            algorithm.refreshArray(arrayPokemon);
        } else {
            if (configuration.isPlayMusic) {
                musicManager.no.play();
            }
        }
    }
}

// Hàm xử lý click trên canvas
function handleClickOnCanvas(event) {
    if (configuration.isStartGame && !isShowDialog) {
        // Lấy tạo độ mouse
        let currentTarget = event.currentTarget.getBoundingClientRect();
        let xMouse = event.clientX - currentTarget.left;
        let yMouse = event.clientY - currentTarget.top;
        // Xác định ở trong vùng chơi
        if (xMouse >= configuration.xStartDraw && yMouse >= configuration.yStartDraw
            && xMouse <= (configuration.xStartDraw + configuration.box_width * (arrayPokemon[0].length - 2))
            && yMouse <= (configuration.yStartDraw + configuration.box_height * (arrayPokemon.length - 2))) {
            // Tính xem đối tượng nào đang được hover
            let xNowClick = parseInt((xMouse - configuration.xStartDraw) / configuration.box_width) + 1;
            let yNowClick = parseInt((yMouse - configuration.yStartDraw) / configuration.box_height) + 1;
            // Xác định xem thử thằng đó còn tồn tại hay ko (==0)
            if (arrayPokemon[yNowClick][xNowClick] != 0) {
                // Play sound select
                if (configuration.isPlayMusic) {
                    musicManager.smooth.play();
                }
                // Trường hợp chưa có cái nào được chọn
                if (moveSelect.x == -1 && moveSelect.y == -1) {
                    moveSelect.x = xNowClick;
                    moveSelect.y = yNowClick;
                } else {
                    // Trường hợp bỏ con vừa chọn
                    if (moveSelect.x == xNowClick && moveSelect.y == yNowClick) {
                        moveSelect.x = -1;
                        moveSelect.y = -1;
                    } else {

                        // Rơi xuống đây thì có nghĩa là chọn 2  hình khác nhau
                        // Ta check xem thử hình này có cùng loại hình kia ko đã
                        // Cùng thì ta check đường đi không cùng thì chuyển select từ hiện tại
                        // -> Tới hình đó
                        if (arrayPokemon[yNowClick][xNowClick] != arrayPokemon[moveSelect.y][moveSelect.x]) {
                            moveSelect.x = xNowClick;
                            moveSelect.y = yNowClick;
                        } else {
                            // Nó giống hình thì check thử 2 thằng có kết nối hay không
                            // Bằng cách lấy đường kết nối ra
                            let lineConnected = algorithm.getLineConnected(moveSelect, new moveClass.Move(xNowClick, yNowClick), arrayPokemon);
                            if (lineConnected == null) {
                                moveSelect.x = xNowClick;
                                moveSelect.y = yNowClick;
                            } else {
                                // Thêm line vào danh sách line
                                listLine.push(lineConnected);
                                // Ẩn 2 đối tượng đã bị chọn trúng
                                valueMoveSelect = arrayPokemon[moveSelect.y][moveSelect.x];
                                arrayPokemon[moveSelect.y][moveSelect.x] = 0;
                                arrayPokemon[yNowClick][xNowClick] = 0;

                                let whatHide = algorithm.getRandomInt(1, 2);
                                if (whatHide == 1) {
                                    // Tạo 2 animation hide
                                    let posX1 = configuration.xStartDraw + (moveSelect.x - 1) * configuration.box_width - 23;
                                    let posY1 = configuration.yStartDraw + (moveSelect.y - 1) * configuration.box_height - 23;
                                    let posX2 = configuration.xStartDraw + (xNowClick - 1) * configuration.box_width - 23;
                                    let posY2 = configuration.yStartDraw + (yNowClick - 1) * configuration.box_height - 23;
                                    animations.push(new animationClass.Animation(posX1, posY1, configuration.animationHide_width, configuration.animationHide_height, 728, 824, 4, 4, imageManager.animationHide, 25));
                                    animations.push(new animationClass.Animation(posX2, posY2, configuration.animationHide_width, configuration.animationHide_height, 728, 824, 4, 4, imageManager.animationHide, 25));
                                } else {
                                    let animationScale = new animationScaleClass.AnimationScale(new moveClass.Move(xNowClick, yNowClick),
                                        new moveClass.Move(moveSelect.x, moveSelect.y), valueMoveSelect);
                                    animationScales.push(animationScale);
                                }
                                // Chạy âm thanh ăn
                                if (configuration.isPlayMusic) {
                                    musicManager.eat.play();
                                }
                                // Cho đối tượng select là chưa chọn (-1,-1);
                                moveSelect2.x = xNowClick;
                                moveSelect2.y = yNowClick;
                                setTimeout(function () {
                                    moveSelect.x = -1;
                                    moveSelect.y = -1;
                                    moveSelect2.x = -1;
                                    moveSelect2.y = -1;
                                }, 100);
                                // Hành xử level
                                algorithm.handleLevel(level, arrayPokemon);
                                // Tính điểm
                                scoreObject.scoreNeedGoTo = algorithm.getScore(level);
                                // Kiểm tra xem thử có hết đường ?
                                if (algorithm.isDeadWay(arrayPokemon)) {
                                    if (countRefresh > 0) {
                                        countRefresh--;
                                        document.getElementById("countRefresh").innerText = countRefresh;
                                        algorithm.refreshArray(arrayPokemon);
                                        musicManager.refresh.play();
                                    } else {
                                        musicManager.lost.play();
                                        isShowDialog = true;
                                        let loseGame = document.getElementById("loseGame");
                                        let loseGameH3 = document.getElementById("loseGameH3");
                                        let loseGameP = document.getElementById("loseGameP");
                                        let loseGameButton = document.getElementById("loseGameButton");
                                        loseGame.style.display = "flex";
                                        loseGameButton.style.animationName = "move_top";
                                        loseGameH3.style.animationName = "move_right";
                                        loseGameP.style.animationName = "move_right";
                                        loseGameP.innerText = "Vì bạn đã hết đường đi";
                                        // action cho button lostGame
                                        loseGameButton.onclick = function () {
                                            loseGame.style.display = "none";
                                            loseGameButton.style.animationName = "";
                                            loseGameH3.style.animationName = "";
                                            loseGameP.style.animationName = "";
                                            level = 1;
                                            document.getElementById("level").innerText = "CẤP ĐỘ " + level;
                                            arrayPokemon = algorithm.createArrayPokemon();
                                            countFind = 15;
                                            document.getElementById("countFind").innerText = countFind;
                                            countRefresh = 10;
                                            document.getElementById("countRefresh").innerText = countRefresh;
                                            progressBar.nowFrame = 420;
                                            animationIntroLevel.isComplete = false;
                                            animationIntroLevel.text = "CẤP ĐỘ " + level;
                                            scoreObject.score = 0;
                                            isShowDialog = false;
                                            // progressbar
                                            progressBar.isComplete = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// Hàm xử lý move tren canvas
function handleMoveOnCanvas(event) {
    if (configuration.isStartGame && !isShowDialog) {
        // Lấy tạo độ mouse
        let currentTarget = event.currentTarget.getBoundingClientRect();
        let xMouse = event.clientX - currentTarget.left;
        let yMouse = event.clientY - currentTarget.top;
        // Xác định ở trong vùng chơi
        if (xMouse >= configuration.xStartDraw && yMouse >= configuration.yStartDraw
            && xMouse <= (configuration.xStartDraw + configuration.box_width * (arrayPokemon[0].length - 2))
            && yMouse <= (configuration.yStartDraw + configuration.box_height * (arrayPokemon.length - 2))) {
            // Tính xem đối tượng nào đang được hover
            moveHover.x = parseInt((xMouse - configuration.xStartDraw) / configuration.box_width) + 1;
            moveHover.y = parseInt((yMouse - configuration.yStartDraw) / configuration.box_height) + 1;
        } else {
            // Out các đối tượng pokemon thì ko có thằng nào được hover
            moveHover.x = -1;
            moveHover.y = -1;
        }
    }
}
//---------------------------------------
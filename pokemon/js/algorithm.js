// Import ----------------
import * as configuration from "./configuration.js";
import * as musicManager from "./music_manager.js"
import * as lineClass from "./line.js"
import * as moveClass from "./move.js";
//------------------------

// Hàm tạo mảng các pokemon
export function createArrayPokemon() {
    // Tạo mảng rỗng full 0
    let arrayPokemon = Array.from(Array(10), () => new Array(19));
    for (let i = 0; i < arrayPokemon.length; i++) {
        for (let j = 0; j < arrayPokemon[i].length; j++) {
            arrayPokemon[i][j] = 0;
        }
    }
    let count = 10;
    while (count != 0) {
        count = 0;

        let pikachu = getRandomInt(2, 37);

        let x = getRandomInt(1, 8);
        let y = getRandomInt(1, 17);

        while (arrayPokemon[x][y] != 0) {
            x = getRandomInt(1, 8);
            y = getRandomInt(1, 17);
        }
        arrayPokemon[x][y] = pikachu;

        x = getRandomInt(1, 8);
        y = getRandomInt(1, 17);
        while (arrayPokemon[x][y] != 0) {
            x = getRandomInt(1, 8);
            y = getRandomInt(1, 17);
        }
        arrayPokemon[x][y] = pikachu;

        for (let i = 1; i < arrayPokemon.length - 1; i++) {
            for (let j = 1; j < arrayPokemon[i].length - 1; j++) {
                if (arrayPokemon[i][j] == 0)
                    count++;
            }
        }
    }
    return arrayPokemon;
}

// Hàm vẽ round rect
export function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

// Hàm lấy random một số
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Phương thức dừng và chạy game 
export function pauseStartGame(buttonPausePlayLottie) {
    if (configuration.isPlayMusic) {
        musicManager.cursor.play();
    }
    if (configuration.isStartGame) {
        configuration.pauseGame();
        buttonPausePlayLottie.playSegments([0, 30], true);
        document.getElementById("pauseScreen").style.display = "flex"
    } else {
        document.getElementById("pauseScreen").style.display = "none"
        configuration.startGame();
        buttonPausePlayLottie.playSegments([30, 80], true);
    }
}

// Phương thức bậc tắt nhạc
export function pauseStartMusic(buttonOffOnMusicLottie) {
    musicManager.cursor.play();
    if (configuration.isPlayMusic) {
        configuration.stopMusic();
        buttonOffOnMusicLottie.playSegments([40, 100], true);
        // Dừng nhạc nền
        musicManager.backgroundMusic.pause();
    } else {
        buttonOffOnMusicLottie.playSegments([0, 40], true);
        configuration.playMusic();
        // Chạy nhạc nền
        musicManager.backgroundMusic.play();
    }
}

// Hàm kiểm tra kết nối, trả về một đối tượng đường đi
// Có đườnng đi thì tồn tại đường đi
// Không có đường thì trả về null
export function getLineConnected(moveLast, moveNew, array) {
    // Tạo đường đi
    let moves = [];
    // Kiểm tra kết nối cùng hàng theo chiều dọng hay chiều ngang
    if (isConnectVerticalHorizontal(moveLast, moveNew, array)) {
        moves.push(new moveClass.Move(moveLast.x, moveLast.y));
        moves.push(new moveClass.Move(moveNew.x, moveNew.y));
        return new lineClass.Line(moves);
    }
    // Kiểm tra đường đi theo chiều ngang bên trái
    for (let i = moveLast.x; i >= 0; i--) {
        if (isConnectVerticalHorizontal(new moveClass.Move(i, moveLast.y), moveLast, array)) {
            // Check last -> left
            if (array[moveLast.y][i] != 0 && i != moveLast.x) {
                break;
            } else {
                // Check left -> bottom or top
                if (isConnectVerticalHorizontal(new moveClass.Move(i, moveLast.y), new moveClass.Move(i, moveNew.y), array)) {
                    // 2 đường
                    if (moveNew.x == i) {
                        moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                        moves.push(new moveClass.Move(i, moveLast.y));
                        moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                        return new lineClass.Line(moves);
                    } else {
                        // bottom or top ->right or left;
                        // 3 đường
                        if (array[moveNew.y][i] == 0 && isConnectVerticalHorizontal(new moveClass.Move(i, moveNew.y), new moveClass.Move(moveNew.x, moveNew.y), array)) {
                            moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                            if (i != moveLast.x) {
                                moves.push(new moveClass.Move(i, moveLast.y));
                            }
                            if (i != moveNew.x) {
                                moves.push(new moveClass.Move(i, moveNew.y));
                            }
                            moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                            return new lineClass.Line(moves);
                        }
                    }
                }
            }
        }
    }
    // Kiểm tra đường đi theo chiều ngang bên phải
    for (let i = moveLast.x; i < 19; i++) {
        if (isConnectVerticalHorizontal(new moveClass.Move(i, moveLast.y), moveLast, array)) {
            // Check last -> right
            if (array[moveLast.y][i] != 0 && i != moveLast.x) {
                break;
            } else {
                // Check right-> bottom or top
                if (isConnectVerticalHorizontal(new moveClass.Move(i, moveLast.y), new moveClass.Move(i, moveNew.y), array)) {
                    // 2 đường
                    if (moveNew.x == i) {
                        moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                        moves.push(new moveClass.Move(i, moveLast.y));
                        moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                        return new lineClass.Line(moves);
                    } else {
                        // bottom or top  ->right or left;
                        // 3 đường
                        if (array[moveNew.y][i] == 0 && isConnectVerticalHorizontal(new moveClass.Move(i, moveNew.y), new moveClass.Move(moveNew.x, moveNew.y), array)) {
                            moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                            if (i != moveLast.x) {
                                moves.push(new moveClass.Move(i, moveLast.y));
                            }
                            if (i != moveNew.x) {
                                moves.push(new moveClass.Move(i, moveNew.y));
                            }
                            moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                            return new lineClass.Line(moves);
                        }
                    }
                }
            }
        }
    }
    // Kiểm tra đường đi theo chiều dọc lên trên
    for (let i = moveLast.y; i >= 0; i--) {
        if (isConnectVerticalHorizontal(new moveClass.Move(moveLast.x, i), moveLast, array)) {
            // Check bottom -> top
            if (array[i][moveLast.x] != 0 && i != moveLast.y) {
                break;
            } else {
                // Check top -> left or right
                if (isConnectVerticalHorizontal(new moveClass.Move(moveLast.x, i), new moveClass.Move(moveNew.x, i), array)) {
                    // 2 đường
                    if (moveNew.y == i) {
                        moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                        moves.push(new moveClass.Move(moveLast.x, i));
                        moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                        return new lineClass.Line(moves);
                    } else {
                        // left or right -> bottom or top;
                        // 3 đường
                        if (array[i][moveNew.x] == 0 && isConnectVerticalHorizontal(new moveClass.Move(moveNew.x, i), new moveClass.Move(moveNew.x, moveNew.y), array)) {
                            moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                            if (i != moveLast.y) {
                                moves.push(new moveClass.Move(moveLast.x, i));
                            }
                            if (i != moveNew.y) {
                                moves.push(new moveClass.Move(moveNew.x, i));
                            }
                            moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                            return new lineClass.Line(moves);
                        }
                    }
                }
            }
        }
    }
    // Kiểm tra đường đi theo chiều dọc xuống dưới
    for (let i = moveLast.y; i < 10; i++) {
        if (isConnectVerticalHorizontal(new moveClass.Move(moveLast.x, i), moveLast, array)) {
            // Check top -> bottom
            if (array[i][moveLast.x] != 0 && i != moveLast.y) {
                break;
            } else {
                // Check bottom -> left or right
                if (isConnectVerticalHorizontal(new moveClass.Move(moveLast.x, i), new moveClass.Move(moveNew.x, i), array)) {
                    // 2 đường
                    if (moveNew.y == i) {
                        moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                        moves.push(new moveClass.Move(moveLast.x, i));
                        moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                        return new lineClass.Line(moves);
                    } else {
                        // left or right ->bottom or top
                        // 3 đường
                        if (array[i][moveNew.x] == 0 && isConnectVerticalHorizontal(new moveClass.Move(moveNew.x, i), new moveClass.Move(moveNew.x, moveNew.y), array)) {
                            moves.push(new moveClass.Move(moveLast.x, moveLast.y));
                            if (i != moveLast.y) {
                                moves.push(new moveClass.Move(moveLast.x, i));
                            }
                            if (i != moveNew.y) {
                                moves.push(new moveClass.Move(moveNew.x, i));
                            }
                            moves.push(new moveClass.Move(moveNew.x, moveNew.y));
                            return new lineClass.Line(moves);
                        }
                    }
                }
            }
        }
    }
    return null;
}

// Hàm kiểm tra 2 move có kết nối hay không
function isConnectVerticalHorizontal(moveLast, moveNew, array) {
    // Vertical
    if (moveLast.x == moveNew.x) {
        let start = moveLast.y;
        let end = moveNew.y;
        if (moveLast.y > moveNew.y) {
            start = moveNew.y;
            end = moveLast.y;
        }

        let count = 0;
        for (let i = start + 1; i < end; i++) {
            if (array[i][moveLast.x] != 0) {
                count++;
                break;
            }
        }

        if (count == 0) {
            return true;
        }
    }

    // Horizontal
    if (moveLast.y == moveNew.y) {
        let start = moveLast.x;
        let end = moveNew.x;
        if (moveLast.x > moveNew.x) {
            start = moveNew.x;
            end = moveLast.x;
        }

        let count = 0;
        for (let i = start + 1; i < end; i++) {
            if (array[moveLast.y][i] != 0) {
                count++;
                break;
            }
        }

        if (count == 0) {
            return true;
        }
    }
    return false;
}

// Hàm đổi 2 giá trị trong mảng
function swap(i, index, y, array) {
    let a = array[i][y];
    array[i][y] = array[index][y];
    array[index][y] = a;
}

// Hàm đổi 2 giá trị trong mảng theo x
function swapX(i, index, x, array) {
    let a = array[x][i];
    array[x][i] = array[x][index];
    array[x][index] = a;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển lên, ko có thì trả về -1;
function positionOtherThan0FirstMoveUp(start, y, array) {
    for (let i = start; i < array.length - 1; i++) {
        if (array[i][y] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển mảng lên
function moveUp(array) {
    for (let k = 1; k < array[0].length - 1; k++) {
        let y = k;
        let count = 0;
        for (let i = 1; i < array.length - 1; i++) {
            if (array[i][y] == 0) {
                count++;
                break;
            }
        }
        // Nếu có thể di chuyển lên mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != array.length - 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveUpAtCol(k, array)) {
                for (let i = 1; i < array.length - 1; i++) {
                    if (array[i][y] == 0) {
                        let index = positionOtherThan0FirstMoveUp(i, y, array);
                        if (index != -1) {
                            swap(i, index, y, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một cột có di chuyển lên oke không
function isCompleteMoveUpAtCol(y, array) {
    // Lấy vị trí = 0 đầu tiên trong cột
    let index = 0;
    for (let i = 1; i < array.length - 1; i++) {
        if (array[i][y] == 0) {
            index = i;
            break;
        }
    }
    // Kiểm tra nếu như có ông nào khác 0 mà ổng ở vị trí lớn hơn ông 0 đầu tiên
    // Thì có nghĩa là chưa di chuyển lên xong
    for (let i = 1; i < array.length - 1; i++) {
        if (array[i][y] != 0 && i > index) {
            return false;
        }
    }
    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển xuống, ko có thì trả về -1;
function positionOtherThan0FirstMoveDown(start, y, array) {
    for (let i = start; i > 0; i--) {
        if (array[i][y] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển mảng xuống
function moveDown(array) {
    for (let k = 1; k < array[0].length - 1; k++) {
        let y = k;
        let count = 0;
        for (let i = 1; i < array.length - 1; i++) {
            if (array[i][y] == 0) {
                count++;
                break;
            }
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != array.length - 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveDownAtCol(k, array)) {
                for (let i = array.length - 2; i > 0; i--) {
                    if (array[i][y] == 0) {
                        let index = positionOtherThan0FirstMoveDown(i, y, array);
                        if (index != -1) {
                            swap(i, index, y, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một hàng có di xuống lên oke không
function isCompleteMoveDownAtCol(y, array) {
    let index = 0;
    for (let i = array.length - 2; i > 0; i--) {
        if (array[i][y] == 0) {
            index = i;
            break;
        }
    }

    for (let i = array.length - 2; i > 0; i--) {
        if (array[i][y] != 0 && i < index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển trái, ko có thì trả về -1;
function positionOtherThan0FirstMoveLeft(start, x, array) {
    for (let i = start; i < array[x].length - 1; i++) {
        if (array[x][i] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển mảng trái
function moveLeft(array) {
    for (let k = 1; k < array.length - 1; k++) {
        let x = k;

        let count = 0;
        for (let i = 1; i < array[0].length - 1; i++) {
            if (array[x][i] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != array[0].length - 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveLeftAtRow(k, array)) {
                for (let i = 1; i < array[x].length - 1; i++) {
                    if (array[x][i] == 0) {
                        let index = positionOtherThan0FirstMoveLeft(i, x, array);
                        if (index != -1) {
                            swapX(i, index, x, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một hàng có di trái lên oke không
function isCompleteMoveLeftAtRow(x, array) {
    let index = 0;
    for (let i = 1; i < array[x].length - 1; i++) {
        if (array[x][i] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 1; i < array[x].length - 1; i++) {
        if (array[x][i] != 0 && i > index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển trái, ko có thì trả về -1;
function positionOtherThan0FirstMoveRight(start, x, array) {
    for (let i = start; i > 0; i--) {
        if (array[x][i] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển phải
function moveRight(array) {
    for (let k = 1; k < array.length - 1; k++) {
        let x = k;

        let count = 0;
        for (let i = 1; i < array[0].length - 1; i++) {
            if (array[x][i] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != array[0].length - 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveRightAtRow(k, array)) {
                for (let i = array[0].length - 2; i > 0; i--) {
                    if (array[x][i] == 0) {
                        let index = positionOtherThan0FirstMoveRight(i, x, array);
                        if (index != -1) {
                            swapX(i, index, x, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một hàng di chuyển phải có oke không
function isCompleteMoveRightAtRow(x, array) {
    let index = 0;
    for (let i = array[0].length - 2; i > 0; i--) {
        if (array[x][i] == 0) {
            index = i;
            break;
        }
    }

    for (let i = array[0].length - 2; i > 0; i--) {
        if (array[x][i] != 0 && i < index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa xuống dưới, ko có thì trả về -1
function positionOtherThan0FirstMoveDownHalf(start, y, array) {
    for (let i = start; i > 4; i--) {
        if (array[i][y] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển xuống nhưng chỉ di chuyển một nửa 
function moveDownHalf(array) {
    for (let k = 1; k < array[0].length - 1; k++) {
        let y = k;

        let count = 0;
        for (let i = 5; i < array.length - 1; i++) {
            if (array[i][y] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != (array.length - 2) / 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveDownHalfAtCol(y, array)) {
                for (let i = array.length - 2; i > 4; i--) {
                    if (array[i][y] == 0) {
                        let index = positionOtherThan0FirstMoveDownHalf(i, y, array);
                        if (index != -1) {
                            swap(i, index, y, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một cột di chuyển xuống có oke ko
function isCompleteMoveDownHalfAtCol(y, array) {
    let index = 0;
    for (let i = array.length - 2; i > 4; i--) {
        if (array[i][y] == 0) {
            index = i;
            break;
        }
    }

    for (let i = array.length - 2; i > 4; i--) {
        if (array[i][y] != 0 && i < index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa lên trên, ko có thì trả về -1
function positionOtherThan0FirstMoveUpHalf(start, y, array) {
    for (let i = start; i < 5; i++) {
        if (array[i][y] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển lên nhưng chỉ di chuyển một nửa
function moveUpHalf(array) {
    for (let k = 1; k < array[0].length - 1; k++) {
        let y = k;
        let count = 0;
        for (let i = 1; i < 5; i++) {
            if (array[i][y] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != (array.length - 2) / 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveUpHalfAtCol(y, array)) {
                for (let i = 1; i < 5; i++) {
                    if (array[i][y] == 0) {
                        let index = positionOtherThan0FirstMoveUpHalf(i, y, array);
                        if (index != -1) {
                            swap(i, index, y, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một cột di chuyển lên có oke ko
function isCompleteMoveUpHalfAtCol(y, array) {
    let index = 0;
    for (let i = 1; i < 5; i++) {
        if (array[i][y] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (array[i][y] != 0 && i > index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa bên trái, ko có thì trả về -1;
function positionOtherThan0FirstMoveLeftHalf(start, x, array) {
    for (let i = start; i < 10; i++) {
        if (array[x][i] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển sang trái nhưng chỉ di chuyển một một nửa
function moveLeftHalf(array) {
    for (let k = 1; k < array.length - 1; k++) {
        let x = k;
        let count = 0;
        for (let i = 1; i < 10; i++) {
            if (array[x][i] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != 9) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveLeftHalfAtRow(x, array)) {
                for (let i = 1; i < 10; i++) {
                    if (array[x][i] == 0) {
                        let index = positionOtherThan0FirstMoveLeftHalf(i, x, array);
                        if (index != -1) {
                            swapX(i, index, x, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một dòng di chuyển sang trái có oke ko
function isCompleteMoveLeftHalfAtRow(x, array) {
    let index = 0;
    for (let i = 1; i < 10; i++) {
        if (array[x][i] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 1; i < 10; i++) {
        if (array[x][i] != 0 && i > index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa bên phải, ko có thì trả về -1
function positionOtherThan0FirstMoveRightHalf(start, x, array) {
    for (let i = start; i > 9; i--) {
        if (array[x][i] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển sang phải nhưng chỉ di chuyển một nửa
function moveRightHalf(array) {
    for (let k = 1; k < array.length - 1; k++) {
        let x = k;
        let count = 0;
        for (let i = 10; i < array[0].length - 1; i++) {
            if (array[x][i] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != 8) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveRightHalfAtRow(x, array)) {
                for (let i = array[0].length - 2; i > 9; i--) {
                    if (array[x][i] == 0) {
                        let index = positionOtherThan0FirstMoveRightHalf(i, x, array);
                        if (index != -1) {
                            swapX(i, index, x, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem một dòng di chuyển sang phải có oke ko
function isCompleteMoveRightHalfAtRow(x, array) {
    let index = 0;
    for (let i = array[0].length - 2; i > 9; i--) {
        if (array[x][i] == 0) {
            index = i;
            break;
        }
    }

    for (let i = array[0].length - 2; i > 9; i--) {
        if (array[x][i] != 0 && i < index) {
            return false;
        }
    }

    return true;
}

// Hàm lấu giá trị khác 0 đầu tiên trong di chuyển một nửa bên dưới lên trên, ko có thì trả về -1
function positionOtherThan0FirstMoveUpHalfDown(start, y, array) {
    for (let i = start; i < array.length - 1; i++) {
        if (array[i][y] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển một nửa bên dưới lên trên
function moveUpHalfDown(array) {
    for (let k = 1; k < array[0].length - 1; k++) {
        let y = k;
        let count = 0;
        for (let i = 5; i < array.length - 1; i++) {
            if (array[i][y] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != (array.length - 2) / 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveUpHalfDownAtCol(y, array)) {
                for (let i = 5; i < array.length - 1; i++) {
                    if (array[i][y] == 0) {
                        let index = positionOtherThan0FirstMoveUpHalfDown(i, y, array);
                        if (index != -1) {
                            swap(i, index, y, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem cột di chuyển một nửa dưới lên oke ko
function isCompleteMoveUpHalfDownAtCol(y, array) {
    let index = 0;
    for (let i = 5; i < array.length - 1; i++) {
        if (array[i][y] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 5; i < array.length - 1; i++) {
        if (array[i][y] != 0 && i > index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa bên trên xuống dưới
function positionOtherThan0FirstMoveDownHalfUp(start, y, array) {
    for (let i = start; i > 0; i--) {
        if (array[i][y] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển một nửa bên trên xuống dưới
function moveDownHalfUp(array) {
    for (let k = 1; k < array[0].length - 1; k++) {
        let y = k;
        let count = 0;
        for (let i = 1; i < 5; i++) {
            if (array[i][y] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != (array.length - 2) / 2) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveDownHalfUpAtCol(y, array)) {
                for (let i = 4; i > 0; i--) {
                    if (array[i][y] == 0) {
                        let index = positionOtherThan0FirstMoveDownHalfUp(i, y, array);
                        if (index != -1) {
                            swap(i, index, y, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem cột di chuyển một nửa xuống dưới oke ko
function isCompleteMoveDownHalfUpAtCol(y, array) {
    let index = 0;
    for (let i = 4; i > 0; i--) {
        if (array[i][y] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 4; i > 0; i--) {
        if (array[i][y] != 0 && i < index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa bên phải sang trái
function positionOtherThan0FirstMoveLeftHalfRight(start, x, array) {
    for (let i = start; i > 0; i--) {
        if (array[x][i] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển một nửa bên phải sang trái
function moveLeftHalfRight(array) {
    for (let k = 1; k < array.length - 1; k++) {
        let x = k;
        let count = 0;
        for (let i = 1; i < 10; i++) {
            if (array[x][i] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != 9) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveLeftHalfRightAtRow(x, array)) {
                for (let i = 9; i > 0; i--) {
                    if (array[x][i] == 0) {
                        let index = positionOtherThan0FirstMoveLeftHalfRight(i, x, array);
                        if (index != -1) {
                            swapX(i, index, x, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem dòng di chuyển một nửa bên phải sang trái có oke ko
function isCompleteMoveLeftHalfRightAtRow(x, array) {
    let index = 0;
    for (let i = 9; i > 0; i--) {
        if (array[x][i] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 9; i > 0; i--) {
        if (array[x][i] != 0 && i < index) {
            return false;
        }
    }

    return true;
}

// Hàm lấy giá trị khác 0 đầu tiên trong di chuyển một nửa ên trái sang phải
function positionOtherThan0FirstMoveRightHalfLeft(start, x, array) {
    for (let i = start; i < array[0].length - 1; i++) {
        if (array[x][i] != 0)
            return i;
    }

    return -1;
}

// Hàm di chuyển một nửa bên trái sang phải
function moveRightHalfLeft(array) {
    for (let k = 1; k < array.length - 1; k++) {
        let x = k;
        let count = 0;
        for (let i = 10; i < array[0].length - 1; i++) {
            if (array[x][i] == 0)
                count++;
        }
        // Nếu có thể di chuyển xuống mới làm
        // Thỏa 2 điều kiện - sô ô = 0 khác 0 và ko có ô 0 nào 
        if (count != 0 && count != 8) {
            // Di chuyển theo từng cột
            while (!isCompleteMoveRightHalfLeftAtRow(x, array)) {
                for (let i = 10; i < array[0].length - 1; i++) {
                    if (array[x][i] == 0) {
                        let index = positionOtherThan0FirstMoveRightHalfLeft(i, x, array);
                        if (index != -1) {
                            swapX(i, index, x, array);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Hàm kiểm tra xem dòng di chuyển một nửa phải sang trái
function isCompleteMoveRightHalfLeftAtRow(x, array) {
    let index = 0;
    for (let i = 10; i < array[0].length - 1; i++) {
        if (array[x][i] == 0) {
            index = i;
            break;
        }
    }

    for (let i = 10; i < array[0].length - 1; i++) {
        if (array[x][i] != 0 && i > index) {
            return false;
        }
    }

    return true;
}

// Hàm xử lý level sau khi ăn
export function handleLevel(level, array) {
    switch (level) {
        case 1:
            break;
        case 2:
            moveUp(array);
            break;
        case 3:
            moveDown(array);
            break;
        case 4:
            moveLeft(array);
            break;
        case 5:
            moveRight(array);
            break;
        case 6:
            moveUp(array);
            moveLeft(array);
            break;
        case 7:
            moveUp(array);
            moveRight(array);
            break;
        case 8:
            moveDown(array);
            moveLeft(array);
            break;
        case 9:
            moveDown(array);
            moveRight(array);
            break;
        case 10:
            moveDownHalf(array);
            moveUpHalf(array);
            break;
        case 11:
            moveLeftHalf(array);
            moveRightHalf(array);
            break;
        case 12:
            moveDownHalf(array);
            moveUpHalf(array);
            moveLeftHalf(array);
            moveRightHalf(array);
            break;
        case 13:
            moveUpHalfDown(array);
            moveDownHalfUp(array);
            break;
        case 14:
            moveRightHalfLeft(array);
            moveLeftHalfRight(array);
            break;
        case 15:
            moveUpHalfDown(array);
            moveDownHalfUp(array);
            moveRightHalfLeft(array);
            moveLeftHalfRight(array);
            break;
    }
}

// Hàm tính điểm 
export function getScore(level) {
    return level * 5;
}

// Hàm kiếm tra hết đường đi
export function isDeadWay(array) {
    for (let i = 1; i < array.length - 1; i++) {
        for (let j = 1; j < array[i].length - 1; j++) {
            if (array[i][j] != 0) {
                let ml = new moveClass.Move(j, i);
                for (let k = 1; k < array.length - 1; k++) {
                    for (let k2 = 1; k2 < array[k].length - 1; k2++) {
                        if (array[k][k2] == array[i][j]) {
                            let mn = new moveClass.Move(k2, k);
                            if (i != k || j != k2) {
                                if (getLineConnected(ml, mn, array) != null) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // Để tránh xung đột update tăng level
    let count = 0;
    for (let i = 1; i < array.length - 1; i++) {
        for (let j = 1; j < array[i].length - 1; j++) {
            if (array[i][j] != 0) {
                count++;
                break;
            }
        }
    }
    if (count == 0) {
        return false;
    }
    return true
}

// Hàm tạo mới các pokemon khi hết đường đi
export function refreshArray(array) {
    let arr = Array.from(Array(10), () => new Array(19));
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] != 0) {
                arr[i][j] = -1;
            } else {
                arr[i][j] = 0;
            }
        }
    }
    let count = 10;
    while (count != 0) {
        count = 0;

        let pikachu = getRandomInt(2, 37);

        let x = getRandomInt(1, 8);
        let y = getRandomInt(1, 17);

        while (arr[x][y] != -1) {
            x = getRandomInt(1, 8);
            y = getRandomInt(1, 17);
        }
        array[x][y] = pikachu;
        arr[x][y] = 0;
        x = getRandomInt(1, 8);
        y = getRandomInt(1, 17);
        while (arr[x][y] != -1) {
            x = getRandomInt(1, 8);
            y = getRandomInt(1, 17);
        }
        array[x][y] = pikachu;
        arr[x][y] = 0;
        for (let i = 1; i < array.length - 1; i++) {
            for (let j = 1; j < array[i].length - 1; j++) {
                if (arr[i][j] == -1)
                    count++;
            }
        }
    }
}
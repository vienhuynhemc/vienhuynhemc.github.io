import * as configuration from "./configuration.js";
import * as gameWorld from "./gameWorld.js";

export class NextLevel {

    isComplete;
    lottie;
    isShow;
    isMove;
    lastTimeUpdate;
    // object html
    titleLevel;
    level;
    titleScore;
    score;
    time;
    titleTime;
    refresh;
    titleRefresh;
    find;
    titleFind;
    sum;
    button;
    // number
    numberScore;
    timeScore;
    numberTime;
    timeTime;
    numberFind;
    timeFind;
    numberRefresh;
    timeRefresh;
    numberSum;
    count;

    constructor() {
        // Tạo icon win
        // container
        let lottie_container = document.getElementById("iconWin");
        // Khởi tạo lottie
        this.lottie = bodymovin.loadAnimation({
            container: lottie_container, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: 'json/win.json' // the path to the animation json
        });
	this.lottie.playSegments([40, 74], true);
        // -----------------
        this.lastTimeUpdate = false;
        this.isComplete = false;
        this.isShow = false;
        // object html
        this.titleLevel = document.getElementById("winScreenTitleLevel");
        this.level = document.getElementById("winScreenLevel");
        this.titleScore = document.getElementById("winScreenTitleScore");
        this.score = document.getElementById("winScreenScore");
        this.titleTime = document.getElementById("winScreenTitleTime");
        this.time = document.getElementById("winScreenTime");
        this.titleRefresh = document.getElementById("winScreenTitleRefresh");
        this.refresh = document.getElementById("winScreenRefresh");
        this.titleFind = document.getElementById("winScreenTitleFind");
        this.find = document.getElementById("winScreenFind");
        this.sum = document.getElementById("winScreenSum");
        this.button = document.getElementById("winScreenButton");
        this.count = 4;
        this.numberSum = 0;
    }

    update(currentTime) {
        if (!this.isComplete) {
            if (this.lastTimeUpdate == 0) {
                this.lastTimeUpdate = currentTime;
                let anim = this.lottie;
                anim.addEventListener('DOMLoaded', function () {
                    anim.playSegments([0, 74], false);
                });
                this.titleLevel.style.animationName = "move_right";
                this.level.style.animationName = "move_right";
                this.titleScore.style.animationName = "move_right";
                this.score.style.animationName = "move_right";
                this.titleTime.style.animationName = "move_right";
                this.time.style.animationName = "move_right";
                this.titleRefresh.style.animationName = "move_right";
                this.refresh.style.animationName = "move_right";
                this.titleFind.style.animationName = "move_right";
                this.find.style.animationName = "move_right";
                this.button.style.animationName = "move_top";
                this.sum.innerText = "TỔNG CỘNG:0";
            }
            if (!this.isShow) {
                if (currentTime - this.lastTimeUpdate > 2500) {
                    this.isShow = true;
                    let anim = this.lottie;
                    anim.playSegments([40, 74], true);
                }
            }
            if (!this.isMove) {
                if (currentTime - this.lastTimeUpdate > 1000) {
                    this.isMove = true;
                }
            } else {
                if (this.count < 4) {
                    if (this.count == 0) {
                        if (currentTime - this.lastTimeUpdate > 10) {
                            this.lastTimeUpdate = currentTime;
                            let space = this.numberScore - this.timeScore >= 0 ? this.timeScore : this.numberScore;
                            this.numberSum += space;
                            this.sum.innerText = "TỔNG CỘNG:" + this.numberSum;
                            this.numberScore -= space;
                            this.score.innerText = this.numberScore;
                            if (this.numberScore == 0) {
                                this.count++;
                            }
                        }
                    } else if (this.count == 1) {
                        if (currentTime - this.lastTimeUpdate > 10) {
                            this.lastTimeUpdate = currentTime;
                            let space = this.numberTime - this.timeTime >= 0 ? this.timeTime : this.numberTime;
                            this.numberSum += space;
                            this.sum.innerText = "TỔNG CỘNG:" + this.numberSum;
                            this.numberTime -= space;
                            this.time.innerText = this.numberTime;
                            if (this.numberTime == 0) {
                                this.count++;
                            }
                        }
                    } else if (this.count == 2) {
                        if (currentTime - this.lastTimeUpdate > 10) {
                            this.lastTimeUpdate = currentTime;
                            let space = this.numberRefresh - this.timeRefresh >= 0 ? this.timeRefresh : this.numberRefresh;
                            this.numberSum += space;
                            this.sum.innerText = "TỔNG CỘNG:" + this.numberSum;
                            this.numberRefresh -= space;
                            this.refresh.innerText = this.numberRefresh;
                            if (this.numberRefresh == 0) {
                                this.count++;
                            }
                        }
                    } else if (this.count == 3) {
                        if (currentTime - this.lastTimeUpdate > 10) {
                            this.lastTimeUpdate = currentTime;
                            let space = this.numberFind - this.timeFind >= 0 ? this.timeFind : this.numberFind;
                            this.numberSum += space;
                            this.sum.innerText = "TỔNG CỘNG:" + this.numberSum;
                            this.numberFind -= space;
                            this.find.innerText = this.numberFind;
                            if (this.numberFind == 0) {
                                this.count++;
                            }
                        }
                    }
                } else {
                    this.isComplete = true;
                }
            }
        }
    }

    reset(level,
        arrayPokemon,
        algorithm,
        countFind,
        countRefresh,
        musicManager,
        progressBar,
        animationIntroLevel,
        scoreObject,
        numberFind,
        numberRefresh,
        numberScore,
        numberTime) {
        document.getElementById("winScreen").style.display = "block";
        this.level.innerText = level;
        if (level == 15) {
            this.button.innerText = "Chơi lại";
            this.button.onclick = function () {
                gameWorld.next();
            }
        } else {
            this.button.innerText = "Tiếp tục";
            this.button.onclick = function () {
                gameWorld.next();
            }
        }
        this.isComplete = false;
        this.lastTimeUpdate = 0;
        this.isShow = false;
        this.isMove = false;
        this.count = 0;
        // html
        this.titleLevel.style.animationName = "";
        this.level.style.animationName = "";
        this.titleScore.style.animationName = "";
        this.score.style.animationName = "";
        this.titleTime.style.animationName = "";
        this.time.style.animationName = "";
        this.titleRefresh.style.animationName = "";
        this.refresh.style.animationName = "";
        this.titleFind.style.animationName = "";
        this.find.style.animationName = "";
        this.button.style.animationName = "";
        // number
        this.titleFind.innerText = `Item tìm giúpx${numberFind}:`;
        this.titleRefresh.innerText = `Item hoán đổix${numberRefresh}:`;
        this.titleTime.innerText = `Thời gian còn lạix${numberTime}`;
        this.numberFind = numberFind * 5;
        this.numberRefresh = numberRefresh * 10;
        this.numberScore = numberScore;
        this.numberTime = numberTime * 2;
        this.find.innerText = this.numberFind;
        this.refresh.innerText = this.numberRefresh;
        this.score.innerText = this.numberScore;
        this.time.innerText = this.numberTime;
        this.numberSum = 0;
        this.timeFind = parseInt(this.numberFind / 50);
        this.timeRefresh = parseInt(this.numberRefresh / 50);
        this.timeTime = parseInt(this.numberTime / 50);
        this.timeScore = parseInt(this.numberScore / 50);
        if (this.timeFind == 0) {
            this.timeFind = 10;
        }
        if (this.timeRefresh == 0) {
            this.timeRefresh = 10;
        }
        if (this.timeTime == 0) {
            this.timeTime = 10;
        }
        if (this.timeScore == 0) {
            this.timeScore = 10;
        }
        let sum = this.numberFind + this.numberRefresh + this.numberScore + this.numberTime;
        scoreObject.score = sum;
    }

}
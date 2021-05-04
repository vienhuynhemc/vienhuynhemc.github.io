export class Score {

    // Điểm
    score;
    lastTimeUpdate;
    scoreNeedGoTo;
    scoreMaintain;
    scale;

    constructor(score) {
        this.score = score;
        this.lastTimeUpdate = 0;
        this.scoreNeedGoTo = -1;
        this.scoreMaintain = 0;
        this.scale = 0;
    }

    update(currentTime) {
        if (this.scoreNeedGoTo != -1) {
            let space = this.scoreNeedGoTo;
            if (this.scoreMaintain != 0) {
                space += this.scoreMaintain;
            }
            this.scale = parseInt(space / 50);
            if (this.scale == 0) {
                this.scale = 1;
            }
            this.scoreMaintain = space;
            this.scoreNeedGoTo = -1;
        }
        if (this.scoreMaintain != 0) {
            if (this.lastTimeUpdate == 0) {
                this.lastTimeUpdate = currentTime;
            }
            if (currentTime - this.lastTimeUpdate > 10) {
                this.lastTimeUpdate = currentTime;
                this.score += this.scale;
                this.scoreMaintain -= this.scale <= this.scoreMaintain ? this.scale : this.scoreMaintain;
            }
        }
    }

    draw() {
        document.getElementById("score").innerHTML = "ĐIỂM:" + this.score;
    }

}
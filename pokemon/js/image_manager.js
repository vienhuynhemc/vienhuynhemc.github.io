// Các thuộc tính ----------
// Danh sách các hình
export let images;
export let animationHide;
export let animationSnow;
export let animationHideLevel;
//--------------------------

// Chạy game ---------------
// Chạy khởi tạo
init();
//--------------------------

// Phương thức --------------------------
// Phương thức khởi tạo
function init() {
    images = [];
    for (let i = 0; i < 40; i++) {
        let img = document.createElement("img");
        img.src = `img/${i}.png`;
        images[i] = img;
    }
    // animation HIde
    let imgAnimationHide = document.createElement("img");
    imgAnimationHide.src = "img/animationHide.png";
    animationHide = imgAnimationHide;
    // animation snow
    let imgAnimationSnow = document.createElement("img");
    imgAnimationSnow.src = "img/animationSnow.png";
    animationSnow = imgAnimationSnow;
    // animation HIdeLevel
    let imgAnimationHideLevel = document.createElement("img");
    imgAnimationHideLevel.src = "img/animationHideLevel.png";
    animationHideLevel = imgAnimationHideLevel;
}
//---------------------------------------
class Button {
    constructor(posX, posY, w, h, callback) {
        this.posX = posX;
        this.posY = posY;
        this.w = w;
        this.h = h;
        this.callback = callback; // function to execute upon left clicking

        this.isMouseOver = false;
    }

    checkClick() {
        if(this.isMouseOver) {
            this.callback();
            return true;
        } else {
            return false;
        }
    }

    update(mousePosX, mousePosY) {
        if(mousePosX > this.posX &&
            mousePosX < this.posX + this.w &&
            mousePosY > this.posY &&
            mousePosY < this.posY + this.h) {
                this.isMouseOver = true;
            }
            else {
                this.isMouseOver = false;
            }
    }

    setPos(x, y) {
        this.posX = x;
        this.posY = y;
    }
}

class TrackingButton extends Button {
    constructor(obj, w, h, callback) {
        this.obj = obj;
        this.posX = 0;
        this.posY = 0;
        this.w = w;
        this.h = h;
        this.callback = callback;
    }
}
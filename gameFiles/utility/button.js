class Button {
    constructor(posX, posY, w, h, callback, text='') {
        this.posX = posX;
        this.posY = posY;
        this.w = w;
        this.h = h;
        this.callback = callback; // function to execute upon left clicking
        this.text = text;

        this.isMouseOver = false;
        this.isClickable = true; // used for hiding buttons from menus when the menu is closed, etc.
    }

    checkClick() {
        if(this.isClickable) {
            if(this.isMouseOver) {
                this.callback();
                return true;
            } else {
                return false;
            }
        }
    }

    update(mousePosX, mousePosY) {
        if(this.isClickable) {
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
    }

    setPos(x, y) {
        this.posX = x;
        this.posY = y;
    }
}

class CircularButton {
    constructor(posX, posY, diameter, callback) {
        this.posX = posX;
        this.posY = posY;
        this.d = diameter;
        this.callback = callback;

        this.isMouseOver = false;
        this.isClickable = true;
    }   

    update(mousePosX, mousePosY) {
        if(this.isClickable) {
            if(Math.sqrt((mousePosX - this.posX)*(mousePosX - this.posX) + (mousePosY - this.posY)*(mousePosY - this.posY)) < this.d/2) {
                this.isMouseOver = true;
            } else {
                this.isMouseOver = false;
            }
        }
    }

    checkClick() {
        if(this.isClickable) {
            if(this.isMouseOver) {
                this.callback();
                return true;
            } else {
                return false;
            }
        }
    }

    setPos(x, y) {
        this.posX = x;
        this.posY = y;
    }
}
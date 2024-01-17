class GUI {
    constructor(buttons = []) {
        this.buttons = buttons;
        this.selectedFleet = null;
    }

    checkClick() {
        // checks to see if a click should activate any buttons
        let clickedButton = false;
        for (let button of this.buttons) {
            if(button.checkClick()){
                clickedButton = true;
            } // checks for mouseOver within function
        }
        if(clickedButton == false && this.selectedFleet != null) {
            this.deselectFleet(); // deselect Fleet if clicked on blank screen (no button)
        }
    }

    update(mousePosX, mousePosY) {
        // updates isMouseOver for all UI elements
        for(let button of this.buttons) {
            button.update(mousePosX, mousePosY)
        }
    }

    addButton(button) {
        this.buttons.push(button);
    }

    selectFleet(fleet) {
        this.selectedFleet = fleet;
        console.log('Selected '+fleet.name);
    }

    deselectFleet() {
        console.log('Deselected '+this.selectedFleet.name);
        this.selectedFleet = null;
    }
}
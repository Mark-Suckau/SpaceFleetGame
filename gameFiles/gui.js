class GUI {
    constructor(canvasWidth, canvasHeight, buttons = []) {
        this.buttons = buttons;
        
        this.canWidth = canvasWidth;
        this.canHeight = canvasHeight;

        // selections
        this.selectedFleet = null;
        this.selectedSystem = null;

        // ** gui menus **
        // Star System Menu
        this.showStarSystemMenu = false; // should only show when a star system is selected
        this.starSystemMenuAnchorX = canvasWidth/2-150;
        this.starSystemMenuAnchorY = canvasHeight-200;
        this.starSystemMenuWidth = 300;
        this.starSystemMenuHeight = 200;
        this.starSystemMenuButtons = [
            new Button(this.starSystemMenuAnchorX+10, this.starSystemMenuAnchorY+10, 100, 30, ()=>{if(this.selectedFleet && this.selectedSystem) 
                {this.selectedFleet.beginTravel(this.selectSystem)} else {alert("Please Select a Fleet and a destination Star System")}}, 'Travel to System')
            ]

        for(let button of this.starSystemMenuButtons) {
            this.addButton(button);
        }

        // Fleet Menu
        this.showFleetMenu = false; // should only show when a fleet is selected
        this.fleetMenuAnchorX = canvasWidth-150;
        this.fleetMenuAnchorY = canvasHeight/2-100;
        this.fleetMenuWidth = 150;
        this.fleetMenuHeight = 200;
        this.fleetMenuButtons = [];

        for(let button of this.fleetMenuButtons) {
            this.addButton(button);
        }
    }

    checkClick() {
        // checks to see if a click should activate any buttons
        let clickedButton = false;
        for (let button of this.buttons) {
            if(button.checkClick()){
                clickedButton = true;
            } // checks for mouseOver within function
        }
        if(clickedButton == false) {
            // deselect all if clicked on blank screen (no button)
            if(this.selectedFleet != null) {
                this.deselectFleet();
            }
            if(this.selectedSystem != null) {
                this.deselectSystem();
            }
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
        this.deselectFleet(); // clear last selection
        this.selectedFleet = fleet;
        fleet.guiSelect();
        this.openFleetMenu();
    }
    
    deselectFleet() {
        if(this.selectedFleet) {
            this.selectedFleet.guiDeselect();
            this.selectedFleet = null;
            this.closeFleetMenu();
        }
    }
    
    selectSystem(system) {
        // selects a star system
        this.deselectSystem();
        this.selectedSystem = system;
        system.guiSelect(); // lets the star system know it's currently selected (for highlighting purposes)
        this.openStarSystemMenu();
    }
    
    deselectSystem() {
        // deselects current star system
        if(this.selectedSystem) {
            this.closeStarSystemMenu();
            this.selectedSystem.guiDeselect();
            this.selectedSystem = null;
        }
    }
    
    display() {
        // handles all rendering of gui within this function, must be executed in draw() since it uses p5.js functions
        if(this.showStarSystemMenu) {
            this.displayStarSystemMenu();
        }
        if(this.showFleetMenu) {
            this.displayFleetMenu();
        }
    }

    openStarSystemMenu() {
        this.showStarSystemMenu = true;
        for(let button of this.starSystemMenuButtons) {
            button.isClickable = true;
        }
    }
    
    closeStarSystemMenu() {
        this.showStarSystemMenu = false;
        for(let button of this.starSystemMenuButtons) {
            button.isClickable = false;
        }
    }
    
    displayStarSystemMenu() {
        // contains p5.js code, must be run inside draw() function
        fill(222,233,255);
        strokeWeight(4);
        stroke(0);
        rect(this.starSystemMenuAnchorX, this.starSystemMenuAnchorY, this.starSystemMenuWidth, this.starSystemMenuHeight);
        textAlign(RIGHT, TOP);
        text(this.selectedSystem.name, this.starSystemMenuAnchorX + this.starSystemMenuWidth-10, this.starSystemMenuAnchorY+10);

        for(let button of this.starSystemMenuButtons) {
            if(button.isMouseOver) {
                stroke(90, 90, 200);
                fill(94,139,214);
            } else {
                stroke(200);
                fill (214,217,217);
            }
            rect(button.posX, button.posY, button.w, button.h);
            noStroke();
            fill(0);
            textAlign(LEFT, TOP);
            text(button.text, button.posX, button.posY);
        }
    }

    openFleetMenu() {
        this.showFleetMenu = true;
        for(let button of this.fleetMenuButtons) {
            button.isClickable = true;
        }
    }

    closeFleetMenu() {
        this.showFleetMenu = false;
        for(let button of this.fleetMenuButtons) {
            button.isClickable = false;
        }
    }

    displayFleetMenu() {
        // contains p5.js code, must be run inside draw() function
        fill(222,233,255);
        strokeWeight(4);
        stroke(0);
        textAlign(LEFT, TOP);
        rect(this.fleetMenuAnchorX, this.fleetMenuAnchorY, this.fleetMenuWidth, this.fleetMenuHeight);
        
        // displaying stats
        let increment = 10
        text(this.selectedFleet.name, this.fleetMenuAnchorX+10, this.fleetMenuAnchorY+increment);
        noStroke();
        fill(0);
        increment += 20;
        text("Ships: "+this.selectedFleet.ships, this.fleetMenuAnchorX+10, this.fleetMenuAnchorY+increment);
        increment += 20;
        text("DPS: "+this.selectedFleet.dps, this.fleetMenuAnchorX+10, this.fleetMenuAnchorY+increment);
        increment += 20;
        text("Type: "+this.selectedFleet.fleetType, this.fleetMenuAnchorX+10, this.fleetMenuAnchorY+increment);

        // displaying buttons
        for(let button of this.fleetMenuButtons) {
            if(button.isMouseOver) {
                stroke(90, 90, 200);
                fill(94,139,214);
            } else {
                stroke(200);
                fill (214,217,217);
            }
            rect(button.posX, button.posY, button.w, button.h);
        }
    }
}
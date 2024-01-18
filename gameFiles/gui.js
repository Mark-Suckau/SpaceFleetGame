class GUI {
    constructor(canvasWidth, canvasHeight, battleManager, buttons = []) {
        // other helper classes
        this.battleManager = battleManager;

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
            new Button(this.starSystemMenuAnchorX+10, this.starSystemMenuAnchorY+10, 100, 30, ()=>
            {
                if(this.selectedFleet && this.selectedSystem) 
                {
                    if(this.selectedFleet.playerControllable) {
                        this.selectedFleet.beginTravel(this.selectedSystem)
                    } else {
                        alert("This fleet is not controllable by the player");
                    }
                } else 
                {
                    alert("Please select a fleet and a destination Star System");
                }
            }, true, 'Travel to System')
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
        
        let increment = 10;
        textAlign(LEFT, TOP);
        text(this.selectedSystem.name, this.starSystemMenuAnchorX + this.starSystemMenuWidth/2, this.starSystemMenuAnchorY+increment);
        
        // display battle progress if battle is taking place
        if(this.battleManager.isBattling(this.selectedSystem)) {
            increment += 20;
            noFill();
            stroke(0);
            strokeWeight(3);
            rect(this.starSystemMenuAnchorX -10 + this.starSystemMenuWidth/2, this.starSystemMenuAnchorY + increment, this.starSystemMenuWidth/2, 16);
            noStroke();
            const battleWinningPercent = this.battleManager.getBattle(this.selectedSystem).winningPercent;
            if(battleWinningPercent > 0) fill (20, 170, 20);
            if(battleWinningPercent < 0) fill(170, 20, 20);
            rect(this.starSystemMenuAnchorX -10 + this.starSystemMenuWidth/2 + this.starSystemMenuWidth/4, this.starSystemMenuAnchorY + increment, 
                (this.starSystemMenuWidth/4) * this.battleManager.getBattle(this.selectedSystem).winningPercent, 16);
        }

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
            textAlign(LEFT, CENTER);
            text(button.text, button.posX, button.posY + button.h/2);
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
        
        let status = "Idling";
        let progress = -1;
        if (this.selectedFleet.isMoving) {
            status = "Travelling";
            progress = this.selectedFleet.movementProgress * 100;
        } else if (this.selectedFleet.isBattling) {
            status = "Battling";
        }

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
        increment += 20;
        text("Status: "+status, this.fleetMenuAnchorX+10, this.fleetMenuAnchorY+increment);
        // display loading bar if moving
        if(this.selectedFleet.isMoving) {
            increment += 20;
            noFill();
            stroke(0);
            strokeWeight(3);
            rect(this.fleetMenuAnchorX + 10, this.fleetMenuAnchorY + increment, this.fleetMenuWidth-20, 16);
            noStroke();
            fill(100, 20, 20);
            rect(this.fleetMenuAnchorX + 10, this.fleetMenuAnchorY + increment, (this.fleetMenuWidth-20) * this.selectedFleet.movementProgress, 16);
        }

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
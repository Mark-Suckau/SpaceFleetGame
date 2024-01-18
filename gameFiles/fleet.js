/* potential Bug: if moving along a path and after calculation of path, it is made impassible, 
then it will still move along it since it only does the calculation for valid path once, fix using a validDestination() check in update when travelling*/
// uses Button.js

class Fleet {
    constructor(name, ships, dps, currentSystem, _fleetType, gameGUI, gameMap, battleManager) {
        // general stats
        this.name = name;
        this.ships = ships; // amount of ships in fleet
        this.dps = dps; // average dps of all ships in fleet
        this.fleetType = _fleetType // fleetType according to constants.js
      
        this.playerControllable = false;
        if(this.fleetType == fleetType.PLAYER) {
            this.playerControllable = true;
        }

        // outside helper classes
        this.gameMap = gameMap;
        this.battleManager = battleManager;

        // keeping track of movement
        this.isMoving = false; // MAIN STATE
        this.systemReached = false;
        this.currentSystem = currentSystem; // Obj reference to current star system
        this.movementPath = []; // holds star systems along movement path [0]=next one [length] = last node (aka. destination)
        this.movementProgress = 0; // percent value (0-1) of how far along fleet is from last node to next node along path
        this.movementSpeed = 0.01 // percent value (0-1) of how many updates it takes to reach a destination

        // keeping track of battle
        this.isBattling = false; // MAIN STATE

        // keeping track of displaying as text on gui
        this.displayPosX = 0;
        this.displayPosY = 0;
        this.guiSelected = false; // displays different color for text when selected vs not
        this.displayButton = new Button(this.displayPosX, this.displayPosY, 150, 12, ()=>{gameGUI.selectFleet(this)});
    }
  
    setDisplayPos(displayPosX, displayPosY) {
        // used to update and track position to be displayed in gui
        this.displayPosX = displayPosX;
        this.displayPosY = displayPosY;
        this.displayButton.setPos(displayPosX, displayPosY);
    }

    update() {
        // TRAVEL
        if(this.isMoving) {
            // if not yet reached next node, continue moving to next node
            if (this.movementProgress >= 1 || this.movementProgress + this.movementSpeed >= 1) {
                this.movementProgress = 0;
                this.systemReached = true;
            } else {
                this.movementProgress += this.movementSpeed;
                this.systemReached = false;
            }

            if(this.systemReached) {
                this.currentSystem.removeFleet(this); // remove this fleet from last systems fleet registry before adding self to next system
                this.currentSystem = this.movementPath.shift();
                this.currentSystem.addFleet(this);

                if(this.movementPath.length == 0) {
                    // if at destination
                    this.isMoving = false;
                    // checks if necessary to start or join battle
                    if(this.currentSystem.hasFleetType(fleetType.ENEMY)) {
                        if(!this.battleManager.isBattling(this.currentSystem)) {
                            this.battleManager.initiateBattle(this.currentSystem);
                        } else {
                            this.battleManager.joinBattle(this, this.currentSystem);
                        }
                    }
                }
            }
        }
    }

    beginTravel(toSystem) {
        // check if currently occupied doing something else
        if(this.isBattling) {
            console.log("Fleet " + this.name + " cannot move, currently battling");
        } else {
            this.movementPath = this.gameMap.findPath(this.currentSystem, toSystem);
            if(this.movementPath.length > 0) {
                this.isMoving = true;
                this.movementProgress = 0;
                this.systemReached = false;
            }
        }
    }
  
    beginBattling() {
        if(this.isMoving) {
            console.log("Fleet " + this.name + " cannot battle, currently moving");
        } else {
            this.isBattling = true;
        }
    }

    guiSelect() {
        this.guiSelected = true;
    }

    guiDeselect() {
        this.guiSelected = false;
    }
  }
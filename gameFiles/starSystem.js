// uses CircularButton from button.js
// uses displayStarSystem.RADIUS from constants.js

class StarSystem {
  constructor(posX, posY, name, creditsProduced, gameGUI) {
    this.posX = posX;
    this.posY = posY;
    this.radius = displayStarSystem.RADIUS;
    
    this.name = name;
    this.creditsProduced = creditsProduced; // credits produced every 10 update cycles (for now 1 frame = 1 update cycle)
    this.connectedSystems = []; // contains objs in format {node: systemObj, cost: weight to be used in A* pathfinding}

    // keeping track of fleets in system
    this.fleets = [];

    // keeping track of battle in system
    this.hasBattle = false;

    // display
    this.guiSelected = false; // keeps track of if this system is currently selected by gui (used for highlighting, etc.)
    this.displayButton = new CircularButton(posX, posY, this.radius, () => {gameGUI.selectSystem(this)});
  }

  connectTo(system, cost=1) {
    this.connectedSystems.push({node: system, cost: cost});
    system.connectedSystems.push({node: this, cost: cost});
  }

  addFleet(fleet) {
    this.fleets.push(fleet);
  }

  removeFleet(rmvFleet) {
    let index = -1;
    for(let i = 0; i < this.fleets.length; i++) {
      if(this.fleets[i] == rmvFleet) {
        index = i;
        break;
      }
    }
    if(index > -1) {
      this.fleets.splice(index, 1);
    }
  }

  guiSelect() {
    this.guiSelected = true;
  }

  guiDeselect() {
    this.guiSelected = false;
  }
}
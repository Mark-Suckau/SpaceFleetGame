class StarSystem {
  constructor(xPos, yPos, name, creditsProduced) {
    this.posX = xPos;
    this.posY = yPos;
    
    this.name = name;
    this.creditsProduced = creditsProduced; // credits produced every 10 update cycles (for now 1 frame = 1 update cycle)
    this.connectedSystems = [];

    // keeping track of fleets in system
    this.fleets = [];

    // keeping track of battle in system
    this.hasBattle = false;
  }

  connectTo(system) {
    this.connectedSystems.push(system);
    system.connectedSystems.push(this);
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
}
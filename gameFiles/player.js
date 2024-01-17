// uses starSystem.js

class Player {
    constructor(credits) {
      this.credits = credits;
      this.fleets = [];
      this.capturedSystems = [];
    }
  
    sendFleet(fleet, toSystem) {
        fleet.beginTravel(toSystem);
        
        // check for battle in toSystem
    }
  }
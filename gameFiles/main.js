let map;
let gui;

function setup() {
    createCanvas(1000, 1000);
    gui = new GUI();
    map = new GameMap(instantiateSystems(gui));
}

function instantiateSystems(gui) {
    let starSystems = [];
    starSystems[0] = new StarSystem(50, 70, 'Galapagos', 5);
    starSystems[1] = new StarSystem(160, 100, 'Andromeda', 5);
    starSystems[2] = new StarSystem(360, 110, 'Battom', 5);
    starSystems[3] = new StarSystem(320, 330, 'Centrialis', 15);
    starSystems[4] = new StarSystem(60, 360, 'Battom', 5);
    
    starSystems[0].connectTo(starSystems[1]);
    starSystems[1].connectTo(starSystems[2]);
    starSystems[1].connectTo(starSystems[3]);
    starSystems[3].connectTo(starSystems[4]);

    let fleets = [];
    fleets[0] = new Fleet('Ultra Killers', 20, 50, starSystems[3], fleetType.PLAYER, gui);
    fleets[1] = new Fleet('Mystery Hunters', 30, 70, starSystems[3], fleetType.PLAYER, gui);
    
    starSystems[3].addFleet(fleets[0]);
    starSystems[3].addFleet(fleets[1]);
    
    // adding buttons from fleets to gui
    for (let fleet of fleets) {
        gui.addButton(fleet.displayButton);
    }

    return starSystems;
}

function draw() {
    
    // display gameMap
    for(system of map.starSystems) {
        // display systems
        fill(255, 255, 0);
        stroke(0);
        strokeWeight(1);
        ellipse(system.posX, system.posY, 15);
        // display lines connecting systems
        // note: currently drawing line twice for each pair of connected systems
        for(connectedSystem of system.connectedSystems) {
            strokeWeight(2);
            stroke(200);
            line(system.posX, system.posY, connectedSystem.posX, connectedSystem.posY);
        }
        // display fleets as text and button connected to that fleet in star system
        for (let i = 0; i < system.fleets.length; i++) {
            system.fleets[i].setDisplayPos(system.posX - 75, (system.posY - i * 16) - 20);
            
            // displays button for fleet
            strokeWeight(3);
            if(system.fleets[i].displayButton.isMouseOver) {
                stroke(90, 90, 200);
                fill(100, 100, 255);
            } else {
                stroke(200);
                fill (220);
            }
            rect(system.fleets[i].displayButton.posX, system.fleets[i].displayButton.posY, system.fleets[i].displayButton.w, system.fleets[i].displayButton.h);
            
            // displays fleet name
            strokeWeight(4);
            noStroke();
            fill(0);
            textAlign(CENTER, TOP);
            text(system.fleets[i].name, system.fleets[i].displayPosX + 75, system.fleets[i].displayPosY);
        }
    }

    gui.update(mouseX, mouseY)
}

function mouseClicked() {
    gui.checkClick();
}
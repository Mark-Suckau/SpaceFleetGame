let map;
let gui;
let battleManager;
let frameCount;

function setup() {
    const width = 1000;
    const height = 800;
    frameCount = 0;
    createCanvas(width, height);
    map = new GameMap();
    battleManager = new BattleManager(map);
    gui = new GUI(width, height, battleManager);
    instantiateGame(gui, map, battleManager);
}

function instantiateGame(gui, map) {
    let starSystems = [];
    // making star systems
    starSystems[0] = new StarSystem(50, 70, 'Galapagos', 5, gui);
    starSystems[1] = new StarSystem(160, 100, 'Andromeda', 5, gui);
    starSystems[2] = new StarSystem(360, 110, 'Battom', 5, gui);
    starSystems[3] = new StarSystem(320, 330, 'Centrialis', 15, gui);
    starSystems[4] = new StarSystem(60, 360, 'Neroma', 5, gui);
    starSystems[5] = new StarSystem(450, 500, 'Hugabalu', 5, gui);
    starSystems[6] = new StarSystem(600, 300, 'Fractular', 5, gui);
    starSystems[7] = new StarSystem(650, 70, 'Highton', 5, gui);
    starSystems[8] = new StarSystem(800, 110, 'Fedra', 5, gui);
    starSystems[9] = new StarSystem(40, 590, 'Birtin', 5, gui);
    starSystems[10] = new StarSystem(630, 560, 'Veral', 5, gui);
    starSystems[11] = new StarSystem(830, 460, 'Jera', 5, gui);
    starSystems[12] = new StarSystem(880, 30, 'Ciri', 5, gui);
    
    // connecting star systems
    starSystems[0].connectTo(starSystems[1]);
    starSystems[1].connectTo(starSystems[3]);
    starSystems[2].connectTo(starSystems[1]);
    starSystems[3].connectTo(starSystems[4]);
    starSystems[4].connectTo(starSystems[5]);
    starSystems[5].connectTo(starSystems[6]);
    starSystems[5].connectTo(starSystems[7]);
    starSystems[3].connectTo(starSystems[7]);
    starSystems[4].connectTo(starSystems[9]);
    starSystems[9].connectTo(starSystems[10]);
    starSystems[10].connectTo(starSystems[6]);
    starSystems[6].connectTo(starSystems[8]);
    starSystems[10].connectTo(starSystems[11]);
    starSystems[7].connectTo(starSystems[12]);

    // making fleets
    let fleets = [];
    fleets[0] = new Fleet('Ultra Killers', 20, 50, starSystems[7], fleetType.PLAYER, gui, map, battleManager);
    starSystems[7].addFleet(fleets[0]);

    fleets[1] = new Fleet('Mystery Hunters', 30, 70, starSystems[3], fleetType.PLAYER, gui, map, battleManager);
    starSystems[3].addFleet(fleets[1]);
    
    fleets[2] = new Fleet('Guru Gyros', 10, 30, starSystems[4], fleetType.PLAYER, gui, map, battleManager);
    starSystems[4].addFleet(fleets[2]);
    
    fleets[3] = new Fleet('Mana Minions', 10, 30, starSystems[1], fleetType.PLAYER, gui, map, battleManager);
    starSystems[1].addFleet(fleets[3]);
    
    fleets[4] = new Fleet('Devious Dogs', 30, 50, starSystems[2], fleetType.ENEMY, gui, map, battleManager);
    starSystems[2].addFleet(fleets[4]);

    fleets[5] = new Fleet('Burkin Bags', 30, 50, starSystems[10], fleetType.ENEMY, gui, map, battleManager);
    starSystems[10].addFleet(fleets[5]);

    fleets[6] = new Fleet('Fabolous Five', 5, 150, starSystems[10], fleetType.ENEMY, gui, map, battleManager);
    starSystems[10].addFleet(fleets[6]);

    fleets[7] = new Fleet('Marauders', 40, 50, starSystems[3], fleetType.PLAYER, gui, map, battleManager);
    starSystems[3].addFleet(fleets[7]);
    

    // adding buttons from fleets to gui and gameMap
    for (const fleet of fleets) {
        gui.addButton(fleet.displayButton);
    }

    // adding buttons from star systems to gui
    for(const system of starSystems) {
        gui.addButton(system.displayButton);
    }

    map.setStarSystems(starSystems);
    map.setFleets(fleets)
}


function draw() {
    frameCount++;
    background(255);
    // display gameMap
    for(system of map.starSystems) {
        // display systems
        if(system.guiSelected || system.displayButton.isMouseOver) {
            fill(191,190,252);
            stroke(150,150,220);
            strokeWeight(2);            
        } else {
            fill(255, 255, 0);
            stroke(0);
            strokeWeight(1);
        }
        ellipse(system.posX, system.posY, 15);

        // display lines connecting systems
        // note: currently drawing line twice for each pair of connected systems
        for(connectedSystem of system.connectedSystems) {
            const connectedSystemNode = connectedSystem.node;
            strokeWeight(2);
            stroke(200);
            line(system.posX, system.posY, connectedSystemNode.posX, connectedSystemNode.posY);
        }
        // display fleets as text and button connected to that fleet in star system
        for (let i = 0; i < system.fleets.length; i++) {
            system.fleets[i].setDisplayPos(system.posX - 75, (system.posY - i * 16) - 20);
            
            // displays button for fleet, displays differently based on what fleetType
            strokeWeight(3);
            if(system.fleets[i].fleetType == fleetType.PLAYER) {
                if(system.fleets[i].displayButton.isMouseOver || system.fleets[i].guiSelected) {
                    stroke(90, 90, 200);
                    fill(94,139,214);
                } else {
                    stroke(200);
                    fill (220);
                }
            } else if (system.fleets[i].fleetType == fleetType.ENEMY) {
                if(system.fleets[i].displayButton.isMouseOver || system.fleets[i].guiSelected) {
                    stroke(90, 90, 200);
                    fill(94,139,214);
                } else {
                    stroke(200,30,15);
                    fill (255,74,36);
                }
                
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

    gui.display();
    gui.update(mouseX, mouseY)

    for (fleet of map.fleets) {
        fleet.update();
    }

    battleManager.update(frameCount);
}

function mouseClicked() {
    gui.checkClick();
}
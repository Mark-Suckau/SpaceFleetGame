class GameMap {
    constructor() {
        // calling starSystems nodes for sake of clarity in pathfinding context
        this.starSystems = [];
        this.fleets = []; // keeps track of all fleets in game (for updating them)
    }

    setStarSystems(starSystems) {
        this.starSystems = starSystems
    }

    setFleets(fleets) {
        this.fleets = fleets;
    }

    removeFleet(fleet) {
        this.fleets.splice(this.fleets.indexOf(fleet), 1);
    }

    // PATHFINDING With A*
    findPath(startSystem, destinationSystem) {
        // uses A* algorithm for pathfinding

        const openSet = [startSystem];
        const closedSet = new Set();
        
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(startSystem, 0);
        fScore.set(startSystem, this.calcHeuristic(startSystem, destinationSystem));

        while(openSet.length > 0) {
            const currentNode = this.getLowestFScoreNode(openSet, fScore);
            
            if(currentNode === destinationSystem) {
                let path = this.reconstructPath(gScore, currentNode);
                path.shift();
                return path;
            }
            
            // remove current node from openSet and move to closed set since it has been checked
            openSet.splice(openSet.indexOf(currentNode), 1);
            closedSet.add(currentNode);
            
            
            for (const connectedNodeObj of currentNode.connectedSystems) {
                const connectedNode = connectedNodeObj.node;
                
                // if neighbor system already checked, jump to checking next neighbor system
                if(closedSet.has(connectedNode)) {
                    continue;
                }
                
                const tentatitveGScore = gScore.get(currentNode) + connectedNodeObj.cost;
                
                if(!openSet.includes(connectedNode) || tentatitveGScore < gScore.get(connectedNode)) {
                    gScore.set(connectedNode, tentatitveGScore);
                    fScore.set(connectedNode, tentatitveGScore + this.calcHeuristic(connectedNode.posX, connectedNode.posY, destinationSystem.posX, destinationSystem.posY));

                    if(!openSet.includes(connectedNode)) {
                        openSet.push(connectedNode);
                    }
                }
            }
        }
        // if couldnt find path, return null
        return null;
    }

    calcHeuristic(fromNodePosX, fromNodePosY, destinationNodePosX, destinationNodePosY) {
        // returns straight line distance between fromNode and destinationNode
        return Math.sqrt((fromNodePosX-destinationNodePosX)**2 + (fromNodePosY-destinationNodePosY)**2);
    }

    getLowestFScoreNode(nodes, fScore) {
        let minNode = nodes[0];
        
        for(let i = 1; i < nodes.length; i++) {
            const node = nodes[i];
            if(fScore.get(node) < fScore.get(minNode)) {
                minNode = node;
            }
        }

        return minNode;
    }

    reconstructPath(gScore, currentNode) {
        // uses connectedSystems from starSystem.js
        const path = [currentNode];

        let safetyCounter = 0;

        while(gScore.has(currentNode)) {
            safetyCounter++;
            if(safetyCounter > 100000) {
                console.error('while loop stuck infinitely repeating while reconstructing path');
                break;
            }

            // finds lowest g-value neighbouring node
            const neighborObjs = currentNode.connectedSystems;
            let minGValueNeighbor = currentNode; 

            for(const neighborObj of neighborObjs) {
                const neighbor = neighborObj.node;
                if(gScore.has(neighbor)) {
                    if(gScore.get(neighbor) < gScore.get(minGValueNeighbor)) {
                        minGValueNeighbor = neighbor;
                    }
                }
            }

            if (minGValueNeighbor === currentNode) {
                break;
            } else {
                path.unshift(minGValueNeighbor)
                currentNode = minGValueNeighbor;
            }
        }

        return path;
    }
}
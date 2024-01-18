class BattleManager {
    constructor(gameMap) {
        // external helper classes
        this.map = gameMap;

        this.battlingSystems = new Map();
    }

    update(frameCount) {
        if(frameCount % 60 == 0) {
            for(let [battleKey, battleData] of this.battlingSystems) {
                const winning = battleData.playerBattlePower * Math.random() - battleData.enemyBattlePower * Math.random();
                if(Math.abs(battleData.winning) >= battleData.maxWinning || Math.abs(battleData.winning) + winning >= battleData.maxWinning) {
                // battleKey is the star system where the battle is taking place
                this.concludeBattle(battleKey);
            } else {
                battleData.winning += winning
                if(battleData.winning != 0) {
                        battleData.winningPercent = battleData.winning / battleData.maxWinning;
                    } else {
                        battleData.winningPercent = 0;
                    }
                }
            }
        }
    }

    initiateBattle(starSystem) {
        let playerBattlePower = 0;
        let enemyBattlePower = 0;
        
        for(let fleet of starSystem.fleets) {
            fleet.beginBattling();
            if(fleet.fleetType == fleetType.PLAYER) {
                playerBattlePower += fleet.ships * fleet.dps;
            }
            if(fleet.fleetType == fleetType.ENEMY) {
                enemyBattlePower += fleet.ships * fleet.dps
            }
        }
        
        
        let winning = 0; // negative value means enemy won, positive means player won at battle conclusion
        let maxWinning = Math.abs(playerBattlePower - enemyBattlePower) * 5; // winning value required to actually win
        let winningPercent = 0;

        let battleData = {
            winning: winning,
            maxWinning: maxWinning,
            winningPercent: winningPercent,

            playerBattlePower: playerBattlePower, 
            enemyBattlePower: enemyBattlePower
        }

        this.battlingSystems.set(starSystem, battleData);
        
        return battleData;
    }

    joinBattle(fleet, starSystem) {
        let battleData = null;
        if(this.battlingSystems.has(starSystem)) {
            fleet.beginBattling();
            battleData = this.battlingSystems.get(starSystem);

            if(fleet.fleetType == fleetType.PLAYER) {
                battleData.playerBattlePower += fleet.ships * fleet.dps;
            } 
            else if (fleet.fleetType == fleetType.ENEMY) {
                battleData.enemyBattlePower += fleet.ships * fleet.dps;
            }
            battleData.maxWinning = Math.abs(battleData.playerBattlePower - battleData.enemyBattlePower) * 5;

        } else {
            console.warn("Star system has no battle going on, but joinBattle() was still called by "+ fleet);
            return null;
        }

        return battleData;
    }

    concludeBattle(starSystem) {
        let battleData = this.getBattle(starSystem);

        for(fleet of starSystem.fleets) {
            if(fleet.fleetType == fleetType.PLAYER) {
                if(battleData.winning < 0) {
                    // remove fleets from game
                    starSystem.removeFleet(fleet);
                    map.removeFleet(fleet);
                } else {
                    // return fleets to idle position
                    fleet.isBattling = false;
                }
            }
            if(fleet.fleetType == fleetType.ENEMY) {
                if(battleData.winning > 0) {
                    // remove fleets from game
                    starSystem.removeFleet(fleet);
                    map.removeFleet(fleet);
                } else {
                    // return fleets to idle position
                    fleet.isBattling = false;
                }
            }
        }

        this.battlingSystems.delete(starSystem);
    }
    
    isBattling(starSystem) {
        return this.battlingSystems.has(starSystem);
    }

    getBattle(starSystem) {
        if(this.isBattling(starSystem)) {
            return this.battlingSystems.get(starSystem);
        }
        console.warn("Attempted to retrieve battle data, but there is no battle at "+starSystem);
        return null;
    }
}
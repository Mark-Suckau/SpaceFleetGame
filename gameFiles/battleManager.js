class battleManager {
    constructor() {
        
    }

    initiateBattle(starSystem) {
        let playerShipCount = 0;
        let playerTotalDPS = 0;

        let enemyShipCount = 0;
        let enemyTotalDPS = 0;
        
        for(let fleet of starSystem.playerFleets) {
            fleet.initiateBattle();
            if(fleet.fleetType == fleetType.PLAYER) {
                playerShipCount += fleet.ships;
                playerTotalDPS += fleet.dps;
            }
            if(fleet.fleetType == fleetType.ENEMY) {
                enemyShipCount += fleet.ships
                enemyTotalDPS += fleet.dps;
            }
        }
    
        let playerBattlePower = playerShipCount * playerTotalDPS
        let enemyBattlePower = enemyShipCount * enemyTotalDPS
        return [playerBattlePower, enemyBattlePower];
    }
}
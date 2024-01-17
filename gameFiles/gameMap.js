class GameMap {
    constructor(starSystems) {
        this.starSystems = starSystems;
    }

    findPath(fromSystem, toSystem) {
        // use DFS with checking for backtracking since map layout can be a graph
        // return list with path of all systems from fromSystem to the toSystem in array (0: next in path, last:destination)
    }
}
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }
    // 1. Add a Node (Vertex)
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, new Set()); // Initialize with empty Set
        }
    }
    // 2. Add a Connection (Edge)
    // This is an "Undirected" graph (connection goes both ways)
    addEdge(vertex1, vertex2) {
        // Ensure both vertices exist first
        if (!this.adjacencyList.has(vertex1))
            this.addVertex(vertex1);
        if (!this.adjacencyList.has(vertex2))
            this.addVertex(vertex2);
        this.adjacencyList.get(vertex1).add(vertex2);
        this.adjacencyList.get(vertex2).add(vertex1);
    }
    // 3. Remove a Connection
    removeEdge(vertex1, vertex2) {
        this.adjacencyList.get(vertex1)?.delete(vertex2);
        this.adjacencyList.get(vertex2)?.delete(vertex1);
    }
    // 4. Remove a Node entirely
    removeVertex(vertex) {
        if (!this.adjacencyList.has(vertex))
            return;
        // First, go to every neighbor and remove the connection to this vertex
        for (let neighbor of this.adjacencyList.get(vertex)) {
            this.adjacencyList.get(neighbor).delete(vertex);
        }
        // Finally, delete the vertex itself
        this.adjacencyList.delete(vertex);
    }
    // Debug: visuals
    print() {
        for (let [vertex, edges] of this.adjacencyList) {
            console.log(`${vertex} -> ${[...edges].join(", ")}`);
        }
    }
}
// --- USAGE: Building an Airport Network ---
const flights = new Graph();
flights.addVertex("JFK");
flights.addVertex("LHR");
flights.addVertex("TOKYO");
// Adding routes (Edges)
flights.addEdge("JFK", "LHR");
flights.addEdge("LHR", "TOKYO");
flights.addEdge("JFK", "TOKYO");
flights.print();
export {};
// Output:
// JFK -> LHR, TOKYO
// LHR -> JFK, TOKYO
// TOKYO -> LHR, JFK

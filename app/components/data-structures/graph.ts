import { Vertex } from "./vertex";

export interface GraphInterface {
    vertices: Array<Vertex>;
    isWeighted: boolean;
    isDirected: boolean;
}
export class Graph implements GraphInterface {
    vertices: Array<Vertex>;
    isWeighted: boolean;
    isDirected: boolean;

    constructor(isWeighted: boolean = false, isDirected: boolean = false) {
        this.vertices = [];
        this.isWeighted = isWeighted;
        this.isDirected = isDirected;
    }

    addVertex(data: any) {
        const newVertex = new Vertex(data);
        this.vertices.push(newVertex);
        return newVertex;
    }

    addRandomVertex(): Vertex {
        const x: number = Math.floor(Math.random() * 600);
        const y: number = Math.floor(Math.random() * 600);
        const newVertex = new Vertex({x, y});
        const vertexExists = this.vertexExists(newVertex.data);
        if (vertexExists) {
            return this.addRandomVertex();
        }
        this.vertices.push(newVertex);
        return newVertex;
    }

    removeRandomVertex(): boolean {
        if (this.vertices.length === 0) {
            return false;
        }
        const vertex = this.vertices[Math.floor(Math.random() * this.vertices.length)];
        this.removeVertex(vertex);
        return true;
    }

    removeVertex(vertex: Vertex) {
        // Get all edges that point to this vertex
        const filteredEdges = this.vertices.map(v => v.edges.filter(edge => edge.end.x === vertex.data.x && edge.end.y === vertex.data.y));
        // Remove all edges that point to this vertex
        filteredEdges.forEach(edges => edges.forEach(edge => {
            const start = this.getVertex(edge.start);
            const end = this.getVertex(edge.end);
            if (start && end) {
                this.removeEdge(start, end);
            }
        }));
        // Remove vertex
        this.vertices = this.vertices.filter(v => v !== vertex);
    }

    vertexExists(data: Vertex['data']) {
        const comparisonFunction = (vertex: Vertex) => vertex.data === data;
        return this.vertices.some(comparisonFunction);
    }

    getVertex(data: Vertex['data']): Vertex | undefined {
        const comparisonFunction = (vertex: Vertex) => vertex.data.x === data.x && vertex.data.y === data.y;
        return this.vertices.find(comparisonFunction);
    }

    updateVertex(vertex: Vertex, data: Vertex['data']) {
        // Find all edges that point to this vertex
        const filteredEdges = this.vertices.map(v => v.edges.filter(edge => edge.end.x === vertex.data.x && edge.end.y === vertex.data.y));
        // Remove all edges that point to this vertex
        if (filteredEdges.length > 0) {
            filteredEdges.forEach(edges => edges.forEach(edge => {
                const start = this.getVertex(edge.start);
                const end = this.getVertex(edge.end);
                if (start && end) {
                    this.removeEdge(start, end);
                }
            }));
        }
        // Update vertex data
        vertex.data = data;
        // Add edges back
        if (filteredEdges.length > 0) {
            filteredEdges.forEach(edges => edges.forEach(edge => {
                const start = this.getVertex(edge.start);
                const end = vertex;
                if (start && end) {
                    this.addEdge(start, end, edge.weight);
                }
            }));
        }
        return vertex;
    }

    getNearestVertex = (x: number, y: number, threshold: number = Infinity): Vertex | null => {
        let min_distance = Infinity;
        let nearestVertex = null;
        for (const vertex of this.vertices) {
          const distance = Math.sqrt(Math.pow(vertex.data.x - x, 2) + Math.pow(vertex.data.y - y, 2));
          if (distance < min_distance && distance < threshold) {
            min_distance = distance;
            nearestVertex = vertex;
          }
        }
        return nearestVertex;
    }

    addEdge(vertex1: Vertex, vertex2: Vertex, weight: number | null) {
        const edgeWeight = this.isWeighted ? weight : null;
        if (vertex1 instanceof Vertex && vertex2 instanceof Vertex) {
            vertex1.addEdge(vertex2, edgeWeight);
            if (!this.isDirected) {
                vertex2.addEdge(vertex1, edgeWeight);
            }
        } else {
            throw new Error('Expected Vertex arguments');
        }
    }

    removeEdge(vertex1: Vertex, vertex2: Vertex) {
        if (vertex1 instanceof Vertex && vertex2 instanceof Vertex) {
            vertex1.removeEdge(vertex2);
            if (!this.isDirected) {
                vertex2.removeEdge(vertex1);
            }
        } else {
            throw new Error('Expected Vertex arguments');
        }
    }

    addRandomEdge(): boolean {
        const vertex1 = this.vertices[Math.floor(Math.random() * this.vertices.length)];
        const vertex2 = this.vertices[Math.floor(Math.random() * this.vertices.length)];
        if (vertex1 === vertex2) {
            return false;
        }
        const edgeExists = this.edgeExists(vertex1, vertex2);
        console.log(edgeExists);
        if (edgeExists) {
            return false;
        }

        this.addEdge(vertex1, vertex2, null);
        return true;
    }

    removeRandomEdge(): boolean {
        const vertex1 = this.vertices[Math.floor(Math.random() * this.vertices.length)];
        const vertex2 = this.vertices[Math.floor(Math.random() * this.vertices.length)];
        if (vertex1 === vertex2) {
            return false;
        }
        const edgeExists = this.edgeExists(vertex1, vertex2);
        if (!edgeExists) {
            return false;
        }

        this.removeEdge(vertex1, vertex2);
        return true;
    }

    /**
     * Check if an edge exists between two vertices
     * @param vertex1 VertexInterface
     * @param vertex2 VertexInterface
     */
    edgeExists(vertex1: Vertex, vertex2: Vertex) {
        if (this.isDirected) {
            return vertex1.edges.some(edge => edge.end === vertex2);
        } else {
            return vertex1.edges.some(edge => edge.end === vertex2) && vertex2.edges.some(edge => edge.end === vertex1);
        }
    }
    
}
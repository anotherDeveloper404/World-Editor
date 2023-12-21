import { Edge } from "./edge";

export interface VertexInterface {
    data: {
        x: number;
        y: number;
    };
    edges: Array<Edge>;
    print(): void;
}

export class Vertex implements VertexInterface {
    data: any;
    edges: Array<Edge>;

    constructor(data: object) {
        this.data = data;
        this.edges = [];
    }

    addEdge(vertex: Vertex, weight: number | null = null) {
        if (vertex instanceof Vertex) {
            const edge = new Edge(this, vertex, weight);
            this.edges.push(edge);
        } else {
            throw new Error('Edge start and end must both be Vertex');
        }
    }

    removeEdge(vertex: VertexInterface) {
        this.edges = this.edges.filter(edge => edge.end !== vertex.data);
    }

    print() {
        const edgeList = this.edges.map(edge => edge.weight !== null ? `${edge.end} (${edge.weight})` : edge.end);
        const output = `${this.data} --> ${edgeList.join(', ')}`;
        console.log(output);
    }
}
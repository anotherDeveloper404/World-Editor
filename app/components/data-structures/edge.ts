import { Vertex } from "./vertex";

export interface EdgeInterface {
    start: Vertex["data"];
    end: Vertex["data"];
    weight: number | null;
}

export class Edge implements EdgeInterface {
    start: Vertex["data"];
    end: Vertex["data"];
    weight: number | null;

    constructor(start: Vertex, end: Vertex, weight: number | null = null) {
        this.start = start.data;
        this.end = end.data;
        this.weight = weight;
    }
}
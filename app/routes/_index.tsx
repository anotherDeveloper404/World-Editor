import type { MetaFunction } from "@remix-run/node";
import Viewport from "~/components/viewport";
import { Graph } from "~/components/data-structures/graph";
import { Vertex } from "~/components/data-structures/vertex";
import Point from "~/components/data-structures/point";
import GraphContext, { Drag } from "~/contexts/graph";
import { useState, useEffect } from "react";
import { scalePoint } from "~/utils/helpers";
import { Edge } from "~/components/data-structures/edge";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [graph, setGraph] = useState<Graph>(new Graph());
  const [selected, setSelected] = useState<Vertex | null>(null);
  const [hovered, setHovered] = useState<Vertex | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<Point>(scalePoint(new Point(600 / 2, 600 / 2), -1));
  const [drag, setDrag] = useState<Drag>({ start: new Point(0, 0), end: new Point(0, 0), offset: new Point(0, 0), active: false });

  const save = () => {
    window.localStorage.setItem('graph', JSON.stringify(graph));
  }

  const dispose = () => {
    window.localStorage.removeItem('graph');
    setGraph(new Graph());
  }

  useEffect(() => {
    const storedGraph = window.localStorage.getItem('graph');
    if (storedGraph) {
      setGraph((prevGraph) => {
        const graphData = JSON.parse(storedGraph);
        const newGraph = new Graph();
        newGraph.vertices = graphData.vertices.map((vertex: any) => {
          return newGraph.addVertex(vertex.data);
        });
        graphData.vertices.forEach((vertex: Vertex) => {
          vertex.edges.forEach((edge: Edge) => {
            const start = newGraph.getVertex(vertex.data);
            const end = newGraph.getVertex(edge.end);
            if (!start) return;
            if(!end) return;
            newGraph.addEdge(start, end, edge.weight);
          });
        });

        return newGraph;
      });
    }
  }, []);

  return (
    <GraphContext.Provider value={{graph, setGraph, selected, setSelected, hovered, setHovered, dragging, setDragging, zoom, setZoom, offset, setOffset, drag, setDrag, canvasWidth: 600, canvasHeight: 600}}>
      <div>
        <h1 className="text-3xl font-bold text-white">World Editor</h1>
        <Viewport />
        <div className="flex justify-center gap-6 mt-6">
          <button onClick={save} className="bg-green-400 text-white px-4 py-2 rounded-md">Save</button>
          <button onClick={dispose} className="bg-red-400 text-white px-4 py-2 rounded-md">Dispose</button>
        </div>
      </div>
    </GraphContext.Provider>
  );
}

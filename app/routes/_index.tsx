import type { MetaFunction } from "@remix-run/node";
import GraphEditor from "~/components/graph-editor";
import { Graph } from "~/components/data-structures/graph";
import { Vertex } from "~/components/data-structures/vertex";
import GraphContext from "~/contexts/graph";
import { useState } from "react";

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
  const handleMouseDown = (x: number, y: number) => {
    const nearestVertex = graph.getNearestVertex(x, y, 10);
    if (nearestVertex) {
      if (selected) {
        setGraph((prevGraph) => {
          const newGraph = new Graph();
          newGraph.vertices = [...prevGraph.vertices];
          newGraph.addEdge(selected, nearestVertex, null);
          return newGraph;
        });
      }
      setSelected(nearestVertex);
      setDragging(true);
    } else {
      setGraph((prevGraph) => {
        const newGraph = new Graph();
        newGraph.vertices = [...prevGraph.vertices];
        const vertex = newGraph.addVertex({ x, y});
        if (selected) {
          newGraph.addEdge(selected, vertex, null);
        }
        setSelected(vertex);
        setHovered(vertex);
        setDragging(true);
        return newGraph;
      });
    }
  }
  const handleHover = (x: number, y: number) => {
    const nearestVertex = graph.getNearestVertex(x, y, 10);
    if (nearestVertex) {
      setHovered((prevState) => {
        if (prevState === nearestVertex) return prevState;
        return nearestVertex;
      });
    } else {
      setHovered((prevState) => {
        if (prevState === null) return prevState;
        return null;
      });
    }

  }
  const handleRemoveVertex = (x: number, y: number) => {
    const nearestVertex = graph.getNearestVertex(x, y, 10);
    if (nearestVertex) {
      setGraph((prevGraph) => {
        const newGraph = new Graph();
        newGraph.vertices = [...prevGraph.vertices];
        newGraph.removeVertex(nearestVertex);
        return newGraph;
      });
      setSelected(null);
    }
  }
  const handleRightClick = (event: MouseEvent) => {
    if (!hovered && selected) {
      setSelected(null);
    } else {
      handleRemoveVertex(event.offsetX, event.offsetY);
    }
  }
  const handleMouseUp = () => {
    setDragging(false);
  }
  const handleAddVertexDuringDrag = (x: number, y: number) => {
    if (dragging && hovered) {
      setGraph((prevGraph) => {
        const newGraph = new Graph();
        newGraph.vertices = [...prevGraph.vertices];
        const newVertex = newGraph.updateVertex(hovered, { x, y });
        setHovered(newVertex);
        return newGraph;
      });
    }
  };
  return (
    <GraphContext.Provider value={{graph, selected, hovered, dragging}}>
      <div>
        <h1 className="text-3xl font-bold text-white">World Editor</h1>
        <GraphEditor onMousedown={handleMouseDown} onMouseOver={handleHover} handleRightClick={handleRightClick} mouseUp={handleMouseUp} handleAddVertexDuringDrag={handleAddVertexDuringDrag} />
      </div>
    </GraphContext.Provider>
  );
}

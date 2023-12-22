import Canvas from "~/components/canvas";
import { useEffect, forwardRef } from 'react';
import { Graph } from "~/components/data-structures/graph";
import { useGraphContext } from "~/contexts/graph";
import Point from "./data-structures/point";
import { getMousePosition } from "~/utils/helpers";

const GraphEditor = forwardRef(function GraphEditor(props, ref): JSX.Element {
    const canvasRef = ref as React.MutableRefObject<HTMLCanvasElement>;
    const { graph, dragging, selected, hovered, zoom, drag, offset, setGraph, setDragging, setHovered,setSelected } = useGraphContext();

    const handleMousedown = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      if (event.button === 2) {
        handleRightClick(event);
      } else if (event.button === 0) {
        const mousePosition = getMousePosition(event, zoom, offset);
        handleLeftClick(mousePosition.x, mousePosition.y);
      }
    };
  
    const handleMouseOver = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const mousePosition = getMousePosition(event, zoom, offset);
      handleHover(mousePosition.x, mousePosition.y);

      if (dragging) {
        // If dragging is true, handle adding vertex during drag
        handleDragging(mousePosition.x, mousePosition.y);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    }

    const handleMouseUp = () => {
        if (!canvasRef.current) return;
        stopDragging();
    }

    const handleLeftClick = (x: number, y: number) => {
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
            const vertex = newGraph.addVertex(new Point(x, y));
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

    const deleteVertex = (x: number, y: number) => {
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
            const mousePosition = getMousePosition(event, zoom, offset);
            deleteVertex(mousePosition.x, mousePosition.y);
        }
    }

    const stopDragging = () => {
        setDragging(false);
    }

    const handleDragging = (x: number, y: number) => {
        if (dragging && hovered) {
            setGraph((prevGraph) => {
            const newGraph = new Graph();
            newGraph.vertices = [...prevGraph.vertices];
            const newVertex = newGraph.updateVertex(hovered, new Point(x, y));
            setHovered(newVertex);
            return newGraph;
            });
        }
    };
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let animationFrameId: number;

      const handleMouseMove = (event: MouseEvent) => {
        if (dragging) {
          animationFrameId = requestAnimationFrame(() => {
            handleMouseOver(event);
          });
        } else {
          handleMouseOver(event);
        }
      };
  
      const addEventListeners = () => {
        canvas.addEventListener('mousedown', handleMousedown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('contextmenu', handleContextMenu);
      };
  
      const removeEventListeners = () => {
        canvas.removeEventListener('mousedown', handleMousedown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('contextmenu', handleContextMenu);
      };
  
      addEventListeners();
  
      return () => {
        removeEventListeners();
        cancelAnimationFrame(animationFrameId);
      }
    }, [graph, dragging, selected, hovered, zoom, drag, offset]);


    return (
        <div>
            <Canvas ref={canvasRef} />
        </div>
    )
});

export default GraphEditor;
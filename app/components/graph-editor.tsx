import Canvas from "~/components/canvas";
import { useEffect, useRef, useContext, useState } from 'react';
import GraphContext from "~/contexts/graph";

type GraphEditorProps = {
    onMousedown: (x: number, y: number) => void;
    onMouseOver: (x: number, y: number) => void;
    handleRightClick: (event: MouseEvent) => void;
    mouseUp: () => void;
    handleAddVertexDuringDrag: (x: number, y: number) => void;
}
export default function GraphEditor(props: GraphEditorProps): JSX.Element {
    const ref = useRef<HTMLCanvasElement>(null);
    const { graph, dragging, selected, hovered } = useContext(GraphContext);

    const handleMousedown = (event: MouseEvent) => {
      if (!ref.current) return;
      if (event.button === 2) {
        props.handleRightClick(event);
      } else {
        props.onMousedown(event.offsetX, event.offsetY);
      }
    };
  
    const handleMouseOver = (event: MouseEvent) => {
      if (!ref.current) return;
      props.onMouseOver(event.offsetX, event.offsetY);

      if (dragging) {
        // If dragging is true, handle adding vertex during drag
        props.handleAddVertexDuringDrag(event.offsetX, event.offsetY);
        
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    }

    const handleMouseUp = () => {
        if (!ref.current) return;
        props.mouseUp();
    }
  
    useEffect(() => {
      const canvas = ref.current;
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
    }, [graph, dragging, selected, hovered]);


    return (
        <div>
            <Canvas ref={ref} />
        </div>
    )
}
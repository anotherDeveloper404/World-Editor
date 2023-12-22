import { useRef, useEffect } from "react";
import GraphEditor from "./graph-editor";
import { useGraphContext } from "~/contexts/graph";
import Point from "./data-structures/point";
import { subtractPoints, addPoints, getMousePosition } from "~/utils/helpers";

export default function Viewport() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { zoom, setZoom, offset, setOffset, drag, setDrag } = useGraphContext();

    const handleWheel = (event: WheelEvent) => {
        const dir =  Math.sign(event.deltaY);
        const step = 0.1;
        setZoom((prevZoom) => {
            let newZoom = prevZoom + (dir * step);
            newZoom = Math.max(1, Math.min(5, newZoom));
            return newZoom;
        });
    }

    const handleMousedown = (event: MouseEvent) => {
        if (event.button === 1) {
            setDrag((prevDrag) => {
                const start: Point = getMousePosition(event, zoom, offset);
                return {
                    end: prevDrag.end,
                    offset: prevDrag.offset,
                    start,
                    active: true,
                }
            });
        }
    }

    const handleMouseUp = () => {
        if (drag.active) {
            setOffset((prevOffset) => {
                return addPoints(prevOffset, drag.offset);
            });
            setDrag((prevDrag) => {
                return Object.assign({}, {
                    start: new Point(0, 0),
                    end: new Point(0, 0),
                    active: false,
                    offset: new Point(0, 0),
                });
            });
        }
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (drag.active) {
            setDrag((prevDrag) => {
                const end: Point = getMousePosition(event, zoom, offset);
                return {
                    start: prevDrag.start,
                    end,
                    offset: subtractPoints(end, prevDrag.start),
                    active: true,
                }
            });
        }
    }

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        const addEventListeners = () => {
            canvas.addEventListener('wheel', handleWheel);
            canvas.addEventListener('mousedown', handleMousedown);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mousemove', handleMouseMove);
        }

        const removeEventListeners = () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMousedown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        }

        addEventListeners();

        return () => {
            removeEventListeners();
        }
    }, [zoom, offset, drag]);

    return (
        <div>
            <GraphEditor ref={canvasRef} />
        </div>
    )
}
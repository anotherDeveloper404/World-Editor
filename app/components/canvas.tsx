import { useEffect, useContext, useRef, forwardRef } from 'react';
import GraphContext from '~/contexts/graph';



const Canvas = forwardRef(
    function Canvas(props, ref) {
        const canvasRef = ref as React.MutableRefObject<HTMLCanvasElement>;
        const animationRef = useRef<number | null>(null);
        const {graph, selected, hovered, dragging} = useContext(GraphContext);
    
        useEffect(() => {
            if(!canvasRef) return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = 600;
            canvas.height = 600;
            const context = canvas.getContext('2d');
            
            if (!context) return;
            const animate = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                draw(context);
                animationRef.current = requestAnimationFrame(animate);
            };
          
            animate();
          
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }, [graph, selected, hovered, dragging]);

        const draw = (ctx: CanvasRenderingContext2D, size: number = 18, color = 'black') => {
            
            for (const vertex of graph.vertices) {
                const radius = size / 2;
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(vertex.data.x, vertex.data.y, radius, 0, 2 * Math.PI);
                ctx.fill();

                if (selected?.data.x === vertex.data.x && selected?.data.y === vertex.data.y) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'white';
                    ctx.arc(vertex.data.x, vertex.data.y, radius * 0.6, 0, 2 * Math.PI);
                    ctx.stroke();
                }

                if (hovered?.data.x === vertex.data.x && hovered?.data.y === vertex.data.y) {
                    ctx.beginPath();
                    ctx.fillStyle = 'white';
                    ctx.arc(vertex.data.x, vertex.data.y, radius * 0.4, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
    
            for (const vertex of graph.vertices) {
                for (const edge of vertex.edges) {
                    const start = vertex.data;
                    const end = edge.end;
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = color;
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.stroke();
                }
            }
        }
    
        return (
            <div>
                <canvas ref={canvasRef} className="bg-green-400 mx-auto" id="canvas"></canvas>
            </div>
        )
    }
);

export default Canvas;
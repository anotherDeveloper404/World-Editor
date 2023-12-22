import Point from "./point";

interface PolygonInterface {
    points: Point[];
}
export default class Polygon implements PolygonInterface {
    points: Point[];
    constructor(points: Point[]) {
        this.points = points;
    }

    draw(ctx: CanvasRenderingContext2D, { lineWidth = 2, fill = "rgba(0, 0, 255, 0.3)", stroke = "blue" } = {}) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
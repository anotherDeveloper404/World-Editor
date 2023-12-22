type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;
import Point from '~/components/data-structures/point';
import { Vertex } from '~/components/data-structures/vertex';

export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function subtractPoints(point1: Point, point2: Point): Point {
  return new Point(point1.x - point2.x, point1.y - point2.y);
}

export function addPoints(point1: Point, point2: Point): Point {
  return new Point(point1.x + point2.x, point1.y + point2.y);
}

export function scalePoint(point: Point, scale: number): Point {
  return new Point(point.x * scale, point.y * scale);
}

export function calculateCenter(canvas: HTMLCanvasElement): Point {
  return new Point(canvas.width / 2, canvas.height / 2);
}

export const getMousePosition = (event: MouseEvent, zoom: number, offset: Point): Point => {
    // Take into account the center of the canvas, the zoom, and the offset
    const position = new Point((event.offsetX - (600 / 2)) * zoom - offset.x, (event.offsetY - (600 / 2)) * zoom - offset.y);
    return position;
}

export const translate = (vertex: Vertex, angle: number, offset: number): Point => {
    return new Point(
        vertex.data.x + Math.cos(angle) * offset,
        vertex.data.y + Math.sin(angle) * offset,
    );
}

export const getAngle = (vertex: Vertex): number => {
    return Math.atan2(vertex.data.y, vertex.data.x);
}

export const subtractVertices = (vertex1: Vertex, vertex2: Vertex): Vertex => {
    return new Vertex(new Point(vertex1.data.x - vertex2.data.x, vertex1.data.y - vertex2.data.y));
}
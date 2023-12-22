import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Graph } from '~/components/data-structures/graph';
import { Vertex } from '~/components/data-structures/vertex';
import Point from '~/components/data-structures/point';

export type Drag = {
    start: Point;
    end: Point;
    offset: Point;
    active: boolean;
};

type GraphContextType = {
    graph: Graph;
    selected: Vertex | null;
    hovered: Vertex | null;
    dragging: boolean;
    zoom: number;
    offset: {x: number, y: number};
    drag: Drag;
    setGraph: Dispatch<SetStateAction<Graph>>;
    setSelected: Dispatch<SetStateAction<Vertex | null>>;
    setHovered: Dispatch<SetStateAction<Vertex | null>>;
    setDragging: Dispatch<SetStateAction<boolean>>;
    setZoom: Dispatch<SetStateAction<number>>;
    setOffset: Dispatch<SetStateAction<{x: number, y: number}>>;
    setDrag: Dispatch<SetStateAction<Drag>>;
    canvasWidth: number;
    canvasHeight: number;
};
const GraphContext = createContext<GraphContextType | undefined>(undefined);

export default GraphContext;

export const useGraphContext = () => {
    const context = useContext(GraphContext);
    if (!context) {
      throw new Error('useGraphContext must be used within a GraphProvider');
    }
    return context;
};
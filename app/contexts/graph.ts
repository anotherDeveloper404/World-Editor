import { createContext } from 'react';
import { Graph } from '~/components/data-structures/graph';
import { Vertex } from '~/components/data-structures/vertex';

type GraphContextType = {
    graph: Graph;
    selected: Vertex | null;
    hovered: Vertex | null;
    dragging: boolean;
};
const GraphContext = createContext<GraphContextType>({ graph: new Graph(), selected: null, hovered: null, dragging: false});

export default GraphContext;
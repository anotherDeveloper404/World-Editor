# Jons World Editor!

- [Remix Docs](https://remix.run/docs)

## About World Editor

World editor is portfolio project to display knowledge of linear and complex data structures, React, State management, Machine Learning and API's.

### Data Structures

Wolrd editor uses a graph that represnts data points, or vertices, that are connected by edges. Common applications for graphs are things like maps, where each location is a vertex, and each path, or road, between the locations is an edge. Graphs can be directed (a one-way street) or undirected (a two-way street), as well as weighted or unweighted (think of the length of each street as a potential measurement of weight). 

vertex: A node in a graph.
edge: A connection between two vertices.
adjacent: When an edge exists between vertices.
path: A sequence of one or more edges between vertices.
disconnected: Graph where at least two vertices have no path connecting them.
weighted: Graph where edges have an associated cost.
directed: Graph where travel between vertices can be restricted to a single direction.
cycle: A path which begins and ends at the same vertex.
adjacency matrix: Graph representation where vertices are both the rows and the columns. Each cell represents a possible edge.
adjacency list: Graph representation where each vertex has a list of all the vertices it shares an edge with.

#### Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

##### Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

###### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

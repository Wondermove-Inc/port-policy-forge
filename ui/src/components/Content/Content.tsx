import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    group: string;
    groupY: number;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
    id: string | number;
    source: string | NodeData;
    target: string | NodeData;
}

// 노드를 두 개의 집합(줄)로 나누기 위해, groupY를 세팅
//  - groupY = 1인 노드는 윗줄 (예: external, ingress, frontend)
//  - groupY = 2인 노드는 아랫줄 (예: backend, mysql-db)
const flowData: {
    nodes: NodeData[];
    links: LinkData[];
} = {
    nodes: [
        { id: 'External', group: 'external', groupY: 1 },
        { id: 'Ingress', group: 'ingress', groupY: 1 },
        { id: 'frontend', group: 'frontend', groupY: 1 },
        { id: 'backend', group: 'backend', groupY: 2 },
        { id: 'mysql-db', group: 'database', groupY: 2 },
    ],
    links: [
        { source: 'External', target: 'Ingress', id: 0 },
        { source: 'Ingress', target: 'frontend', id: 1 },
        { source: 'Ingress', target: 'backend', id: 2 },
        { source: 'backend', target: 'mysql-db', id: 3 },
    ],
};

export function Content() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 800;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('*').remove();

        const defs = svg.append('defs');
        defs.append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 50)
            .attr('refY', 0)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('fill', '#999');

        const simulation = d3.forceSimulation<NodeData>()
            .force('link', d3.forceLink<NodeData, LinkData>()
                .id(d => d.id)
                .distance(150)
            )
            .force('charge', d3.forceManyBody().strength(-300))
            .force('x', d3.forceX<NodeData>((_, i) => (i + 1) * 150).strength(1.0))
            .force('y', d3.forceY<NodeData>((d) => {
                return d.groupY === 1 ? 200 : 400;
            }).strength(1.0))
            .force('center', null);

        const link = svg.selectAll<SVGLineElement, LinkData>('line')
            .data(flowData.links)
            .enter()
            .append('line')
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow)');

        const rectWidth = 120;
        const rectHeight = 50;

        const nodeGroup = svg.selectAll<SVGGElement, NodeData>('g')
            .data(flowData.nodes)
            .enter()
            .append('g');

        nodeGroup.append('rect')
            .attr('width', rectWidth)
            .attr('height', rectHeight)
            .attr('rx', 8)
            .attr('ry', 8)
            .attr('fill', d => {
                switch (d.group) {
                    default:
                        return 'gray';
                }
            });

        nodeGroup.append('text')
            .text(d => d.id)
            .attr('x', rectWidth / 2)
            .attr('y', rectHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('fill', '#fff')
            .style('font-weight', 'bold')
            .style('pointer-events', 'none');

        simulation.nodes(flowData.nodes).on('tick', ticked);
        (simulation.force<d3.ForceLink<NodeData, LinkData>>('link'))?.links(flowData.links);

        function ticked() {
            link
                .attr('x1', d => (d.source as NodeData).x ?? 0)
                .attr('y1', d => (d.source as NodeData).y ?? 0)
                .attr('x2', d => (d.target as NodeData).x ?? 0)
                .attr('y2', d => (d.target as NodeData).y ?? 0);

            nodeGroup.attr('transform', d => {
                const x = (d.x ?? 0) - rectWidth / 2;
                const y = (d.y ?? 0) - rectHeight / 2;
                return `translate(${x}, ${y})`;
            });
        }

    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
            <svg ref={svgRef} style={{ border: '1px solid #ccc' }} />
        </div>
    );
}

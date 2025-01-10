import { useCallback } from "react";
import ReactFlow, {
    Node,
    addEdge,
    Background,
    Edge,
    Connection,
    Position,
    MarkerType,
    useNodesState,
    useEdgesState,
    ControlButton,
    Controls
} from "reactflow";
import CustomNode from "./CustomNode.tsx";
import WorkloadNode from "./WorkloadNode.tsx";

const initialNodes: Node[] = [
    {
        id: "workload1",
        type: "workload",
        // sourcePosition: Position.Right,
        data: { label: "Workload1" },
        position: { x: 500, y: -150 },
    },
    // {
    //     id: "ingress",
    //     data: { label: "Ingress" },
    //     sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     position: { x: 200, y: 100 }
    // },
    // {
    //     id: "react-frontend",
    //     data: { label: "react-frontend" },
    //     sourcePosition: Position.Right,
    //     targetPosition: Position.Left,
    //     position: { x: 400, y: 50 }
    // },
    {
        id: "workload2",
        type: "workload",
        data: { label: "Workload2" },
        // sourcePosition: Position.Right,
        // targetPosition: Position.Left,
        position: { x: 300, y: 0 }
    },
    {
        id: "workload3",
        data: { label: "Workload3" },
        type: "workload",
        // sourcePosition: Position.Right,
        // targetPosition: Position.Left,
        position: { x: 700, y: 0 }
    },
];

// const initialEdges: Edge[] = [
//     {
//         id: "e1-1",
//         source: "external",
//         target: "workload",
//         animated: true,
//         markerEnd: {
//             type: MarkerType.Arrow,
//         },
//     },
//     {
//         id: "e1-2",
//         source: "workload",
//         target: "db",
//         animated: true,
//         markerEnd: {
//             type: MarkerType.Arrow,
//         },
//     },
//     {
//         id: "e2-3",
//         source: "ingress",
//         target: "react-frontend",
//         animated: true,
//         markerEnd: {
//             type: MarkerType.Arrow,
//         },
//     },
//     {
//         id: "e2-4",
//         source: "ingress",
//         target: "nodejs-backend",
//         animated: true,
//         markerEnd: {
//             type: MarkerType.Arrow,
//         },
//     },
//     {
//         id: "e4-5",
//         source: "nodejs-backend",
//         target: "mysql-db",
//         animated: true,
//         markerEnd: {
//             type: MarkerType.Arrow,
//         },
//     }
// ];

const nodeTypes = {
    custom: CustomNode,
    workload: WorkloadNode
};

interface FlowProps {
    onNodeClick: () => void;
    onFlowClick: () => void;
}

const BasicFlow: React.FC<FlowProps> = ({ onNodeClick, onFlowClick }) => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);

    const onNodeClickHandler = (event: React.MouseEvent, node: Node) => {
        onNodeClick();
    };

    return (
        <div onClick={onFlowClick} style={{ width: "100%", height: "100%" }}>
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                fitView
                onNodeClick={onNodeClickHandler}
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

export default BasicFlow;
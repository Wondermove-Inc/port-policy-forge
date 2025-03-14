import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const CustomNode = ({
    data,
    isConnectable,
    targetPosition = Position.Left,
    sourcePosition = Position.Right
}: NodeProps) => {
    return (
        <>
            <Handle
                type="target"
                position={targetPosition}
                isConnectable={isConnectable}
            />
            {data?.label}
            <Handle
                type="source"
                position={sourcePosition}
                isConnectable={isConnectable}
            />
        </>
    );
};

CustomNode.displayName = "CustomNode";

export default memo(CustomNode);

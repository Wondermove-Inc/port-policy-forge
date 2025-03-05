import { memo, useCallback } from 'react';
import { Button } from '@mantine/core';
import { Handle, NodeProps, Position } from 'reactflow';


const WorkloadNode = ({
    data,
    // targetPosition = Position.Right,
    // sourcePosition = Position.Left
}: NodeProps) => {
    // const onChange = useCallback((evt: { target: { value: any; }; }) => {
    //     console.log(evt.target.value);
    // }, []);

    return (
        <>
            {/* <Handle
                type="target"
                position={targetPosition}
                isConnectable={isConnectable}
            /> */}
            <div className="text-updater-node">
                {data.label}
                {/* <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag" /> */}
                <div className='buttons-container'>
                    <Button variant="filled">Incoming</Button>
                    <Button variant="outlined">Outgoing</Button>
                </div>
            </div>
            {/* <Handle
                type="source"
                position={sourcePosition}
                id="b"
                isConnectable={isConnectable}
            /> */}
        </>
    );
};

WorkloadNode.displayName = "WorkloadNode";

export default memo(WorkloadNode);
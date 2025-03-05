import * as React from 'react';
import { Table, Button, Group, Container, Space } from '@mantine/core';
import { Emoji } from 'emoji-picker-react';

interface PortData {
    port: string;
    lastConnected: string;
    connectionLog: string;
    lastsourceip: string;
    lastdstip: string;
    status: 'Open' | 'Close';
    longTimeNoConnection?: boolean;
}

const initialData: PortData[] = [
    { port: "80", lastConnected: '2024-01-10', connectionLog: ' "192.168.10.101:34562 (remote-node) -> 172.16.0.236:4240 (health) to-endpoint FORWARDED (TCP Flags: ACK)",', lastsourceip: "10.10.1.19", lastdstip: "-", status: 'Open', longTimeNoConnection: false },
    { port: "8080", lastConnected: '2024-01-10', connectionLog: ' "192.168.10.101:34562 (remote-node) -> 172.16.0.236:4240 (health) to-endpoint FORWARDED (TCP Flags: ACK)",', lastsourceip: "10.10.1.20", lastdstip: "-", status: 'Open', longTimeNoConnection: false },
    { port: "50000", lastConnected: '2023-12-10', connectionLog: ' "192.168.10.101:34562 (remote-node) -> 172.16.0.236:4240 (health) to-endpoint FORWARDED (TCP Flags: ACK)",', lastsourceip: "10.10.1.21", lastdstip: "-", status: 'Open', longTimeNoConnection: true },
    { port: "1...77", lastConnected: '-', connectionLog: '-', lastsourceip: "-", lastdstip: "-", status: 'Close' },
    { port: "78", lastConnected: '2024-01 - 10', connectionLog: '-', lastsourceip: "-", lastdstip: "-", status: 'Close', longTimeNoConnection: true },
    { port: "79", lastConnected: '-', connectionLog: '-', lastsourceip: "-", lastdstip: "-", status: 'Close' },
    { port: "81...8079", lastConnected: '-', connectionLog: '-', lastsourceip: "-", lastdstip: "-", status: 'Close' },
    { port: "8081...65535", lastConnected: '-', connectionLog: '-', lastsourceip: "-", lastdstip: "-", status: 'Close' },
];

const PortTable: React.FC = () => {
    const [filter, setFilter] = React.useState<'All' | 'Open' | 'Close'>('All');

    const filteredData = initialData.filter((data) => {
        if (filter === 'All') return true;
        return data.status === filter;
    });

    return (
        <Container>
            <Group align="center" className="button-group">
                <Button variant="filled" onClick={() => setFilter('Open')} className="filter-button">Open</Button>
                <Button variant="outline" onClick={() => setFilter('Close')} className="filter-button">Close</Button>
            </Group>

            <Space h="md" />

            <Table className="port-table">
                <thead>
                    <tr>
                        <th>Port</th>
                        <th>Last Connected</th>
                        <th>Last Src IP</th>
                        <th>Last Dest IP</th>
                        <th>Last Connection Log</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((data, index) => (
                        <tr key={index}>
                            <td>
                                {data.longTimeNoConnection && (
                                    <Emoji unified="2757" size={18} />
                                )}
                                {data.port}
                            </td>
                            <td>{data.lastConnected}</td>
                            <td>{data.lastsourceip}</td>
                            <td>{data.lastdstip}</td>
                            <td>{data.connectionLog}</td>
                        </tr>
                    ))}


                </tbody>
            </Table>
        </Container>
    );
};

export default PortTable;
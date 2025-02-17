package main

type Namespace struct {
	ID            int    `json:"id"`
	NamespaceName string `json:"namespaceName"`
}

type Workload struct {
	ID           int    `json:"id"`
	WorkloadName string `json:"workloadName"`
}

type PortRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type PortSource struct {
	IP   string `json:"ip"`
	Port int    `json:"port"`
}

type PortDetailGroup struct {
	Open   []Port `json:"open"`
	Closed []Port `json:"closed"`
}

type Port struct {
	ID                int         `json:"id"`
	IsRange           bool        `json:"isRange"`
	PortNumber        *int        `json:"portNumber"` // nil if range
	PortRange         *PortRange  `json:"portRange"`  // nil if not range
	Status            int         `json:"status"`     // 예: 0: unconnected, 1: active, 2: idle, 3: attempted, etc.
	Direction         string      `json:"direction"`
	Source            interface{} `json:"source"`
	IsOpen            bool        `json:"isOpen"`
	Risk              int         `json:"risk"`
	Type              string      `json:"type"`
	Count             interface{} `json:"count"`             // null 처리
	LastConnection    interface{} `json:"lastConnection"`    // string 또는 null
	LastSrcIP         interface{} `json:"lastSrcIp"`         // string 또는 null
	LastConnectionLog interface{} `json:"lastConnectionLog"` // 간단히 처리
}

type Relation struct {
	WorkloadId string `json:"workloadId"`
	Status     int    `json:"status"`
}

type Stats struct {
	Active      int      `json:"active"`
	Unconnected int      `json:"unconnected"`
	Idle        int      `json:"idle"`
	Error       int      `json:"error"`
	Attempted   int      `json:"attempted"`
	LatencyRtt  *float64 `json:"latencyRtt"`
	Throughput  float64  `json:"throughput"`
}

type WorkloadResource struct {
	UUID         string     `json:"uuid"`
	WorkloadName string     `json:"workloadName"`
	Kind         string     `json:"kind"`
	From         []Relation `json:"from"`
	To           []Relation `json:"to"`
}

type WorkloadDetail struct {
	UUID         string                     `json:"uuid"`
	WorkloadName string                     `json:"workloadName"`
	Kind         string                     `json:"kind"`
	Stats        Stats                      `json:"stats"`
	Ports        map[string]PortDetailGroup `json:"ports"` // keys: "inbound", "outbound"
}

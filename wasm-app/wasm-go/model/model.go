package model

// === Related to listNamespace ===

type Namespace struct {
	ID            int    `json:"id"`
	NamespaceName string `json:"namespaceName"`
}

// ===

// === Related to listWorkload ===

type Workload struct {
	UUID         string     `json:"uuid"`
	WorkloadName string     `json:"workloadName"`
	Kind         string     `json:"kind"`
	From         []Relation `json:"from"`
	To           []Relation `json:"to"`
}

type Relation struct {
	WorkloadId string `json:"workloadId"`
	Status     int    `json:"status"`
}

// ===

// === Related to getWorkloadDetail, openPort, editPort ===

type AccessPolicy string

const (
	AllowAllAccess  AccessPolicy = "allow-all"
	OnlySpecific    AccessPolicy = "only-specific"
	ExcludeSpecific AccessPolicy = "exclude-specific"
)

type PortRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type PortDetailGroup struct {
	Open   []Port `json:"open"`
	Closed []Port `json:"closed"`
}

type Port struct {
	// Unique identifier for the port entry.
	ID int `json:"id"`

	// Indicates whether the port represents a range (true) or a single port (false).
	IsRange bool `json:"isRange"`

	// Port number for a single port; set to nil if a range is used.
	PortNumber *int `json:"portNumber"`

	// Port range information; set to nil if it's a single port.
	PortRange *PortRange `json:"portRange"`

	// Port status:
	// - When IsOpen is true, this value is not applicable (e.g., can be ignored).
	// - When IsOpen is false:
	//     0: unconnected
	//     1: active
	//     2: idle
	Status *int `json:"status"`

	// Port direction, e.g., "inbound" or "outbound".
	Direction string `json:"direction"`

	// Access policy for the port. For example: "allow-all", "only_specific", "exclude_specific".
	AccessPolicy AccessPolicy `json:"accessPolicy"`

	// List of access sources associated with the port, used with specific access policies.
	AccessSources []AccessSource `json:"accessSources"`

	// Indicates whether the port is open (true) or closed (false).
	IsOpen bool `json:"isOpen"`

	// Risk level for the port (applies when IsOpen is false):
	// 0: normal, 1: high, 2: very high (e.g., based on connection attempts).
	Risk *int `json:"risk"`

	// Count value, such as number of connections or similar metric.
	Count int `json:"count"`

	// Date and time of the last connection (string or null).
	LastConnectionDate interface{} `json:"lastConnectionDate"`

	// The endpoint (e.g., IP address) of the last connection (string or null).
	LastConnectionEndpoint interface{} `json:"lastConnectionEndpoint"`

	// Log information for the last connection (string or null).
	LastConnectionLog interface{} `json:"lastConnectionLog"`
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

type WorkloadDetail struct {
	UUID         string      `json:"uuid"`
	WorkloadName string      `json:"workloadName"`
	Kind         string      `json:"kind"`
	Inbound      TrafficInfo `json:"inbound"`
	Outbound     TrafficInfo `json:"outbound"`
}

type TrafficInfo struct {
	Stats Stats           `json:"stats"`
	Ports PortDetailGroup `json:"ports"`
}

type TrfficDirection string

const (
	InBound  TrfficDirection = "in"
	OutBound TrfficDirection = "out"
)

type AccessSource struct {
	IP       string `json:"ip"`
	Protocol string `json:"protocol"`
	Comment  string `json:"comment"`
}

type PortControlBase struct {
	WorkloadUUID string         `json:"workloadUuid"`
	Flag         int            `json:"flag"`     // 0: inbound, 1: outbound
	PortSpec     string         `json:"portSpec"` // ex: "8080", "8080,8081", "8080-8091"
	AccessPolicy AccessPolicy   `json:"accessPolicy"`
	Sources      []AccessSource `json:"accessSources"`
}

// ===

// === Related to closeOpenedPort ===

// type PortCloseRequest struct {
// 	WorkloadUUID string `json:"workloadUuid"`
// 	Flag         int    `json:"flag"`     // 0: inbound, 1: outbound
// 	PortSpec     string `json:"portSpec"` // ex: "8080" 또는 "8080-8091"
// }

// ===

// === Related to openClosedPort, closeClosedPort and clearClosedPortHistory ===

type PortControlRequest struct {
	WorkloadUUID string `json:"workloadUuid"`
	Flag         int    `json:"flag"`     // 0: inbound, 1: outbound
	PortSpec     string `json:"portSpec"` // ex: "8080" 또는 "8080-8091"
}

// ===

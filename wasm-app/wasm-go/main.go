package main

import (
	"encoding/json"
	"syscall/js"
)

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

type Port struct {
	ID                int         `json:"id"`
	IsRange           bool        `json:"isRange"`
	PortNumber        *int        `json:"portNumber"` // nil if range
	PortRange         *PortRange  `json:"portRange"`  // nil if not range
	Status            int         `json:"status"`
	Direction         string      `json:"direction"`
	Source            interface{} `json:"source"`
	IsOpen            bool        `json:"isOpen"`
	Risk              int         `json:"risk"`
	Type              string      `json:"type"`
	Count             interface{} `json:"count"`             // null 처리
	LastConnection    interface{} `json:"lastConnection"`    // string 또는 null
	LastSrcIP         interface{} `json:"lastSrcIp"`         // string or null
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
	UUID         string            `json:"uuid"`
	WorkloadName string            `json:"workloadName"`
	Kind         string            `json:"kind"`
	Stats        Stats             `json:"stats"`
	Ports        map[string][]Port `json:"ports"` // "open" and "closed"
}

func main() {
	done := make(chan struct{}, 0)

	js.Global().Set("listNamespace", js.FuncOf(listNamespace))
	js.Global().Set("listWorkloads", js.FuncOf(listWorkloads))
	js.Global().Set("getWorkloadDetail", js.FuncOf(getWorkloadDetail))

	<-done
}

func listNamespace(this js.Value, p []js.Value) interface{} {
	namespaces := []Namespace{
		{ID: 0, NamespaceName: "default"},
		{ID: 1, NamespaceName: "kube-system"},
		{ID: 2, NamespaceName: "cilium"},
	}
	response := map[string]interface{}{
		"result": namespaces,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func listWorkloads(this js.Value, p []js.Value) interface{} {
	nsName := p[0].String()

	workload1 := WorkloadResource{
		UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
		WorkloadName: nsName + "-workload-1",
		Kind:         "deployment",
		From: []Relation{
			{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
			{WorkloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99", Status: 4},
		},
		To: []Relation{
			{WorkloadId: "afbcb3d5-67e8-4f4b-9d8f-f0f124abc2f2", Status: 2},
			{WorkloadId: "b726573d-4914-42ab-be5e-fb1daecec08b", Status: 2},
		},
	}

	workload2 := WorkloadResource{
		UUID:         "7f2552b4-ab40-4120-a6d9-16507024922b",
		WorkloadName: nsName + "-ad-service",
		Kind:         "deployment",
		From:         []Relation{},
		To: []Relation{
			{WorkloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271", Status: 4},
		},
	}

	resources := []WorkloadResource{workload1, workload2}
	finalResponse := map[string]interface{}{
		"result": resources,
	}
	b, _ := json.Marshal(finalResponse)
	return string(b)
}

func getWorkloadDetail(this js.Value, p []js.Value) interface{} {
	workloadID := p[0].String()
	detail := WorkloadDetail{
		UUID:         workloadID,
		WorkloadName: "",
		Kind:         "deployment",
		Stats: Stats{
			Active:      2,
			Unconnected: 8079,
			Idle:        1,
			Error:       0,
			Attempted:   2,
			LatencyRtt:  float64Ptr(1.39),
			Throughput:  469.89,
		},
		Ports: map[string][]Port{
			"open": {
				{
					ID:         0,
					IsRange:    true,
					PortNumber: nil,
					PortRange:  &PortRange{Start: "0", End: "4999"},
					Status:     0,
					Direction:  "inbound",
					Source:     nil,
					IsOpen:     true,
					Risk:       0,
					Type:       "internal",
				},
				{
					ID:         1,
					IsRange:    false,
					PortNumber: intPtr(8080),
					Status:     2,
					Direction:  "inbound",
					Source:     []PortSource{{IP: "192.168.1.100", Port: 51234}},
					IsOpen:     true,
					Risk:       0,
					Type:       "internal",
				},
			},
			"closed": {
				{
					ID:         0,
					IsRange:    false,
					PortNumber: intPtr(50051),
					Status:     4,
					Direction:  "inbound",
					Source:     []PortSource{{IP: "192.168.1.100", Port: 51234}},
					IsOpen:     false,
					Risk:       2,
					Type:       "internal",
				},
			},
		},
	}
	return string(mustMarshal(detail))
}

func intPtr(n int) *int {
	return &n
}

func float64Ptr(f float64) *float64 {
	return &f
}

func mustMarshal(v interface{}) []byte {
	b, err := json.Marshal(v)
	if err != nil {
		return []byte("{}")
	}
	return b
}

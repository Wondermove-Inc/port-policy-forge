package main

import (
	"encoding/json"
	"syscall/js"
)

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
		WorkloadName: "demo-workload-1",
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
		Ports: map[string]PortDetailGroup{
			"inbound": {
				Open: []Port{
					{
						ID:                0,
						IsRange:           true,
						PortNumber:        nil,
						PortRange:         &PortRange{Start: "0", End: "4999"},
						Status:            0,
						Direction:         "inbound",
						Source:            nil,
						IsOpen:            true,
						Risk:              0,
						Type:              "internal",
						Count:             nil,
						LastConnection:    nil,
						LastSrcIP:         nil,
						LastConnectionLog: nil,
					},
					{
						ID:                1,
						IsRange:           true,
						PortNumber:        intPtr(5000),
						PortRange:         nil,
						Status:            1,
						Direction:         "inbound",
						Source:            nil,
						IsOpen:            true,
						Risk:              0,
						Type:              "internal",
						Count:             nil,
						LastConnection:    "2023-02-21T11:19:22+09:00",
						LastSrcIP:         "10.10.1.19",
						LastConnectionLog: "Connection Log",
					},
					{
						ID:                2,
						IsRange:           true,
						PortNumber:        nil,
						PortRange:         &PortRange{Start: "5001", End: "8079"},
						Status:            0,
						Direction:         "inbound",
						Source:            nil,
						IsOpen:            true,
						Risk:              0,
						Type:              "internal",
						Count:             nil,
						LastConnection:    nil,
						LastSrcIP:         nil,
						LastConnectionLog: nil,
					},
					{
						ID:                3,
						IsRange:           false,
						PortNumber:        intPtr(8080),
						PortRange:         nil,
						Status:            2,
						Direction:         "inbound",
						Source:            []PortSource{{IP: "192.168.1.100", Port: 51234}},
						IsOpen:            true,
						Risk:              0,
						Type:              "internal",
						Count:             nil,
						LastConnection:    "2022-02-21T11:19:22+09:00",
						LastSrcIP:         "10.10.1.19",
						LastConnectionLog: "Connection Log",
					},
				},
				Closed: []Port{
					{
						ID:                4,
						IsRange:           false,
						PortNumber:        intPtr(50051),
						PortRange:         nil,
						Status:            4,
						Direction:         "inbound",
						Source:            []PortSource{{IP: "192.168.1.100", Port: 51234}},
						IsOpen:            false,
						Risk:              2,
						Type:              "internal",
						Count:             10,
						LastConnection:    "2023-02-21T11:19:22+09:00",
						LastSrcIP:         "10.10.1.19",
						LastConnectionLog: "Connection Log",
					},
					{
						ID:                5,
						IsRange:           false,
						PortNumber:        intPtr(50052),
						PortRange:         nil,
						Status:            4,
						Direction:         "inbound",
						Source:            []PortSource{{IP: "192.168.1.100", Port: 51234}},
						IsOpen:            false,
						Risk:              1,
						Type:              "internal",
						Count:             4,
						LastConnection:    "2023-02-21T11:19:22+09:00",
						LastSrcIP:         "10.10.1.19",
						LastConnectionLog: "Connection Log",
					},
				},
			},
			"outbound": {
				Open: []Port{
					{
						ID:                6,
						IsRange:           false,
						PortNumber:        intPtr(9000),
						PortRange:         nil,
						Status:            0,
						Direction:         "outbound",
						Source:            []PortSource{{IP: "10.0.0.1", Port: 12345}},
						IsOpen:            true,
						Risk:              0,
						Type:              "external",
						Count:             nil,
						LastConnection:    "2023-02-21T12:00:00+09:00",
						LastSrcIP:         "10.0.0.2",
						LastConnectionLog: "Outbound connection log",
					},
				},
				Closed: []Port{
					{
						ID:                7,
						IsRange:           false,
						PortNumber:        intPtr(9001),
						PortRange:         nil,
						Status:            4,
						Direction:         "outbound",
						Source:            []PortSource{{IP: "10.0.0.1", Port: 12345}},
						IsOpen:            false,
						Risk:              2,
						Type:              "external",
						Count:             5,
						LastConnection:    "2023-02-21T12:05:00+09:00",
						LastSrcIP:         "10.0.0.2",
						LastConnectionLog: "Outbound closed connection log",
					},
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

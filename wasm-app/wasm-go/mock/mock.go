package mock

import (
	"wasm-go/model"
	"wasm-go/utils"
)

var MockNamespaces = []model.Namespace{
	{ID: 0, NamespaceName: "default"},
	{ID: 1, NamespaceName: "kube-system"},
	{ID: 2, NamespaceName: "cilium"},
}

var MockWorkloads = map[string][]model.Workload{
	"default": {
		{
			UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
			WorkloadName: "default-workload-1",
			Kind:         "deployment",
			From: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
				{WorkloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99", Status: 4},
			},
			To: []model.Relation{
				{WorkloadId: "afbcb3d5-67e8-4f4b-9d8f-f0f124abc2f2", Status: 2},
				{WorkloadId: "b726573d-4914-42ab-be5e-fb1daecec08b", Status: 2},
			},
		},
		{
			UUID:         "7f2552b4-ab40-4120-a6d9-16507024922b",
			WorkloadName: "default-workload-2",
			Kind:         "deployment",
			From:         []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271", Status: 4},
			},
		},
	},
	"kube-system": {
		{
			UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
			WorkloadName: "dns-autoscaler",
			Kind:         "deployment",
			From: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
				{WorkloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99", Status: 4},
			},
			To: []model.Relation{
				{WorkloadId: "afbcb3d5-67e8-4f4b-9d8f-f0f124abc2f2", Status: 2},
				{WorkloadId: "b726573d-4914-42ab-be5e-fb1daecec08b", Status: 2},
			},
		},
		{
			UUID:         "7f2552b4-ab40-4120-a6d9-16507024922b",
			WorkloadName: "metrics-server",
			Kind:         "deployment",
			From:         []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271", Status: 4},
			},
		},
	},
	"cilium": {
		{
			UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
			WorkloadName: "cilium-monitor",
			Kind:         "deployment",
			From: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
				{WorkloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99", Status: 4},
			},
			To: []model.Relation{
				{WorkloadId: "afbcb3d5-67e8-4f4b-9d8f-f0f124abc2f2", Status: 2},
				{WorkloadId: "b726573d-4914-42ab-be5e-fb1daecec08b", Status: 2},
			},
		},
		{
			UUID:         "7f2552b4-ab40-4120-a6d9-16507024922b",
			WorkloadName: "cilium-agent",
			Kind:         "deployment",
			From:         []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271", Status: 4},
			},
		},
	},
}

var MockWorkloadDetails = map[string]model.WorkloadDetail{
	"7431bb4f-cae8-4dbe-a542-d6f52c893271": {
		UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
		WorkloadName: "default-workload-1",
		Kind:         "deployment",
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      1,
				Unconnected: 8079,
				Idle:        1,
				Error:       0,
				Attempted:   2,
				LatencyRtt:  utils.Float64Ptr(1.39),
				Throughput:  469.89,
			},
			Ports: model.PortDetailGroup{
				Open: []model.Port{
					{
						ID:                     0,
						IsRange:                false,
						PortNumber:             utils.IntPtr(8080),
						Status:                 utils.IntPtr(1), // active
						Direction:              "inbound",
						IsOpen:                 true,
						Count:                  3,
						AccessPolicy:           model.AllowAllAccess,
						LastConnectionDate:     "2023-03-21T10:15:00+09:00",
						LastConnectionEndpoint: "192.168.1.101",
						LastConnectionLog:      "192.168.10.101:34562 -> 172.16.0.236:8080 (TCP Flags: ACK)",
					},
					{
						ID:           1,
						IsRange:      false,
						PortNumber:   utils.IntPtr(8081),
						Status:       utils.IntPtr(0), // unconnected
						Direction:    "inbound",
						IsOpen:       true,
						Count:        0,
						AccessPolicy: model.OnlySpecific,
						AccessSources: []model.AccessSource{
							{
								IP:       "192.168.1.101",
								Protocol: "tcp",
								Comment:  "specific allowed",
							},
						},
					},
					{
						ID:           2,
						IsRange:      true,
						PortNumber:   nil,
						PortRange:    &model.PortRange{Start: "8083", End: "8085"},
						Status:       utils.IntPtr(0), // unconnected
						IsOpen:       true,
						Count:        0,
						AccessPolicy: model.AllowAllAccess,
					},
					{
						ID:                     3,
						IsRange:                false,
						PortNumber:             utils.IntPtr(9090),
						Status:                 utils.IntPtr(2), // idle
						Direction:              "inbound",
						IsOpen:                 true,
						Count:                  1,
						AccessPolicy:           model.AllowAllAccess,
						LastConnectionDate:     "2022-03-21T10:15:00+09:00",
						LastConnectionEndpoint: "192.168.1.101",
						LastConnectionLog:      "remote-node -> 172.16.0.236:9090 (health)",
					},
				},
				Closed: []model.Port{
					{
						ID:                     4,
						IsRange:                false,
						PortNumber:             utils.IntPtr(8082),
						Status:                 nil,
						Direction:              "inbound",
						IsOpen:                 false,
						Risk:                   utils.IntPtr(2),
						Count:                  10,
						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
						LastConnectionEndpoint: "192.168.1.102",
						LastConnectionLog:      "remote-node -> 172.16.0.236:8082 (health)",
					},
				},
			},
		},

		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        0,
				Error:       0,
				Attempted:   0,
				LatencyRtt:  utils.Float64Ptr(0.0),
				Throughput:  0.0,
			},
			Ports: model.PortDetailGroup{
				Open: []model.Port{
					{
						ID:                     5,
						IsRange:                false,
						PortNumber:             utils.IntPtr(9000),
						Status:                 utils.IntPtr(1),
						Direction:              "outbound",
						IsOpen:                 true,
						Count:                  1,
						Risk:                   nil,
						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
						LastConnectionEndpoint: "192.168.1.102",
						LastConnectionLog:      "172.16.0.236:9000 -> (health)",
						AccessPolicy:           model.AllowAllAccess,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 2) default-workload-2
	"7f2552b4-ab40-4120-a6d9-16507024922b": {
		UUID:         "7f2552b4-ab40-4120-a6d9-16507024922b",
		WorkloadName: "default-workload-2",
		Kind:         "deployment",

		// Inbound에 기존 Stats를 할당
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      3,
				Unconnected: 5000,
				Idle:        0,
				Error:       1,
				Attempted:   3,
				LatencyRtt:  utils.Float64Ptr(2.50),
				Throughput:  350.75,
			},
			Ports: model.PortDetailGroup{
				Open: []model.Port{
					{
						ID:                     0,
						IsRange:                true,
						PortNumber:             utils.IntPtr(8080),
						Status:                 utils.IntPtr(1), // active
						Direction:              "inbound",
						IsOpen:                 true,
						Count:                  3,
						AccessPolicy:           model.AllowAllAccess,
						LastConnectionDate:     "2023-03-21T10:15:00+09:00",
						LastConnectionEndpoint: "192.168.1.101",
						LastConnectionLog:      "...",
					},
					{
						ID:           1,
						IsRange:      true,
						PortNumber:   utils.IntPtr(8081),
						Status:       utils.IntPtr(0), // unconnected
						Direction:    "inbound",
						IsOpen:       true,
						Count:        1,
						AccessPolicy: model.OnlySpecific,
						AccessSources: []model.AccessSource{
							{
								IP:       "192.168.1.101",
								Protocol: "tcp",
								Comment:  "specific allowed",
							},
						},
					},
					{
						ID:           2,
						IsRange:      true,
						PortRange:    &model.PortRange{Start: "8083", End: "8085"},
						Status:       utils.IntPtr(2), // idle
						IsOpen:       true,
						Count:        0,
						AccessPolicy: model.AllowAllAccess,
					},
				},
				Closed: []model.Port{
					{
						ID:                     2,
						IsRange:                false,
						PortNumber:             utils.IntPtr(8082),
						Status:                 nil,
						Direction:              "inbound",
						IsOpen:                 false,
						Risk:                   utils.IntPtr(1),
						Count:                  10,
						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
						LastConnectionEndpoint: "192.168.1.102",
						LastConnectionLog:      "...",
					},
				},
			},
		},
		// Outbound은 임의 값으로 구성 (없다면 0으로 처리)
		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        0,
				Error:       0,
				Attempted:   0,
				LatencyRtt:  utils.Float64Ptr(0),
				Throughput:  0,
			},
			Ports: model.PortDetailGroup{
				Open: []model.Port{
					{
						ID:                     0,
						IsRange:                false,
						PortNumber:             utils.IntPtr(9000),
						Status:                 utils.IntPtr(1),
						Direction:              "outbound",
						IsOpen:                 true,
						Risk:                   nil,
						Count:                  1,
						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
						LastConnectionEndpoint: "192.168.1.102",
						LastConnectionLog:      "outbound log...",
						AccessPolicy:           model.AllowAllAccess,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},
}

// var MockWorkloadDetails = map[string]model.WorkloadDetail{
// 	"7431bb4f-cae8-4dbe-a542-d6f52c893271": {
// 		UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
// 		WorkloadName: "default-workload-1",
// 		Kind:         "deployment",
// 		Stats: model.Stats{
// 			Active:      1,
// 			Unconnected: 8079,
// 			Idle:        1,
// 			Error:       0,
// 			Attempted:   2,
// 			LatencyRtt:  utils.Float64Ptr(1.39),
// 			Throughput:  469.89,
// 		},
// 		Ports: map[string]model.PortDetailGroup{
// 			"inbound": {
// 				Open: []model.Port{
// 					{
// 						ID:                     0,
// 						IsRange:                false,
// 						PortNumber:             utils.IntPtr(8080),
// 						PortRange:              nil,
// 						Status:                 utils.IntPtr(1), // active
// 						Direction:              "inbound",
// 						IsOpen:                 true,
// 						Count:                  3,
// 						AccessPolicy:           model.AllowAllAccess,
// 						LastConnectionDate:     "2023-03-21T10:15:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.101",
// 						LastConnectionLog:      "192.168.10.101:34562 (remote-node) -> 172.16.0.236:8080 (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 					},
// 					{
// 						ID:           1,
// 						IsRange:      false,
// 						PortNumber:   utils.IntPtr(8081),
// 						PortRange:    nil,
// 						Status:       utils.IntPtr(0), // unconnected
// 						Direction:    "inbound",
// 						IsOpen:       true,
// 						Count:        1,
// 						AccessPolicy: model.OnlySpecific,
// 						AccessSources: []model.AccessSource{
// 							{
// 								IP:       "192.168.1.101",
// 								Protocol: "tcp",
// 								Comment:  "specific allowed",
// 							},
// 						},
// 					},
// 					{
// 						ID:           2,
// 						IsRange:      true,
// 						PortNumber:   nil,
// 						PortRange:    &model.PortRange{Start: "8083", End: "8085"},
// 						Status:       utils.IntPtr(0), // unconnected
// 						IsOpen:       true,
// 						Count:        0,
// 						AccessPolicy: model.AllowAllAccess,
// 					},
// 					{
// 						ID:                     0,
// 						IsRange:                false,
// 						PortNumber:             utils.IntPtr(9090),
// 						PortRange:              nil,
// 						Status:                 utils.IntPtr(2), // idle
// 						Direction:              "inbound",
// 						IsOpen:                 true,
// 						Count:                  1,
// 						AccessPolicy:           model.AllowAllAccess,
// 						LastConnectionDate:     "2022-03-21T10:15:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.101",
// 						LastConnectionLog:      "192.168.10.101:34562 (remote-node) -> 172.16.0.236:9090 (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 					},
// 				},
// 				Closed: []model.Port{
// 					{
// 						ID:                     2,
// 						IsRange:                false,
// 						PortNumber:             utils.IntPtr(8082),
// 						PortRange:              nil,
// 						Status:                 nil,
// 						Direction:              "inbound",
// 						IsOpen:                 false,
// 						Risk:                   utils.IntPtr(2),
// 						Count:                  10,
// 						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.102",
// 						LastConnectionLog:      "192.168.10.101:34562 (remote-node) -> 172.16.0.236:8082 (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 					},
// 				},
// 			},
// 			"outbound": {
// 				Open: []model.Port{
// 					{
// 						ID:                     0,
// 						IsRange:                false,
// 						PortNumber:             utils.IntPtr(9000),
// 						PortRange:              nil,
// 						Status:                 utils.IntPtr(1),
// 						Direction:              "outbound",
// 						IsOpen:                 true,
// 						Risk:                   nil,
// 						Count:                  1,
// 						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.102",
// 						LastConnectionLog:      "172.16.0.236:9000 (remote-node) -> (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 						AccessPolicy:           model.AllowAllAccess,
// 						AccessSources:          nil,
// 					},
// 				},
// 				Closed: []model.Port{},
// 			},
// 		},
// 	},
// 	"7f2552b4-ab40-4120-a6d9-16507024922b": {
// 		UUID:         "7f2552b4-ab40-4120-a6d9-16507024922b",
// 		WorkloadName: "default-workload-2",
// 		Kind:         "deployment",
// 		Stats: model.Stats{
// 			Active:      3,
// 			Unconnected: 5000,
// 			Idle:        0,
// 			Error:       1,
// 			Attempted:   3,
// 			LatencyRtt:  utils.Float64Ptr(2.50),
// 			Throughput:  350.75,
// 		},
// 		Ports: map[string]model.PortDetailGroup{
// 			"inbound": {
// 				Open: []model.Port{
// 					{
// 						ID:                     0,
// 						IsRange:                true,
// 						PortNumber:             utils.IntPtr(8080),
// 						PortRange:              nil,
// 						Status:                 utils.IntPtr(1), // active
// 						Direction:              "inbound",
// 						IsOpen:                 true,
// 						Count:                  3,
// 						AccessPolicy:           model.AllowAllAccess,
// 						LastConnectionDate:     "2023-03-21T10:15:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.101",
// 						LastConnectionLog:      "192.168.10.101:34562 (remote-node) -> 172.16.0.236:8080 (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 					},
// 					{
// 						ID:           1,
// 						IsRange:      true,
// 						PortNumber:   utils.IntPtr(8081),
// 						PortRange:    nil,
// 						Status:       utils.IntPtr(0), // unconnected
// 						Direction:    "inbound",
// 						IsOpen:       true,
// 						Count:        1,
// 						AccessPolicy: model.OnlySpecific,
// 						AccessSources: []model.AccessSource{
// 							{
// 								IP:       "192.168.1.101",
// 								Protocol: "tcp",
// 								Comment:  "specific allowed",
// 							},
// 						},
// 					},
// 					{
// 						ID:           2,
// 						IsRange:      true,
// 						PortNumber:   nil,
// 						PortRange:    &model.PortRange{Start: "8083", End: "8085"},
// 						Status:       utils.IntPtr(2), // idle
// 						IsOpen:       true,
// 						Count:        0,
// 						AccessPolicy: model.AllowAllAccess,
// 					},
// 				},
// 				Closed: []model.Port{
// 					{
// 						ID:                     2,
// 						IsRange:                false,
// 						PortNumber:             utils.IntPtr(8082),
// 						PortRange:              nil,
// 						Status:                 nil,
// 						Direction:              "inbound",
// 						IsOpen:                 false,
// 						Risk:                   utils.IntPtr(1),
// 						Count:                  10,
// 						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.102",
// 						LastConnectionLog:      "192.168.10.101:34562 (remote-node) -> 172.16.0.236:8082 (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 					},
// 				},
// 			},
// 			"outbound": {
// 				Open: []model.Port{
// 					{
// 						ID:                     0,
// 						IsRange:                false,
// 						PortNumber:             utils.IntPtr(9000),
// 						PortRange:              nil,
// 						Status:                 utils.IntPtr(1),
// 						Direction:              "outbound",
// 						IsOpen:                 true,
// 						Risk:                   nil,
// 						Count:                  1,
// 						LastConnectionDate:     "2023-03-21T10:20:00+09:00",
// 						LastConnectionEndpoint: "192.168.1.102",
// 						LastConnectionLog:      "172.16.0.236:9000 (remote-node) -> (health) to-endpoint FORWARDED (TCP Flags: ACK)",
// 						AccessPolicy:           model.AllowAllAccess,
// 						AccessSources:          nil,
// 					},
// 				},
// 				Closed: []model.Port{},
// 			},
// 		},
// 	},
// }

package mock

import (
	"wasm-go/model"
	"wasm-go/utils"
)

var MockClusters = []model.Cluster{
	{
		ID:          0,
		ClusterName: "cluster1",
		ClusterType: model.EKS_CLUSTER,
	},
	{
		ID:          1,
		ClusterName: "cluster2",
		ClusterType: model.AKS_CLUSTER,
	},
}

var MockNamespaces = map[string][]model.Namespace{
	"0": {
		{ID: 0, NamespaceName: "default"},
		{ID: 1, NamespaceName: "kube-system"},
		{ID: 2, NamespaceName: "cilium"},
	},
	"1": {
		{ID: 3, NamespaceName: "default"},
		{ID: 4, NamespaceName: "kube-system"},
		{ID: 5, NamespaceName: "cilium"},
	},
}

var MockWorkloads = map[string][]model.Workload{
	"default": {
		{
			UUID:                    "7431bb4f-cae8-4dbe-a542-d6f52c893271",
			WorkloadName:            "default-workload-1",
			ConnectedWorkloadStatus: model.BEFORE_INIT_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_DEPLOYMENT,
			Usage:                   0.7, // 70% CPU usage
			From: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
				{WorkloadId: "e7b5421a-e185-44e7-bd82-cdde1b60ff2a", Status: 4},
			},
			To: []model.Relation{},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      1,
					Unconnected: 8079,
					Idle:        1,
					Error:       0,
					Attempted:   2,
					LatencyRtt:  utils.Float64Ptr(1.39),
					Throughput:  469.89,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0.0),
					Throughput:  0.0,
				},
			},
		},
		{
			UUID:                    "7f2552b4-ab40-4120-a6d9-16507024922b",
			WorkloadName:            "default-workload-2",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_DEPLOYMENT,
			Usage:                   0.5, // 50% CPU usage
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "ebc762a3-54d7-4837-add6-8f42392a6bc7", Status: 4},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      3,
					Unconnected: 5000,
					Idle:        0,
					Error:       1,
					Attempted:   3,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "e7b5421a-e185-44e7-bd82-cdde1b60ff2a",
			WorkloadName:            "default-workload-3",
			ConnectedWorkloadStatus: model.BEFORE_INIT_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_DEMONSET,
			Usage:                   0.2, // 50% CPU usage
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 0},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        0,
					Error:       10,
					Attempted:   15,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "ebc762a3-54d7-4837-add6-8f42392a6bc7",
			WorkloadName:            "default-workload-4",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_CRONJOB,
			Usage:                   0.5, // 50% CPU usage
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 1},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        0,
					Error:       10,
					Attempted:   15,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "7161198e-eeb6-48c6-a15f-6c131393402d",
			WorkloadName:            "default-workload-5",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_JOB,
			Usage:                   0.7, // 70% CPU usage
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "e7b5421a-e185-44e7-bd82-cdde1b60ff2a", Status: 3},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        0,
					Error:       10,
					Attempted:   15,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "db123bf4-1eee-4fe1-81cc-66048d8f4ddd",
			WorkloadName:            "default-workload-6",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_REPLICASET,
			Usage:                   0.9, // 90% CPU usage
			From: []model.Relation{
				{WorkloadId: "7161198e-eeb6-48c6-a15f-6c131393402d", Status: 2},
			},
			To: []model.Relation{},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        0,
					Error:       50,
					Attempted:   15,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       50,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "8258ce53-0681-44db-b2ef-6793473c694e",
			WorkloadName:            "default-workload-7",
			ConnectedWorkloadStatus: model.BEFORE_INIT_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_ETC,
			Usage:                   0.2, // 20% CPU usage
			From: []model.Relation{
				{WorkloadId: "7161198e-eeb6-48c6-a15f-6c131393402d", Status: 2},
				{WorkloadId: "ebc762a3-54d7-4837-add6-8f42392a6bc7", Status: 0},
			},
			To: []model.Relation{},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        0,
					Error:       100,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "798df97d-11da-4409-bb4e-0621564a25e6",
			WorkloadName:            "default-workload-8",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_EXTERNAL,
			Usage:                   0.2, // 20% CPU usage
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "8258ce53-0681-44db-b2ef-6793473c694e", Status: 2},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        20,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        80,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "5f2f34c3-93ba-41e6-a40d-f1e975b5922e",
			WorkloadName:            "default-workload-9",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_STATEFULSET,
			Usage:                   0.2, // 20% CPU usage
			From: []model.Relation{
				{WorkloadId: "798df97d-11da-4409-bb4e-0621564a25e6", Status: 5},
			},
			To: []model.Relation{
				{WorkloadId: "8258ce53-0681-44db-b2ef-6793473c694e", Status: 2},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        20,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        80,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "b5879ff7-7bec-48d8-b542-84ca569d2b2d",
			WorkloadName:            "default-workload-10",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_STATEFULSET,
			Usage:                   0, // 0% CPU usage
			To: []model.Relation{
				{WorkloadId: "5f2f34c3-93ba-41e6-a40d-f1e975b5922e", Status: 2},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        20,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        80,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "bbb12ef1-6c1b-484f-81a1-0f8848a1ecc8",
			WorkloadName:            "default-workload-11",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    model.WORKLOAD_KIND_STATEFULSET,
			Usage:                   100, // 100% CPU usage
			To: []model.Relation{
				{WorkloadId: "5f2f34c3-93ba-41e6-a40d-f1e975b5922e", Status: 3},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      4,
					Unconnected: 5000,
					Idle:        20,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(2.50),
					Throughput:  350.75,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        80,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
	},
	"kube-system": {
		{
			UUID:                    "7431bb4f-cae8-4dbe-a542-d6f52c893271",
			WorkloadName:            "dns-autoscaler",
			ConnectedWorkloadStatus: model.BEFORE_INIT_SETUP,
			PolicySettingBadge:      true,
			Kind:                    "deployment",
			Usage:                   0.7,
			From: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
				{WorkloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99", Status: 4},
			},
			To: []model.Relation{
				{WorkloadId: "afbcb3d5-67e8-4f4b-9d8f-f0f124abc2f2", Status: 2},
				{WorkloadId: "b726573d-4914-42ab-be5e-fb1daecec08b", Status: 2},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      1,
					Unconnected: 1000,
					Idle:        1,
					Error:       0,
					Attempted:   2,
					LatencyRtt:  utils.Float64Ptr(1.0),
					Throughput:  200.0,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0.0),
					Throughput:  0.0,
				},
			},
		},
		{
			UUID:                    "7f2552b4-ab40-4120-a6d9-16507024922b",
			WorkloadName:            "metrics-server",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    "deployment",
			Usage:                   0.5,
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271", Status: 4},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      2,
					Unconnected: 2000,
					Idle:        0,
					Error:       0,
					Attempted:   1,
					LatencyRtt:  utils.Float64Ptr(1.5),
					Throughput:  150.0,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
	},
	"cilium": {
		{
			UUID:                    "7431bb4f-cae8-4dbe-a542-d6f52c893271",
			WorkloadName:            "cilium-monitor",
			ConnectedWorkloadStatus: model.BEFORE_INIT_SETUP,
			PolicySettingBadge:      true,
			Kind:                    "deployment",
			Usage:                   0.6,
			From: []model.Relation{
				{WorkloadId: "7f2552b4-ab40-4120-a6d9-16507024922b", Status: 4},
				{WorkloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99", Status: 4},
			},
			To: []model.Relation{
				{WorkloadId: "afbcb3d5-67e8-4f4b-9d8f-f0f124abc2f2", Status: 2},
				{WorkloadId: "b726573d-4914-42ab-be5e-fb1daecec08b", Status: 2},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      1,
					Unconnected: 3000,
					Idle:        1,
					Error:       0,
					Attempted:   2,
					LatencyRtt:  utils.Float64Ptr(1.2),
					Throughput:  250.0,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
		{
			UUID:                    "7f2552b4-ab40-4120-a6d9-16507024922b",
			WorkloadName:            "cilium-agent",
			ConnectedWorkloadStatus: model.COMPLETE_SETUP,
			PolicySettingBadge:      true,
			Kind:                    "deployment",
			Usage:                   0.5,
			From:                    []model.Relation{},
			To: []model.Relation{
				{WorkloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271", Status: 4},
			},
			Inbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      2,
					Unconnected: 2500,
					Idle:        0,
					Error:       1,
					Attempted:   3,
					LatencyRtt:  utils.Float64Ptr(2.0),
					Throughput:  300.0,
				},
			},
			Outbound: model.TrafficStats{
				Stats: model.Stats{
					Active:      0,
					Unconnected: 0,
					Idle:        0,
					Error:       0,
					Attempted:   0,
					LatencyRtt:  utils.Float64Ptr(0),
					Throughput:  0,
				},
			},
		},
	},
}

var MockWorkloadDetails = map[string]model.WorkloadDetail{
	// 1) default-workload-1
	"7431bb4f-cae8-4dbe-a542-d6f52c893271": {
		UUID:         "7431bb4f-cae8-4dbe-a542-d6f52c893271",
		WorkloadName: "default-workload-1",
		Kind:         model.WORKLOAD_KIND_DEPLOYMENT,
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
						ID:                         0,
						IsRange:                    false,
						PortNumber:                 utils.IntPtr(8080),
						Status:                     utils.IntPtr(1), // active
						Direction:                  "inbound",
						IsOpen:                     true,
						Count:                      3,
						AccessPolicy:               model.AllOW_All_ACCESS,
						LastConnectionDate:         "2023-03-21T10:15:00+09:00",
						LastConnectionEndpoint:     "192.168.1.101",
						LastConnectionLog:          "192.168.10.101:34562 -> 172.16.0.236:8080 (TCP Flags: ACK)",
						LastConnectionWorkloadUUID: "e7b5421a-e185-44e7-bd82-cdde1b60ff2a",
					},
					{
						ID:           1,
						IsRange:      false,
						PortNumber:   utils.IntPtr(8081),
						Status:       utils.IntPtr(0), // unconnected
						Direction:    "inbound",
						IsOpen:       true,
						Count:        0,
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
					},
					{
						ID:                     3,
						IsRange:                false,
						PortNumber:             utils.IntPtr(9090),
						Status:                 utils.IntPtr(2), // idle
						Direction:              "inbound",
						IsOpen:                 true,
						Count:                  1,
						AccessPolicy:           model.AllOW_All_ACCESS,
						LastConnectionDate:     "2022-03-21T10:15:00+09:00",
						LastConnectionEndpoint: "192.168.1.101",
						LastConnectionLog:      "remote-node -> 172.16.0.236:9090 (health)",
					},
				},
				Closed: []model.Port{
					{
						ID:                         4,
						IsRange:                    false,
						PortNumber:                 utils.IntPtr(8082),
						Status:                     nil,
						Direction:                  "inbound",
						IsOpen:                     false,
						Risk:                       utils.IntPtr(2),
						Count:                      10,
						LastConnectionDate:         "2023-03-21T10:20:00+09:00",
						LastConnectionEndpoint:     "192.168.1.102",
						LastConnectionLog:          "remote-node -> 172.16.0.236:8082 (health)",
						LastConnectionWorkloadUUID: "7f2552b4-ab40-4120-a6d9-16507024922b",
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
		Kind:         model.WORKLOAD_KIND_DEPLOYMENT,

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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 3) default-workload-3
	"e7b5421a-e185-44e7-bd82-cdde1b60ff2a": {
		UUID:         "e7b5421a-e185-44e7-bd82-cdde1b60ff2a",
		WorkloadName: "default-workload-3",
		Kind:         model.WORKLOAD_KIND_DEPLOYMENT,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        0,
				Error:       10,
				Attempted:   15,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 4) default-workload-4
	"ebc762a3-54d7-4837-add6-8f42392a6bc7": {
		UUID:         "ebc762a3-54d7-4837-add6-8f42392a6bc7",
		WorkloadName: "default-workload-4",
		Kind:         model.WORKLOAD_KIND_CRONJOB,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        0,
				Error:       10,
				Attempted:   15,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 5) default-workload-5
	"7161198e-eeb6-48c6-a15f-6c131393402d": {
		UUID:         "7161198e-eeb6-48c6-a15f-6c131393402d",
		WorkloadName: "default-workload-5",
		Kind:         model.WORKLOAD_KIND_JOB,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        0,
				Error:       10,
				Attempted:   15,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 6) default-workload-6
	"db123bf4-1eee-4fe1-81cc-66048d8f4ddd": {
		UUID:         "db123bf4-1eee-4fe1-81cc-66048d8f4ddd",
		WorkloadName: "default-workload-6",
		Kind:         model.WORKLOAD_KIND_REPLICASET,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        0,
				Error:       50,
				Attempted:   15,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        0,
				Error:       50,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 7) default-workload-7
	"8258ce53-0681-44db-b2ef-6793473c694e": {
		UUID:         "8258ce53-0681-44db-b2ef-6793473c694e",
		WorkloadName: "default-workload-7",
		Kind:         model.WORKLOAD_KIND_ETC,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        0,
				Error:       100,
				Attempted:   0,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 8) default-workload-8
	"798df97d-11da-4409-bb4e-0621564a25e6": {
		UUID:         "798df97d-11da-4409-bb4e-0621564a25e6",
		WorkloadName: "default-workload-8",
		Kind:         model.WORKLOAD_KIND_EXTERNAL,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        20,
				Error:       0,
				Attempted:   0,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        80,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 9) default-workload-9
	"5f2f34c3-93ba-41e6-a40d-f1e975b5922e": {
		UUID:         "5f2f34c3-93ba-41e6-a40d-f1e975b5922e",
		WorkloadName: "default-workload-9",
		Kind:         model.WORKLOAD_KIND_STATEFULSET,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        20,
				Error:       0,
				Attempted:   0,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        80,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 10) default-workload-10
	"b5879ff7-7bec-48d8-b542-84ca569d2b2d": {
		UUID:         "b5879ff7-7bec-48d8-b542-84ca569d2b2d",
		WorkloadName: "default-workload-10",
		Kind:         model.WORKLOAD_KIND_STATEFULSET,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        20,
				Error:       0,
				Attempted:   0,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        80,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
						AccessSources:          nil,
					},
				},
				Closed: []model.Port{},
			},
		},
	},

	// 11) default-wowrkload-11
	"bbb12ef1-6c1b-484f-81a1-0f8848a1ecc8": {
		UUID:         "bbb12ef1-6c1b-484f-81a1-0f8848a1ecc8",
		WorkloadName: "default-workload-11",
		Kind:         model.WORKLOAD_KIND_STATEFULSET,
		Inbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      4,
				Unconnected: 5000,
				Idle:        20,
				Error:       0,
				Attempted:   0,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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
						AccessPolicy: model.ONLY_SPECIFIC,
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
						AccessPolicy: model.AllOW_All_ACCESS,
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
		Outbound: model.TrafficInfo{
			Stats: model.Stats{
				Active:      0,
				Unconnected: 0,
				Idle:        80,
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
						AccessPolicy:           model.AllOW_All_ACCESS,
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

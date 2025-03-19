package main

import (
	"encoding/json"
	"strconv"
	"syscall/js"
	"time"
	"wasm-go/mock"
	"wasm-go/model"
	"wasm-go/utils"
)

var workloadDetails map[string]model.WorkloadDetail = nil

func main() {
	done := make(chan struct{}, 0)

	js.Global().Set("listClusters", js.FuncOf(listClusters))
	js.Global().Set("listNamespace", js.FuncOf(listNamespace))
	js.Global().Set("listWorkloads", js.FuncOf(listWorkloads))
	js.Global().Set("getWorkloadDetail", js.FuncOf(getWorkloadDetail))
	js.Global().Set("closeNotActivePorts", js.FuncOf(closeNotActivePorts))
	js.Global().Set("closePortsByStatus", js.FuncOf(closePortsByStatus))
	js.Global().Set("openPort", js.FuncOf(openPort))
	js.Global().Set("editPort", js.FuncOf(editPort))
	js.Global().Set("closeOpenedPort", js.FuncOf(closeOpenedPort))
	js.Global().Set("openClosedPort", js.FuncOf(openClosedPort))
	js.Global().Set("clearClosedPortHistory", js.FuncOf(clearClosedPortHistory))

	<-done
}

func listClusters(this js.Value, p []js.Value) interface{} {
	clusters := mock.MockClusters
	response := map[string]interface{}{
		"result": clusters,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func listNamespace(this js.Value, p []js.Value) interface{} {
	clusterID := p[0].String()

	namespaces := mock.MockNamespaces[clusterID]
	response := map[string]interface{}{
		"result": namespaces,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func listWorkloads(this js.Value, p []js.Value) interface{} {
	nsName := p[0].String()

	resources := utils.DeepCopyWorkloads(mock.MockWorkloads[nsName])

	workloadInfoMap := make(map[string]struct {
		Info      model.InlineWorkload
		Namespace string
	})

	// Collect all workload information from all namespaces
	for namespace, workloads := range mock.MockWorkloads {
		for _, workload := range workloads {
			workloadInfoMap[workload.UUID] = struct {
				Info      model.InlineWorkload
				Namespace string
			}{
				Info: model.InlineWorkload{
					UUID:         workload.UUID,
					WorkloadName: workload.WorkloadName,
					Namespace:    namespace,
					Kind:         workload.Kind,
				},
				Namespace: namespace,
			}
		}
	}

	// Update the relationships in workloads
	for i := range resources {
		// Update "From" relationships
		for j := range resources[i].From {
			wID := resources[i].From[j].WorkloadId
			resources[i].From[j].Direction = "inbound"

			if info, exists := workloadInfoMap[wID]; exists {
				if info.Namespace != nsName {
					resources[i].From[j].Workload = &model.InlineWorkload{
						UUID:         info.Info.UUID,
						WorkloadName: info.Info.WorkloadName,
						Namespace:    info.Namespace,
						Kind:         info.Info.Kind,
					}
				}
			}
		}

		// Update "To" relationships
		for j := range resources[i].To {
			wID := resources[i].To[j].WorkloadId
			resources[i].To[j].Direction = "outbound"

			if info, exists := workloadInfoMap[wID]; exists {
				if info.Namespace != nsName {
					resources[i].To[j].Workload = &model.InlineWorkload{
						UUID:         info.Info.UUID,
						WorkloadName: info.Info.WorkloadName,
						Namespace:    info.Namespace,
						Kind:         info.Info.Kind,
					}
				}
			}
		}
	}

	response := map[string]interface{}{
		"result": resources,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func getWorkloadDetail(this js.Value, p []js.Value) interface{} {
	workloadID := p[0].String()

	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	selectedWorkload := workloadDetails[workloadID]
	response := map[string]interface{}{
		"result": selectedWorkload,
	}
	b, _ := json.Marshal(response)

	return string(b)
}

func closePortsByStatus(this js.Value, p []js.Value) interface{} {
	requestJSON := p[0].String()

	var requests []model.ClosePortsByStatusRequest
	if err := json.Unmarshal([]byte(requestJSON), &requests); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	var updatedWorkloads []model.WorkloadDetail
	totalClosedCount := 0

	for _, req := range requests {
		wDetail, ok := workloadDetails[req.WorkloadUUID]
		if !ok {
			continue // Skip if workload not found
		}
		var group *model.PortDetailGroup

		switch req.Flag {
		case "0":
			group = &wDetail.Inbound.Ports
		case "1":
			group = &wDetail.Outbound.Ports
		default:
			return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
		}

		var statusCodes []int
		for _, status := range req.Status {
			switch status {
			case "active":
				statusCodes = append(statusCodes, 1)
			case "idle":
				statusCodes = append(statusCodes, 2)
			case "error":
				statusCodes = append(statusCodes, 3)
			case "attempt":
				statusCodes = append(statusCodes, 4)
			case "unconnected":
				statusCodes = append(statusCodes, 0)
			}
		}

		var portsToClose []model.Port
		var remainingOpenPorts []model.Port

		for _, port := range group.Open {
			shouldClose := false
			if port.Status != nil {
				for _, code := range statusCodes {
					if *port.Status == code {
						shouldClose = true
						break
					}
				}
			}

			if shouldClose {
				port.IsOpen = false
				if port.Risk == nil {
					port.Risk = utils.IntPtr(0)
				}

				portsToClose = append(portsToClose, port)
			} else {
				remainingOpenPorts = append(remainingOpenPorts, port)
			}
		}

		group.Open = remainingOpenPorts
		group.Closed = append(group.Closed, portsToClose...)

		workloadDetails[req.WorkloadUUID] = wDetail

		updatedWorkloads = append(updatedWorkloads, wDetail)
		totalClosedCount += len(portsToClose)
	}

	response := map[string]interface{}{
		"result":          "ports closed",
		"request":         requests,
		"updatedWorkload": updatedWorkloads,
	}

	b, _ := json.Marshal(response)
	return string(b)
}

func closeNotActivePorts(this js.Value, p []js.Value) interface{} {
	requestJSON := p[0].String()

	var req model.CloseNotActivePortsRequest
	if err := json.Unmarshal([]byte(requestJSON), &req); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	// workloadDetails 초기화 (없다면 mock 데이터 로드)
	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	wDetail, ok := workloadDetails[req.WorkloadUUID]
	if !ok {
		return string(utils.MustMarshal(map[string]string{"error": "workload not found"}))
	}

	var group *model.PortDetailGroup
	switch req.Flag {
	case 0:
		// Inbound
		group = &wDetail.Inbound.Ports
	case 1:
		// Outbound
		group = &wDetail.Outbound.Ports
	default:
		return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
	}

	// Active가 아닌 포트들을 식별
	var newOpenPorts []model.Port

	for _, port := range group.Open {
		if *port.Status == 1 {
			newOpenPorts = append(newOpenPorts, port)
		}
	}

	group.Open = newOpenPorts

	workloadDetails[req.WorkloadUUID] = wDetail

	response := map[string]interface{}{
		"result":          "non-active ports closed",
		"updatedWorkload": wDetail,
	}

	b, _ := json.Marshal(response)
	return string(b)
}
func openPort(this js.Value, p []js.Value) interface{} {
	requestJSON := p[0].String()

	var req model.PortControlBase
	if err := json.Unmarshal([]byte(requestJSON), &req); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	// workloadDetails 초기화
	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	wDetail, ok := workloadDetails[req.WorkloadUUID]
	if !ok {
		return string(utils.MustMarshal(map[string]string{"error": "workload not found"}))
	}

	var group *model.PortDetailGroup
	switch req.Flag {
	case 0:
		// Inbound
		group = &wDetail.Inbound.Ports
	case 1:
		// Outbound
		group = &wDetail.Outbound.Ports
	default:
		return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
	}

	ports, isRange, err := utils.ParsePortSpec(req.PortSpec)
	if err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid port spec: " + err.Error()}))
	}

	var portSources []model.AccessSource
	if req.AccessPolicy == model.ONLY_SPECIFIC || req.AccessPolicy == model.EXCLUDE_SPECIFIC {
		currentTime := time.Now().Format(time.RFC3339)
		for _, s := range req.Sources {
			portSources = append(portSources, model.AccessSource{
				IP:            s.IP,
				Protocol:      s.Protocol,
				Comment:       s.Comment,
				LastUpdatedAt: currentTime,
			})
		}
	}

	if isRange {
		// 포트 범위 하나만 생성
		newPort := model.Port{
			ID:         len(group.Open),
			IsRange:    true,
			PortNumber: nil,
			PortRange: &model.PortRange{
				Start: strconv.Itoa(ports[0]),
				End:   strconv.Itoa(ports[len(ports)-1]),
			},
			Status:                 utils.IntPtr(0),
			AccessPolicy:           req.AccessPolicy,
			AccessSources:          portSources,
			IsOpen:                 true,
			Count:                  0,
			LastConnectionDate:     nil,
			LastConnectionEndpoint: nil,
			LastConnectionLog:      nil,
		}
		group.Open = append(group.Open, newPort)
	} else {
		// 단일/다중 포트 (하이픈 없이 , 로 구분되었을 때)
		for _, portNum := range ports {
			newPort := model.Port{
				ID:                     len(group.Open),
				IsRange:                false,
				PortNumber:             utils.IntPtr(portNum),
				PortRange:              nil,
				Status:                 utils.IntPtr(0),
				AccessPolicy:           req.AccessPolicy,
				AccessSources:          portSources,
				IsOpen:                 true,
				Count:                  0,
				LastConnectionDate:     nil,
				LastConnectionEndpoint: nil,
				LastConnectionLog:      nil,
			}
			group.Open = append(group.Open, newPort)
		}
	}

	workloadDetails[req.WorkloadUUID] = wDetail

	response := map[string]interface{}{
		"result":          "port opened",
		"request":         req,
		"updatedWorkload": wDetail,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func closeOpenedPort(this js.Value, p []js.Value) interface{} {
	requestJSON := p[0].String()
	var req model.PortControlRequest
	if err := json.Unmarshal([]byte(requestJSON), &req); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	// workloadDetails 초기화 (없다면 mock 데이터 로드)
	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	wDetail, ok := workloadDetails[req.WorkloadUUID]
	if !ok {
		return string(utils.MustMarshal(map[string]string{"error": "workload not found"}))
	}

	var group *model.PortDetailGroup
	switch req.Flag {
	case 0:
		group = &wDetail.Inbound.Ports
	case 1:
		group = &wDetail.Outbound.Ports
	default:
		return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
	}

	ports, isRange, err := utils.ParsePortSpec(req.PortSpec)
	if err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid port spec: " + err.Error()}))
	}
	if len(ports) == 0 {
		return string(utils.MustMarshal(map[string]string{"error": "no port specified"}))
	}

	var targetPort *model.Port
	var portIndex int = -1

	if isRange {
		startStr := strconv.Itoa(ports[0])
		endStr := strconv.Itoa(ports[len(ports)-1])
		for i, p := range group.Open {
			if p.IsRange && p.PortRange != nil {
				if p.PortRange.Start == startStr && p.PortRange.End == endStr {
					targetPort = &group.Open[i]
					portIndex = i
					break
				}
			}
		}
		if targetPort == nil {
			return string(utils.MustMarshal(map[string]string{"error": "port range not found"}))
		}
	} else {
		singlePort := ports[0]
		for i, p := range group.Open {
			if !p.IsRange && p.PortNumber != nil && *p.PortNumber == singlePort {
				targetPort = &group.Open[i]
				portIndex = i
				break
			}
		}
		if targetPort == nil {
			return string(utils.MustMarshal(map[string]string{"error": "port not found"}))
		}
	}

	group.Open = append(group.Open[:portIndex], group.Open[portIndex+1:]...)

	workloadDetails[req.WorkloadUUID] = wDetail

	response := map[string]interface{}{
		"result":          "port closed",
		"request":         req,
		"updatedWorkload": wDetail,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func editPort(this js.Value, p []js.Value) interface{} {
	requestJSON := p[0].String()

	var req model.PortControlBase
	if err := json.Unmarshal([]byte(requestJSON), &req); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	// workloadDetails 초기화
	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	wDetail, ok := workloadDetails[req.WorkloadUUID]
	if !ok {
		return string(utils.MustMarshal(map[string]string{"error": "workload not found"}))
	}

	var group *model.PortDetailGroup
	switch req.Flag {
	case 0:
		// Inbound
		group = &wDetail.Inbound.Ports
	case 1:
		// Outbound
		group = &wDetail.Outbound.Ports
	default:
		return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
	}

	// Assuming only a single port is valid
	ports, _, err := utils.ParsePortSpec(req.PortSpec)
	if err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid port spec: " + err.Error()}))
	}

	singlePort := ports[0]

	targetPort, portIndex := utils.FindPort(*group, singlePort)
	if targetPort == nil {
		return string(utils.MustMarshal(map[string]string{"error": "port not found"}))
	}

	var newSources []model.AccessSource
	if req.AccessPolicy == model.ONLY_SPECIFIC || req.AccessPolicy == model.EXCLUDE_SPECIFIC {
		currentTime := time.Now().Format(time.RFC3339)

		for _, s := range req.Sources {
			newSources = append(newSources, model.AccessSource{
				IP:            s.IP,
				Protocol:      s.Protocol,
				Comment:       s.Comment,
				LastUpdatedAt: currentTime,
			})
		}
	}

	targetPort.AccessPolicy = req.AccessPolicy
	targetPort.AccessSources = newSources

	group.Open[portIndex] = *targetPort

	workloadDetails[req.WorkloadUUID] = wDetail

	response := map[string]interface{}{
		"result":          "port edited successfully",
		"request":         req,
		"updatedWorkload": wDetail,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func openClosedPort(this js.Value, p []js.Value) interface{} {
	var req model.PortControlRequest
	if err := json.Unmarshal([]byte(p[0].String()), &req); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	// workloadDetails 초기화
	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	wDetail, ok := workloadDetails[req.WorkloadUUID]
	if !ok {
		return string(utils.MustMarshal(map[string]string{"error": "workload not found"}))
	}

	var group *model.PortDetailGroup
	switch req.Flag {
	case 0:
		group = &wDetail.Inbound.Ports
	case 1:
		group = &wDetail.Outbound.Ports
	default:
		return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
	}

	ports, isRange, err := utils.ParsePortSpec(req.PortSpec)
	if err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid port spec: " + err.Error()}))
	}
	if len(ports) == 0 {
		return string(utils.MustMarshal(map[string]string{"error": "no port specified"}))
	}

	var targetPort *model.Port
	var portIndex int = -1

	if isRange {
		startStr := strconv.Itoa(ports[0])
		endStr := strconv.Itoa(ports[len(ports)-1])
		for i, p := range group.Closed {
			if p.IsRange && p.PortRange != nil {
				if p.PortRange.Start == startStr && p.PortRange.End == endStr {
					targetPort = &group.Closed[i]
					portIndex = i
					break
				}
			}
		}
		if targetPort == nil {
			return string(utils.MustMarshal(map[string]string{"error": "port range not found in closed ports"}))
		}
	} else {
		singlePort := ports[0]
		for i, p := range group.Closed {
			if !p.IsRange && p.PortNumber != nil && *p.PortNumber == singlePort {
				targetPort = &group.Closed[i]
				portIndex = i
				break
			}
		}
		if targetPort == nil {
			return string(utils.MustMarshal(map[string]string{"error": "port not found in closed ports"}))
		}
	}

	if targetPort.Count == 0 {
		return string(utils.MustMarshal(map[string]string{"error": "port has no connection attempt; cannot re-open"}))
	}

	targetPort.AccessPolicy = model.AllOW_All_ACCESS
	targetPort.Risk = utils.IntPtr(0)
	// 포트를 열린 상태로 전환 (Status 0: unconnected, IsOpen true)
	targetPort.Status = utils.IntPtr(0)
	targetPort.IsOpen = true

	group.Closed = append(group.Closed[:portIndex], group.Closed[portIndex+1:]...)
	group.Open = append(group.Open, *targetPort)

	workloadDetails[req.WorkloadUUID] = wDetail

	response := map[string]interface{}{
		"result":          "closed port allowed and re-opened with allow-all policy",
		"request":         req,
		"updatedWorkload": wDetail,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func clearClosedPortHistory(this js.Value, p []js.Value) interface{} {
	requestJSON := p[0].String()
	var req model.PortControlRequest
	if err := json.Unmarshal([]byte(requestJSON), &req); err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid request: " + err.Error()}))
	}

	// workloadDetails 초기화 (없다면 mock 데이터 로드)
	if workloadDetails == nil {
		workloadDetails = mock.MockWorkloadDetails
	}

	wDetail, ok := workloadDetails[req.WorkloadUUID]
	if !ok {
		return string(utils.MustMarshal(map[string]string{"error": "workload not found"}))
	}

	var group *model.PortDetailGroup
	switch req.Flag {
	case 0:
		group = &wDetail.Inbound.Ports
	case 1:
		group = &wDetail.Outbound.Ports
	default:
		return string(utils.MustMarshal(map[string]string{"error": "unknown flag"}))
	}

	ports, isRange, err := utils.ParsePortSpec(req.PortSpec)
	if err != nil {
		return string(utils.MustMarshal(map[string]string{"error": "invalid port spec: " + err.Error()}))
	}
	if len(ports) == 0 {
		return string(utils.MustMarshal(map[string]string{"error": "no port specified"}))
	}

	var targetPort *model.Port
	var portIndex int = -1

	if isRange {
		startStr := strconv.Itoa(ports[0])
		endStr := strconv.Itoa(ports[len(ports)-1])
		for i, p := range group.Closed {
			if p.IsRange && p.PortRange != nil {
				if p.PortRange.Start == startStr && p.PortRange.End == endStr {
					targetPort = &group.Closed[i]
					portIndex = i
					break
				}
			}
		}
		if targetPort == nil {
			return string(utils.MustMarshal(map[string]string{"error": "port range not found in closed ports"}))
		}
	} else {
		singlePort := ports[0]
		for i, p := range group.Closed {
			if !p.IsRange && p.PortNumber != nil && *p.PortNumber == singlePort {
				targetPort = &group.Closed[i]
				portIndex = i
				break
			}
		}
		if targetPort == nil {
			return string(utils.MustMarshal(map[string]string{"error": "port not found in closed ports"}))
		}
	}

	group.Closed = append(group.Closed[:portIndex], group.Closed[portIndex+1:]...)

	workloadDetails[req.WorkloadUUID] = wDetail

	response := map[string]interface{}{
		"result":          "closed port history cleared and port removed from closed array",
		"request":         req,
		"updatedWorkload": wDetail,
	}
	b, _ := json.Marshal(response)
	return string(b)
}
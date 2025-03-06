package main

import (
	"encoding/json"
	"strconv"
	"syscall/js"
	"wasm-go/mock"
	"wasm-go/model"
	"wasm-go/utils"
)

var workloadDetails map[string]model.WorkloadDetail = nil

func main() {
	done := make(chan struct{}, 0)

	js.Global().Set("listNamespace", js.FuncOf(listNamespace))
	js.Global().Set("listWorkloads", js.FuncOf(listWorkloads))
	js.Global().Set("getWorkloadDetail", js.FuncOf(getWorkloadDetail))
	js.Global().Set("openPort", js.FuncOf(openPort))
	js.Global().Set("editPort", js.FuncOf(editPort))
	js.Global().Set("closeOpenedPort", js.FuncOf(closeOpenedPort))
	js.Global().Set("openClosedPort", js.FuncOf(openClosedPort))
	js.Global().Set("clearClosedPortHistory", js.FuncOf(clearClosedPortHistory))

	<-done
}

func listNamespace(this js.Value, p []js.Value) interface{} {
	namespaces := mock.MockNamespaces
	response := map[string]interface{}{
		"result": namespaces,
	}
	b, _ := json.Marshal(response)
	return string(b)
}

func listWorkloads(this js.Value, p []js.Value) interface{} {
	nsName := p[0].String()

	resources := mock.MockWorkloads[nsName]
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
	if req.AccessPolicy == model.OnlySpecific || req.AccessPolicy == model.ExcludeSpecific {
		for _, s := range req.Sources {
			portSources = append(portSources, model.AccessSource{
				IP:       s.IP,
				Protocol: s.Protocol,
				Comment:  s.Comment,
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
	if req.AccessPolicy == model.OnlySpecific || req.AccessPolicy == model.ExcludeSpecific {
		for _, s := range req.Sources {
			newSources = append(newSources, model.AccessSource{
				IP:       s.IP,
				Protocol: s.Protocol,
				Comment:  s.Comment,
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

	targetPort.AccessPolicy = model.AllowAllAccess
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

// func MyGoFunc() js.Func {
// 	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 		requestUrl := args[0].String()

// 		handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 			resolve := args[0]
// 			reject := args[1]

// 			go func() {
// 				res, err := http.DefaultClient.Get(requestUrl)
// 				if err != nil {
// 					errorConstructor := js.Global().Get("Error")
// 					errorObject := errorConstructor.New(err.Error())
// 					reject.Invoke(errorObject)
// 					return
// 				}
// 				defer res.Body.Close()

// 				data, err := ioutil.ReadAll(res.Body)
// 				if err != nil {
// 					errorConstructor := js.Global().Get("Error")
// 					errorObject := errorConstructor.New(err.Error())
// 					reject.Invoke(errorObject)
// 					return
// 				}

// 				arrayConstructor := js.Global().Get("Uint8Array")
// 				dataJS := arrayConstructor.New(len(data))
// 				js.CopyBytesToJS(dataJS, data)

// 				responseConstructor := js.Global().Get("Response")
// 				response := responseConstructor.New(dataJS)

// 				resolve.Invoke(response)
// 			}()

// 			return nil
// 		})

// 		promiseConstructor := js.Global().Get("Promise")
// 		return promiseConstructor.New(handler)
// 	})
// }

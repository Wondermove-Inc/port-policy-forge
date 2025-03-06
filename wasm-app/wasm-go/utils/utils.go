package utils

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"wasm-go/model"
)

func IntPtr(n int) *int {
	return &n
}

func Float64Ptr(f float64) *float64 {
	return &f
}

func MustMarshal(v interface{}) []byte {
	b, err := json.Marshal(v)
	if err != nil {
		return []byte("{}")
	}
	return b
}

func ParsePortSpec(spec string) (ports []int, isRange bool, err error) {
	// range: "-"만 포함 (콤마가 없을 때)
	if strings.Contains(spec, "-") && !strings.Contains(spec, ",") {
		isRange = true
		parts := strings.Split(spec, "-")
		if len(parts) != 2 {
			return nil, false, fmt.Errorf("invalid range spec")
		}
		start, err := strconv.Atoi(strings.TrimSpace(parts[0]))
		if err != nil {
			return nil, false, err
		}
		end, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err != nil {
			return nil, false, err
		}
		if start > end {
			return nil, false, fmt.Errorf("range start greater than end")
		}

		for i := start; i <= end; i++ {
			ports = append(ports, i)
		}
		return ports, true, nil
	}

	// 단일 포트 또는 다중 포트 (콤마로 구분)
	parts := strings.Split(spec, ",")
	for _, part := range parts {
		port, err := strconv.Atoi(strings.TrimSpace(part))
		if err != nil {
			return nil, false, err
		}
		ports = append(ports, port)
	}
	return ports, false, nil
}

func FindPort(group model.PortDetailGroup, singlePort int) (port *model.Port, idx int) {
	for i := range group.Open {
		if !group.Open[i].IsRange && group.Open[i].PortNumber != nil {
			if *group.Open[i].PortNumber == singlePort {
				return &group.Open[i], i
			}
		}
	}
	return nil, -1
}

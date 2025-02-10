package main

import "net"

type NetworkInterface struct {
	interfaces map[int]NetInfo
}

type NetInfo struct {
	Name  string
	IP    string
	Index int
}

func NewNetworkInterface() *NetworkInterface {
	neti := &NetworkInterface{
		interfaces: make(map[int]NetInfo),
	}

	return neti
}

func (n *NetworkInterface) GetNetworkInterface() {
	ifaces, err := net.Interfaces()
	if err != nil {
		return
	}

	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 {
			continue // interface down
		}

		if iface.Flags&net.FlagLoopback != 0 {
			continue // ignore loopback interface
		}

		addrs, err := iface.Addrs()
		if err != nil {
			return
		}

		for _, addr := range addrs {
			var ip net.IP

			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}

			if ip == nil || ip.IsLoopback() {
				continue
			}

			ip = ip.To4()
			if ip == nil {
				continue // not an ipv4 address
			}

			n.interfaces[iface.Index] = NetInfo{
				Name:  iface.Name,
				IP:    ip.String(),
				Index: iface.Index,
			}
		}
	}
}

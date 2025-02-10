CLANG ?= clang-12
CFLAGS := '-O2 -g -Wall -Werror $(CFLAGS)'
TARGETS ?= bpf
HEADERS ?= ./bpf/headers

all: probe build

probe: export GOPACKAGE=main
probe:
	bpf2go -cc clang -cflags $(CFLAGS) -target $(TARGETS) -type net_packet_event TCFilter ./bpf/tc_filter.bpf.c -- -I $(HEADERS) 

build:
	go build -o tc-filter

run:
	./tc-filter
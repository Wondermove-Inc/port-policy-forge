import { useMemo, useState } from "react";

import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { PortDetail } from "./PortDetail";

import { ModalConfirm } from "@/components/atoms/ModalConfirm";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { WarningIcon } from "@/components/icons/WarningIcon";
import { CollapsibleTable } from "@/components/modules/common/CollapsibleTable";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Port, PortDirection, PortRisk } from "@/models";
import { getPortFlag, getPortNumberValue, getPortRiskLabel } from "@/utils";
import { formatNumber, formatter } from "@/utils/format";
import { wasmOpenClosedPort } from "@/services/openClosedPort";

type ClosePortProps = {
  data: Port[];
  fetchWorkloadDetail: () => void;
  workloadUuid: string;
};

export const ClosePort = ({
  data,
  fetchWorkloadDetail,
  workloadUuid,
}: ClosePortProps) => {
  const allowPortModal = useDisclosure();
  const clearHistoryModal = useDisclosure();

  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [loading, setLoading] = useState(false);

  const openAllowPortModal = (record: Port) => {
    setSelectedPort(record);
    allowPortModal.open();
  };

  const handleAllowPort = () => {
    if (!selectedPort) {
      return;
    }
    setLoading(true);
    const params = {
      workloadUuid: workloadUuid,
      flag: getPortFlag(selectedPort?.direction),
      portSpec: getPortNumberValue({
        isRange: selectedPort.isRange,
        portRange: selectedPort.portRange,
        portNumber: selectedPort.portNumber,
      }),
    };
    console.log(params);
    wasmOpenClosedPort(params)
      .then(() => {
        fetchWorkloadDetail();
        allowPortModal.close();
      })
      .catch((error) => {
        // TODO: handle error
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearHistory = () => {
    // TODO
    fetchWorkloadDetail();
    clearHistoryModal.close();
  };

  const columns = useMemo(() => {
    const emptyData = data.length === 0;
    return [
      {
        id: "portNumberLabel",
        label: "Number",
        sortable: false,
        width: emptyData ? 112 : 85,
        render: (record: Port) => (
          <Typography variant="b2_m">{record.portNumberLabel}</Typography>
        ),
      },
      {
        id: "risk",
        label: "Risk",
        sortable: false,
        width: emptyData ? 90 : 85,
        render: (record: Port) => {
          const isHighRisk = [PortRisk.HIGH, PortRisk.VERY_HIGH].includes(
            record.risk as PortRisk
          );
          return (
            <Typography
              variant="b2_r"
              color={isHighRisk ? "status.danger" : ""}
            >
              {formatter("risk", "", getPortRiskLabel)(record)}
            </Typography>
          );
        },
      },
      {
        id: "type",
        label: "Type",
        sortable: false,
        width: emptyData ? 90 : 85,
      },
      {
        id: "count",
        label: "Count ",
        sortable: false,
        width: emptyData ? 180 : 85,
      },
      ...(emptyData
        ? []
        : [
            {
              id: "open",
              label: "",
              sortable: false,
              width: 100,
              sx: {
                paddingX: "4px !important",
              },
              render: () => (
                <Typography
                  variant="label_m"
                  color="primary.dark"
                  sx={{ cursor: "pointer", textAlign: "center" }}
                  onClick={allowPortModal.open}
                >
                  Open the access
                </Typography>
              ),
            },
            {
              id: "close",
              label: "",
              sortable: false,
              width: 32,
              render: (record: Port) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => openAllowPortModal(record)}
                >
                  <CloseIcon size={16} color="text.tertiary" />
                </Box>
              ),
            },
          ]),
    ];
  }, [data]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingY: "4px",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <Typography
          variant="subtitle1"
          component={"span"}
          sx={{
            paddingY: "6.5px",
          }}
        >
          {`Closed Port Attempted (${formatNumber(data.length)})`}
        </Typography>
        <WarningIcon size={20} />
      </Box>
      <CollapsibleTable
        columns={columns}
        data={data}
        sx={{
          maxWidth: "472px",
        }}
        renderDetails={(record) => <PortDetail record={record} />}
      />
      <ModalConfirm
        open={allowPortModal.visible}
        onClose={allowPortModal.close}
        onConfirm={handleAllowPort}
        title="Allow Port Access"
        description="When you allow that source (IP or domain) access to a specific port, it changes to the following"
        descriptionDetails={[
          "The source will be able to access the server on the specified port.",
          "The access restriction settings for the port are updated. ",
        ]}
        loading={loading}
      />
      <ModalConfirm
        open={clearHistoryModal.visible}
        onClose={clearHistoryModal.close}
        onConfirm={handleClearHistory}
        title="Clear History"
        description="If you delete that connection attempt history, you can't recover it.It may be a dangerous connection attempt, so be sure to check before deleting."
        descriptionDetails={[
          "After deletion, no record is left and there is no way to recover it.",
          "If you suspect a security risk, check the relevant logs before proceeding with deletion.",
        ]}
        loading={loading}
      />
    </Box>
  );
};

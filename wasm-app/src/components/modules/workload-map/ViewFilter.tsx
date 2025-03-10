import { useRef, useState } from "react";

import { Box } from "@mui/material";
import { Toggle, Typography } from "@skuber/components";

import { CloseIcon } from "@/components/icons/CloseIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { FilterPorts } from "@/components/modules/workload-map/networkgraph/types";
import { SearchComplete } from "@/components/modules/common/SearchComplete";
import { useCommonStore } from "@/store";

type ViewFilterProps = {
  filterPorts: FilterPorts;
  onChangeFilter: (filterPorts: FilterPorts) => void;
};
export const ViewFilter = ({
  filterPorts,
  onChangeFilter,
}: ViewFilterProps) => {
  const { workloads } = useCommonStore();
  const filterPortRef = useRef<FilterPorts>(filterPorts);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (type: keyof FilterPorts, checked: boolean) => {
    filterPortRef.current[type] = checked;
    onChangeFilter({
      ...filterPortRef.current,
    });
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 32,
        left: 32,
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box
          sx={{
            backdropFilter: "blur(55.5555534362793px)",
            boxShadow: "5.56px 5.56px 66.67px 0px #141923E5",
            width: 40,
            height: 40,
            backgroundColor: "#FFFFFF1A",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            ...(open && {
              border: "1px solid",
              borderColor: "border.elevated",
            }),
            "&:hover": {
              border: "1px solid",
              borderColor: "border.elevated",
            },
          }}
          onClick={handleOpen}
        >
          <EyeIcon size={18} />
        </Box>
        {open && (
          <Box
            sx={{
              backdropFilter: "blur(50px)",
              boxShadow: "5px 5px 60px 0px #14192399",
              border: "1px solid",
              borderColor: "border.elevated",
              padding: "16px",
              borderRadius: "8px",
              position: "absolute",
              top: "-256px",
              left: 0,
              backgroundColor: "action.hover",
              width: 264,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="white" fontWeight={700}>
                View Filters
              </Typography>
              <CloseIcon
                size={16}
                onClick={handleClose}
                sx={{ cursor: "pointer" }}
              />
            </Box>
            <Box>
              <SearchComplete
                options={workloads.map((item) => ({
                  id: item.uuid,
                  label: item.workloadName,
                }))}
                placeholder="Search for workloads"
                onChange={(option) => {
                  console.log(option);
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                "& > div": {
                  padding: "3px 4px 3px 0",
                },
              }}
            >
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  System Ports
                </Typography>
                <Toggle
                  defaultChecked={filterPorts.system}
                  onChange={(_, checked) => handleOnChange("system", checked)}
                />
              </Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  Error Ports
                </Typography>
                <Toggle
                  defaultChecked={filterPorts.error}
                  onChange={(_, checked) => handleOnChange("error", checked)}
                />
              </Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  Connection Attempt Ports
                </Typography>
                <Toggle
                  defaultChecked={filterPorts.attempted}
                  onChange={(_, checked) =>
                    handleOnChange("attempted", checked)
                  }
                />
              </Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  Idle Ports
                </Typography>
                <Toggle
                  defaultChecked={filterPorts.idle}
                  onChange={(_, checked) => handleOnChange("idle", checked)}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

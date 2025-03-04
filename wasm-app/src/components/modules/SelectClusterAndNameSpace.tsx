import { ChangeEvent, useEffect, useState } from "react";

import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";

import { AksIcon } from "../icons/AksIcon";
import { EksIcon } from "../icons/EksIcon";
import { GkeIcon } from "../icons/GkeIcon";
import { OkeIcon } from "../icons/OkeIcon";
import { PrmIcon } from "../icons/PrmIcon";

import { ArrowDownIcon } from "@/components/icons/ArrowDownIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { clusters, namespaces } from "@/data";
import { ClusterType } from "@/models";
import { useCommonStore } from "@/store";

type Option = {
  value: string;
  label: string;
  type?: ClusterType;
};

export const SelectClusterAndNameSpace = () => {
  const [clusterOptions, setClusterOptions] = useState<Option[]>([]);
  const [namespaceOptions, setNamespaceOptions] = useState<Option[]>([]);
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const {
    selectedCluster,
    setSelectedCluster,
    selectedNamespace,
    setSelectedNamespace,
  } = useCommonStore();

  useEffect(() => {
    getClusters();
  }, []);

  useEffect(() => {
    getNamespaces();
  }, [selectedCluster]);

  const getClusters = () => {
    setTimeout(() => {
      const newClusters = clusters.map((cluster) => ({
        value: cluster.id,
        label: cluster.name,
        type: cluster.type as ClusterType,
      }));
      setClusterOptions(newClusters);
      setSelectedCluster(newClusters[0]?.value || "");
    }, 500);
  };

  const getNamespaces = () => {
    setTimeout(() => {
      const newNamespaces = namespaces
        .filter((namespace) => namespace.clusterId === selectedCluster)
        .map((namespace) => ({
          value: namespace.id,
          label: namespace.name,
        }));
      setNamespaceOptions(newNamespaces);
      setSelectedNamespace(newNamespaces[0]?.value || "");
    }, 500);
  };

  const handleClusterChange = (value: string) => {
    setSelectedCluster(value);
  };

  const handleNamespaceChange = (value: string) => {
    setSelectedNamespace(value);
  };

  const handleOpen = (id: string) => {
    setOpenSelect((prev) => (prev === id ? null : id));
  };

  const renderSelect = (
    id: string,
    value: string,
    onChange: (value: string) => void,
    options: Option[],
    placeholder: string,
    withAvatar?: boolean,
  ) => {
    const selectedOption = options.find((o) => o.value === value);
    const isOpen = openSelect === id;

    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={() => handleOpen(id)}
        sx={{
          "&:hover": { backgroundColor: "action.hover" },
          width: "145px",
          height: "100%",
          cursor: "pointer",
          "&:first-of-type": {
            paddingLeft: "16px",
            paddingRight: "12px",
            borderTopLeftRadius: "8.89px",
            borderBottomLeftRadius: "8.89px",
          },
          "&:last-of-type": {
            paddingRight: "12px",
            paddingLeft: "16px",
            borderTopRightRadius: "8.89px",
            borderBottomRightRadius: "8.89px",
          },
        }}
      >
        {withAvatar &&
          selectedOption?.type &&
          renderClusterIcon(selectedOption.type)}
        <Select
          open={isOpen}
          id={id}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          variant="standard"
          IconComponent={ArrowDownIcon}
          renderValue={(selected: string) =>
            options.find((o) => o.value === selected)?.label || ""
          }
          MenuProps={{
            PaperProps: {
              sx: { mt: "10px", ml: withAvatar ? "-19px" : "0" },
            },
          }}
          sx={{
            typography: "body1Bold",
            width: "100%",
            minWidth: withAvatar ? "85px" : "110px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            "& .MuiSelect-select": {
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              padding: "0",
            },
            "& .MuiSvgIcon-root": {
              top: "32%",
            },
            "&.MuiInputBase-root": {
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
            },
            "&.MuiInput-underline:before, &.MuiInput-underline:hover:before, &.MuiInput-underline:after":
              {
                borderBottom: "none",
              },
          }}
        >
          <MenuItem
            disabled
            value=""
            sx={{
              borderBottom: "1.11px solid",
              borderColor: "border.default",
              typography: "caption",
              "&.Mui-disabled": {
                opacity: 1,
                color: "text.tertiary",
              },
            }}
          >
            {placeholder}
          </MenuItem>
          {options.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              sx={{
                width: "145px",
                display: "flex",
                gap: "8px",
                justifyContent: "space-between",
                alignItems: "center",
                typography: "body1",
                color: "text.primary",
              }}
            >
              <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.label}
              </Typography>
              {value === item.value && <CheckIcon />}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    );
  };

  const renderClusterIcon = (type: ClusterType) => {
    switch (type) {
      case ClusterType.AKS:
        return <AksIcon />;
      case ClusterType.PRM:
        return <PrmIcon />;
      case ClusterType.GKE:
        return <GkeIcon />;
      case ClusterType.EKS:
        return <EksIcon />;
      case ClusterType.OKE:
        return <OkeIcon />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.disabled",
        borderRadius: "8.89px",
        border: "1.11px solid",
        borderColor: "border.default",
        width: "290px",
        height: "46px",
        boxShadow: "5.56px 5.56px 66.67px 0px rgba(20, 25, 35, 0.9)",
        backdropFilter: "blur(55.5555534362793px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {renderSelect(
        "cluster",
        selectedCluster,
        handleClusterChange,
        clusterOptions,
        "Cluster",
        true,
      )}
      {renderSelect(
        "namespace",
        selectedNamespace,
        handleNamespaceChange,
        namespaceOptions,
        "Namespace",
      )}
    </Box>
  );
};

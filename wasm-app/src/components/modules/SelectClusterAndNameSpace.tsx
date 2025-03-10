import { ChangeEvent, useEffect, useState } from "react";

import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";

import { AksIcon } from "../icons/AksIcon";
import { EksIcon } from "../icons/EksIcon";
import { GkeIcon } from "../icons/GkeIcon";
import { OkeIcon } from "../icons/OkeIcon";
import { PrmIcon } from "../icons/PrmIcon";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { DownIcon } from "@/components/icons/DownIcon";
import { ClusterType } from "@/models";
import { wasmListClusters } from "@/services/listClusters";
import { wasmListNamespace } from "@/services/listNamespaces";
import { useCommonStore } from "@/store";

type Option = {
  value: string;
  label: string;
  type?: ClusterType;
};

export const SelectClusterAndNameSpace = () => {
  const [selectedCluster, setSelectedCluster] = useState("");
  const [clusterOptions, setClusterOptions] = useState<Option[]>([]);
  const [namespaceOptions, setNamespaceOptions] = useState<Option[]>([]);
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const { selectedNamespace, setSelectedNamespace } = useCommonStore();

  useEffect(() => {
    getClusters();
  }, []);

  useEffect(() => {
    getNamespaces();
  }, [selectedCluster]);

  const getClusters = () => {
    wasmListClusters().then((data) => {
      const newClusters = data.result.map((cluster) => ({
        value: cluster.id.toString(),
        label: cluster.clusterName,
        type: cluster.clusterType,
      })).sort((a, b) => a.label.localeCompare(b.label));
      setClusterOptions(newClusters);
      setSelectedCluster(newClusters[0]?.value || "");
    });
  };

  const getNamespaces = () => {
    if (selectedCluster === null || selectedCluster === undefined) {
      setNamespaceOptions([]);
      setSelectedNamespace("");
    }

    wasmListNamespace("0")
      .then((data) => {
        const newNamespaces = data.result.map((namespace) => ({
          value: namespace.namespaceName,
          label: namespace.namespaceName,
        })).sort((a, b) => a.label.localeCompare(b.label));
        setNamespaceOptions(newNamespaces);
        setSelectedNamespace(newNamespaces[0]?.value || "");
      })
      .catch(() => {
        // TODO: add loading and show error
        // setError(String(err));
        // setLoading(false);
      });
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
          IconComponent={DownIcon}
          renderValue={(selected: string) =>
            options.find((o) => o.value === selected)?.label || ""
          }
          MenuProps={{
            PaperProps: {
              sx: {
                mt: "10px",
                backgroundColor: "background.disabled",
                backdropFilter: "blur(50px)",
                boxShadow: "5px 5px 20px 0px #1419234D",
                color: "text.default",
                typography: "body1",
                border: "1px solid",
                borderColor: "border.elevated",
                "&:hover": {
                  backgroundColor: "background.disabled",
                },
                ml: withAvatar ? "-19px" : "-3px",
              },
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
              borderColor: "border.elevated",
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
        borderColor: "border.elevated",
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

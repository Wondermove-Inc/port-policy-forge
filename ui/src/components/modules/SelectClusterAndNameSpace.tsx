import {
  Box,
  Avatar,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { ArrowDownIcon } from "../icons/ArrowDownIcon";
import { CheckIcon } from "../icons/CheckIcon";

type Option = {
  value: string;
  label: string;
  avatar?: string;
};

type SelectNameSpaceProps = {
  clusterOptions: Option[];
  nameSpaceOptions: Option[];
  selectedCluster: string;
  selectedNameSpace: string;
  onClusterChange: (value: string) => void;
  onNameSpaceChange: (value: string) => void;
};

export const SelectClusterAndNameSpace = ({
  clusterOptions,
  nameSpaceOptions,
  selectedCluster,
  selectedNameSpace,
  onClusterChange,
  onNameSpaceChange,
}: SelectNameSpaceProps) => {
  const renderSelect = (
    id: string,
    value: string,
    onChange: (value: string) => void,
    options: Option[],
    placeholder: string,
    withAvatar?: boolean,
  ) => {
    const selectedOption = options.find((o) => o.value === value);
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          "&:hover": { backgroundColor: "action.hover" },
          width: withAvatar ? "117px" : "142px",
          height: "100%",
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
        {withAvatar && selectedOption?.avatar && (
          <Avatar src={selectedOption.avatar} sx={{ width: 24, height: 24 }} />
        )}
        <Select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          variant="standard"
          IconComponent={ArrowDownIcon}
          renderValue={(selected) =>
            options.find((o) => o.value === selected)?.label || ""
          }
          MenuProps={{
            PaperProps: {
              sx: { mt: "10px", ml: withAvatar ? "-24px" : "-4px" },
            },
          }}
          sx={{
            typography: "body1Bold",
            width: "100%",
            minWidth: withAvatar ? "90px" : "120px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            "& .MuiSelect-select": {
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            "& .MuiSvgIcon-root": {
              top: "30%",
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
              color: "text.tertiary",
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
        onClusterChange,
        clusterOptions,
        "Cluster",
        true,
      )}
      {renderSelect(
        "namespace",
        selectedNameSpace,
        onNameSpaceChange,
        nameSpaceOptions,
        "Namespace",
      )}
    </Box>
  );
};

import {
  HTMLAttributes,
  JSXElementConstructor,
  useMemo,
  useState,
} from "react";

import { Box, Checkbox, SxProps, Theme } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  NoRowsOverlayPropsOverrides,
} from "@mui/x-data-grid";

import { TableListEmpty } from "./TableEmpty";
import { CheckBoxIcon } from "../../icons/CheckBoxIcon";
import { IndeterminateIcon } from "../../icons/IndeterminateIcon";

const CustomNoResultOverlay = () => {
  return <TableListEmpty title={"No Data"} description={"No Data"} />;
};
export type CustomGridColDef = GridColDef & { enableCheckBox?: boolean };

export const Table = (
  props: DataGridProps & {
    emptyHeight?: number | string;
    height?: number | string;
    width?: number | string;
    noRowsOverlay: JSXElementConstructor<
      HTMLAttributes<HTMLDivElement> & {
        sx?: SxProps<Theme> | undefined;
      } & NoRowsOverlayPropsOverrides
    >;
    hasSearch?: boolean;
    onCheckedRowsChange?: (
      checkedRows: Record<string, Record<string, boolean>>,
    ) => void;
  },
) => {
  const {
    columns,
    sx,
    noRowsOverlay,
    hasSearch,
    width = "100%",
    height = "100%",
    rowHeight = 64,
    emptyHeight,
    onCheckedRowsChange,
    ...rest
  } = props;
  const rows = props.rows ?? [];
  const tableHeight = rows?.length || !emptyHeight ? height : emptyHeight;

  const [checkedRows, setCheckedRows] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const updateCheckedRows = (
    newCheckedRows: Record<string, Record<string, boolean>>,
  ) => {
    setCheckedRows(newCheckedRows);
    onCheckedRowsChange?.(newCheckedRows);
  };
  const handleToggleColumnCheck = (columnField: string) => {
    const isChecked = !checkedRows[columnField]?.allChecked;
    const updatedRows = Object.fromEntries(
      rows.map((row) => [row.id, isChecked]),
    );

    updateCheckedRows({
      ...checkedRows,
      [columnField]: {
        ...updatedRows,
        allChecked: isChecked,
        isIndeterminate: !isChecked && Object.values(updatedRows).some(Boolean),
      },
    });
  };

  const handleToggleRowCheck = (
    columnField: string,
    rowId: string | number,
  ) => {
    setCheckedRows((prev) => {
      const currentColumnChecks = prev[columnField] || {};
      const updatedColumnChecks = {
        ...currentColumnChecks,
        [rowId]: !currentColumnChecks[rowId],
      };
      const checkedCount = rows.filter(
        (row) => updatedColumnChecks[row.id],
      ).length;
      const isIndeterminate = checkedCount > 0 && checkedCount < rows.length;
      const isAllChecked = rows.every((row) => updatedColumnChecks[row.id]);
      const newCheckedRows = {
        ...prev,
        [columnField]: {
          ...updatedColumnChecks,
          allChecked: isAllChecked,
          isIndeterminate,
        },
      };
      updateCheckedRows(newCheckedRows);
      return newCheckedRows;
    });
  };

  const updatedColumns: CustomGridColDef[] = (
    columns as CustomGridColDef[]
  ).map((column) => ({
    disableExport: true,
    disableReorder: true,
    editable: false,
    filterable: false,
    sortable: false,
    ...column,
    renderHeader: column.enableCheckBox
      ? () => (
          <Box
            sx={{
              textAlign: "left",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Checkbox
              indeterminate={
                checkedRows[column.field]?.isIndeterminate || false
              }
              checked={
                checkedRows[column.field]?.isIndeterminate ||
                checkedRows[column.field]?.allChecked ||
                false
              }
              onChange={() => handleToggleColumnCheck(column.field)}
              indeterminateIcon={<IndeterminateIcon />}
              checkedIcon={<CheckBoxIcon />}
              sx={{
                "&.Mui-checked": {
                  color: "interaction.primaryContrastBackground",
                },
                "&.MuiCheckbox-indeterminate": {
                  color: "interaction.primaryContrastBackground",
                },
              }}
            />
            <span>{column.headerName}</span>
          </Box>
        )
      : column.renderHeader,
    renderCell: (params) => {
      const rowId = params.id;
      const content = column.renderCell
        ? column.renderCell(params)
        : params.value;
      if (column.enableCheckBox && content !== undefined && content !== null) {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={checkedRows[column.field]?.[rowId] || false}
              onChange={() => handleToggleRowCheck(column.field, rowId)}
              checkedIcon={<CheckBoxIcon />}
              sx={{
                "&.Mui-checked": {
                  backgroundColor: "interaction.primaryContrastBackground",
                },
              }}
            />
            {content}
          </Box>
        );
      }
      return content;
    },
  }));
  const columnStyles = useMemo(() => {
    return Object.keys(checkedRows).reduce<Record<string, SxProps<Theme>>>(
      (acc, field) => {
        if (checkedRows[field]?.allChecked) {
          acc[
            `& [data-field="${field}"], & .MuiDataGrid-cell[data-field="${field}"]`
          ] = {
            backgroundColor: "interaction.primaryContrastBackground",
          };
        }
        return acc;
      },
      {},
    );
  }, [checkedRows]);

  return (
    <DataGrid
      rowHeight={rowHeight}
      columnHeaderHeight={44}
      sx={{
        minHeight: 110,
        maxHeight: 594,
        width,
        height: tableHeight,
        borderWidth: "0",
        borderRadius: "0px",
        ...(props.onRowClick && {
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }),
        "& .MuiDataGrid-cell": {
          typography: "body1",
          padding: "4px 12px",
          display: "flex",
          alignItems: "center",
          fontWeight: "300",
          color: "text.default",
        },
        "& .MuiDataGrid-columnHeader": {
          typography: "body1",
          padding: "13px 12px",
          fontWeight: "600",
          backgroundColor: "background.elevated",
          borderRadius: "0px !important",
          color: "text.white",
        },
        "& .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller": {
          backgroundColor: "background.elevated",
        },
        ".MuiDataGrid-main": {
          height: tableHeight,
        },
        ".MuiDataGrid-scrollbar": {
          display: "none",
        },
        "& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader": {
          borderBottom: "1px solid",
          borderColor: "border.default",
        },
        "& .MuiDataGrid-columnHeader--last, & .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox":
          {
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
          },
        "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {
          minWidth: "44px !important",
          paddingRight: "0 !important",
          justifyContent: "flex-start",
          "& .MuiCheckbox-root input:not(:checked) + .MuiSvgIcon-root  path": {
            fill: "#B7B7B7",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            justifyContent: "flex-start",
          },
          "& .MuiCheckbox-root, & .MuiSvgIcon-root": {
            width: "20px !important",
            height: "20px !important",
          },
          "& + .MuiDataGrid-cell, & + .MuiDataGrid-columnHeader": {
            paddingLeft: "2px !important",
          },
          "& .MuiButtonBase-root": {
            margin: "0 !important",
          },
          "&:focus, &:focus-within": {
            outline: "none",
          },
        },
        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader--siblingFocused":
          {
            outline: "none",
            "& .MuiDataGrid-columnSeparator": {
              opacity: "1",
            },
          },
        "& .MuiDataGrid-columnSeparator": {
          minHeight: "auto !important",
          padding: "0 2px",
          right: 0,
          "& svg": {
            display: "none",
          },
        },
        "& .MuiDataGrid-overlayWrapperInner": {
          ...(props.loading
            ? {
                backdropFilter: "blur(10px)",
              }
            : {
                backgroundColor: "background.secondary",
              }),
        },
        "& .MuiDataGrid-scrollbar": {
          backgroundColor: "white",
        },
        "& .MuiDataGrid-scrollbar--horizontal": { display: "none" },
        "& .MuiDataGrid-virtualScroller ": { overflowX: "hidden" },
        ...columnStyles,
        ...sx,
      }}
      hideFooter
      columns={updatedColumns}
      disableColumnMenu
      disableRowSelectionOnClick
      disableColumnSelector
      disableDensitySelector
      slots={{
        noRowsOverlay: hasSearch ? CustomNoResultOverlay : noRowsOverlay,
      }}
      {...rest}
    />
  );
};

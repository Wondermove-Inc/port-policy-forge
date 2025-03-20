import * as React from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SxProps,
  TableContainerProps,
  TableProps,
  IconButton,
  Collapse,
  Typography,
  TableCellProps,
} from "@mui/material";

import { ArrowDownIcon } from "@/components/icons/ArrowDownIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { Port } from "@/models";
import { useCommonStore } from "@/store";

export type TableColumnProps<T> = TableCellProps & {
  id: string;
  label: React.ReactNode;
  width?: number;
  borderRight?: boolean;
  render?: (record: T) => React.ReactNode;
};

type CollapsibleTableProps<T> = {
  columns: TableColumnProps<T>[];
  data: T[];
  sx?: SxProps;
  tableContainerProps?: TableContainerProps;
  tableProps?: TableProps;
  width?: number | string;
  loading?: boolean;
  renderDetails?: (record: T) => React.ReactNode;
};

export const CollapsibleTable = <T,>({
  columns,
  data,
  sx,
  tableContainerProps,
  tableProps,
  width = "100%",
  loading,
  renderDetails,
}: CollapsibleTableProps<T>) => {
  const [openRows, setOpenRows] = React.useState<Record<number, boolean>>({});
  const { setPortHover } = useCommonStore();

  const handleToggleRow = (index: number) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleMouseEnterRow = (row: T) => {
    setPortHover({ ...(row as Port) });
  };

  const handleMouseLeaveRow = () => {
    setPortHover(null);
  };
  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Paper sx={{ width: "100%", boxShadow: "none" }}>
        <TableContainer {...tableContainerProps}>
          <Table
            sx={{
              minWidth: width,
              tableLayout: "fixed",
              ...tableProps?.sx,
            }}
            size="small"
            {...tableProps}
          >
            <TableHead>
              <TableRow
                sx={{
                  ".MuiTableCell-head": {
                    paddingY: "10.5px",
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    width={column.width}
                    sx={{
                      ...(column.width && {
                        maxWidth: column.width,
                        minWidth: column.width,
                        width: column.width,
                      }),
                      ...(column.borderRight && {
                        borderRight: "1px solid",
                        borderRightColor: "border.default",
                      }),
                      color: "text.default",
                      ...column.sx,
                      typography: "b2_r",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    width="100%"
                    colSpan={columns.length + 1}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && data.length === 0 && (
                <TableRow>
                  <TableCell
                    width="100%"
                    height="96px"
                    colSpan={columns.length + 1}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      There is no data to display.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                data.length > 0 &&
                data.map((row, index) => {
                  const hasDetails = renderDetails && renderDetails(row);
                  const isOpen = openRows[index];

                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        onMouseEnter={() => handleMouseEnterRow(row)}
                        onMouseLeave={() => handleMouseLeaveRow()}
                        sx={{
                          ".MuiTableCell-body": {
                            padding: "7.5px 12px",
                          },
                          ":hover": {
                            cursor: "pointer",
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        {columns.map((column, colIndex) => {
                          const cellContent = column.render
                            ? column.render(row)
                            : (row[column.id as keyof T] as React.ReactNode);

                          return (
                            <TableCell
                              key={colIndex}
                              align={column.align}
                              width={column.width}
                              sx={{
                                borderColor: "border.elevated",
                                ...column.sx,
                              }}
                            >
                              {colIndex === 0 ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  {hasDetails && (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleToggleRow(index)}
                                      sx={{
                                        ml: "-10px",
                                      }}
                                    >
                                      {isOpen ? (
                                        <ArrowDownIcon size={16} />
                                      ) : (
                                        <ArrowRightIcon size={16} />
                                      )}
                                    </IconButton>
                                  )}
                                  <Typography variant="b2_r">
                                    {cellContent}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography variant="b2_r">
                                  {cellContent}
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {hasDetails && (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            sx={{
                              padding: "0 !important",
                              border: "none",
                            }}
                          >
                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                              <Box>{renderDetails(row)}</Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

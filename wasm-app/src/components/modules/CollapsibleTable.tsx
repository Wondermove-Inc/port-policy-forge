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

  const handleToggleRow = (index: number) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
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
              <TableRow>
                {columns.map((column, index) => (
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
                    }}
                  >
                    {index === 0 && (
                      <Box component="span" sx={{ marginRight: 1 }} />
                    )}
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell width="100%" colSpan={columns.length + 1}>
                    <Typography variant="body1" color="text.tertiary">
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && data.length === 0 && (
                <TableRow>
                  <TableCell width="100%" colSpan={columns.length + 1}>
                    <Typography variant="body1" color="text.tertiary">
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
                      <TableRow>
                        {columns.map((column, colIndex) => {
                          const cellContent = column.render
                            ? column.render(row)
                            : row[column.id as keyof T] as React.ReactNode;

                          return (
                            <TableCell
                              key={colIndex}
                              align={column.align}
                              width={column.width}
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
                                    >
                                      {isOpen ? (
                                        <ArrowDownIcon size={16} />
                                      ) : (
                                        <ArrowRightIcon size={16} />
                                      )}
                                    </IconButton>
                                  )}
                                  {cellContent}
                                </Box>
                              ) : (
                                cellContent
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {hasDetails && (
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={columns.length}
                          >
                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                              <Box margin={1}>{renderDetails(row)}</Box>
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

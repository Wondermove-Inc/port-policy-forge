import { Box } from "@mui/material";
import { Button, Typography } from "@skuber/components";
import { AddIcon } from "../../../icons/AddIcon";
import { CollapsibleTable } from "../../../atoms/Table/Table";
import { EditIcon } from "../../../icons/EditIcon";

const columns = [
  {
    id: "portNumber",
    label: "Number",
    sortable: false,
    width: 84,
  },
  {
    id: "status",
    label: "Status",
    sortable: false,
    width: 107,
  },
  {
    id: "source",
    label: "Source",
    sortable: false,
    width: 82,
  },
  {
    id: "access",
    label: "Access ",
    sortable: false,
    width: 136,
    render: (record: any) => (
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Typography variant="b2_r" color="text.primary">
          {record.access}
        </Typography>
        <EditIcon size={16} />
      </Box>
    ),
  },
  {
    id: "close",
    label: "",
    sortable: false,
    width: 84,
    render: (record: any) => (
      <Typography variant="b2_r" color="primary.dark">
        Close
      </Typography>
    ),
  },
];

export const OpenPort = () => {
  const data = [
    {
      portNumber: 8080,
      status: 0,
      source: 1,
      access: "Allow all access ",
    },
    {
      portNumber: 8080,
      status: 0,
      source: 1,
      access: "Allow except some access",
    },
    {
      portNumber: 8080,
      status: 0,
      source: 1,
      access: "Allow only some access",
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "4px",
          marginBottom: "12px",
        }}
      >
        <Typography variant="subtitle1" component={"p"}>
          Open (65,526)
        </Typography>
        <Button
          variant="outlined"
          size="extraSmall"
          sx={{
            width: "94px",
            height: "24px",
          }}
        >
          <AddIcon size={16} />
          Open Port
        </Button>
      </Box>
      <CollapsibleTable
        columns={columns}
        data={data}
        sx={{
          maxWidth: "472px",
        }}
        renderDetails={(record) => (
          <Box>
            <Box
              sx={{
                paddingY: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Typography variant="caption" color="text.tertiary">
                Connected sources (1)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <>
                  <Typography variant="body1" color="text.primary">
                    172.16.0.0/12
                  </Typography>
                  <Box
                    sx={{
                      padding: "12px",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      backgroundColor: "background.shaded",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Working on deploying a front-end application, making it accessible only from an internal test
                      server.
                    </Typography>
                    <Typography variant="caption" color="text.tertiary">
                      2023.02.21, 11:19:22 (GMT +9)
                    </Typography>
                  </Box>
                </>
              </Box>
            </Box>
            <Box
              sx={{
                borderTop: "1px solid",
                borderColor: "border.elevated",
                paddingY: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <Typography variant="caption" color="text.tertiary">
                    Last connection
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    2023.02.21, 11:19:22 (GMT +9)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <Typography variant="caption" color="text.tertiary">
                    Last Src IP
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    10.10.19
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Typography variant="caption" color="text.tertiary">
                  Last Connection Log
                </Typography>
                <Box
                  sx={{
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "background.shaded",
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    {
                      "192.168.10.101:34562 (remote-node) -> 172.16.0.236:4240 (health) to-endpoint FORWARDED (TCP Flags: ACK)"
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      />
    </>
  );
};

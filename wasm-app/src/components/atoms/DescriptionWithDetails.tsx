import { Box, List, ListItem } from "@mui/material";
import { Typography } from "@skuber/components";

type ConfirmDescriptionProps = {
  description: string;
  details: string[];
};

export const DescriptionWithDetails = ({
  description,
  details,
}: ConfirmDescriptionProps) => {
  return (
    <Box>
      <Typography sx={{ mb: "4px" }}>{description}</Typography>
      {details.length > 0 && (
        <List
          sx={{
            paddingLeft: "24px",
            listStyleType: "disc",
            typography: "body2",
            color: "text.secondary",
          }}
        >
          {details.map((item, index) => (
            <ListItem key={index} sx={{ display: "list-item", padding: 0 }}>
              {item}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

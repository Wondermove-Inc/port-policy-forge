import { Tab, Tabs } from "@mui/material";

type ViewMoreProps = {
  tabs: {
    label: string;
    value: string;
  }[];
  value: string;
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
};

export const ViewMore = ({ tabs, value, handleChange }: ViewMoreProps) => {
  return (
    <Tabs
      value={value}
      onChange={handleChange}
      sx={{
        border: "1px solid",
        borderRadius: "8px",
        borderColor: "primary.dark",
        maxWidth: "144px",
        height: "37px",
        minHeight: "37px",
        "& .MuiTabs-indicator": { display: "none" },
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          sx={{
            "&.Mui-selected": {
              color: "primary.dark",
              backgroundColor: "interaction.primaryContrastBackground",
            },
            textTransform: "none",
            fontSize: "12px",
            fontWeight: "600",
            color: "interaction.primaryContrastBackground",
            padding: "0",
            height: "37px",
            width: "72px",
            minWidth: "72px",
            minHeight: "37px",
            borderRight: index !== tabs.length - 1 ? "1px solid" : "none",
            borderColor: "primary.dark",
          }}
        />
      ))}
    </Tabs>
  );
};

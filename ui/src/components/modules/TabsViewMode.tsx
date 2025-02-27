import { Tab, Tabs } from "@mui/material";

type TabsViewModeProps = {
  tabs: {
    label: string;
    value: string;
  }[];
  value: string;
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
};

export const TabsViewMode = ({
  tabs,
  value,
  handleChange,
}: TabsViewModeProps) => {
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
      {tabs.map((tab) => (
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
            typography: "captionBold",
            color: "interaction.primaryContrastBackground",
            padding: "0",
            height: "37px",
            width: "72px",
            minWidth: "72px",
            minHeight: "37px",
            borderRight: "1px solid",
            borderColor: "primary.dark",
            "&:last-of-type": {
              borderRight: "none",
            },
          }}
        />
      ))}
    </Tabs>
  );
};

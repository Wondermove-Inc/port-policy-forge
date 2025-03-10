import { Tab, Tabs } from "@mui/material";

import { useCommonStore } from "@/store";

export const TabsViewMode = () => {
  const { isViewList, setIsViewList } = useCommonStore();

  const handleChange = (event: React.SyntheticEvent, newValue: boolean) => {
    setIsViewList(newValue);
  };

  return (
    <Tabs
      value={isViewList}
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
      {[
        { label: "View List", value: true },
        { label: "View Map", value: false },
      ].map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          value={tab.value}
          sx={{
            "&.Mui-selected": {
              color: "primary.dark",
              backgroundColor: "interaction.primaryContrastBackground",
            },
            textTransform: "none",
            typography: "captionBold",
            color: "#538BFF4D",
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

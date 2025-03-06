/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Autocomplete as MuiAutocomplete,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";

import { CloseIcon } from "../icons/CloseIcon";
import { SearchIcon } from "../icons/SearchIcon";

type Option = {
  id: string;
  label: string;
};

export type SearchCompleteProps = {
  options: Option[];
  sx?: SxProps<Theme>;
  placeholder?: string;
  onChange: (option: Option) => void;
};

export const SearchComplete = (props: SearchCompleteProps) => {
  return (
    <MuiAutocomplete
      disableClearable={false}
      clearOnBlur={true}
      clearIcon={<CloseIcon size={14} />}
      {...props}
      noOptionsText="no results"
      sx={{
        "& .MuiButtonBase-root": {
          "&:last-of-type": {
            display: "none",
          },
        },
        "& .MuiOutlinedInput-root": {
          height: "32px",
          padding: "0px",
        },
        width: "232px",
        ...props.sx,
      }}
      slotProps={{
        clearIndicator: {
          sx: {
            backgroundColor: "background.elevated",
            borderRadius: "50%",
            padding: "2px",
          },
        },
        popper: {
          sx: {
            "& .MuiAutocomplete-noOptions": {
              marginTop: "2px",
              color: "text.default",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "border.elevated",
              typography: "body1",
              padding: "8px",
              backdropFilter: "blur(50px)",
              boxShadow: "5px 5px 20px 0px #1419234D",
              backgroundColor: "background.disabled",
            },
            "& .MuiAutocomplete-listbox": {
              backgroundColor: "background.disabled",
              backdropFilter: "blur(50px)",
              boxShadow: "5px 5px 20px 0px #1419234D",
              color: "text.default",
              border: "1px solid",
              borderColor: "border.elevated",
              typography: "body1",
              "&:hover": {
                backgroundColor: "background.disabled",
              },
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          placeholder={props.placeholder}
          {...params}
          slotProps={{
            input: {
              ...params.InputProps,
              type: "text",
              startAdornment: <SearchIcon size={16} />,
            },
          }}
        />
      )}
      onChange={(e: any, option: any) => {
        props.onChange(option);
      }}
    />
  );
};

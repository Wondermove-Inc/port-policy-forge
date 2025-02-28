import {
  Autocomplete as MuiAutocomplete,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";

import { CloseIcon } from "../icons/CloseIcon";
import { SearchIcon } from "../icons/SearchIcon";

export type SearchCompleteProps = {
  options: string[];
  sx?: SxProps<Theme>;
  placeholder?: string;
};

export const SearchComplete = (props: SearchCompleteProps) => {
  return (
    <MuiAutocomplete
      freeSolo
      disableClearable={false}
      clearOnBlur={false}
      clearIcon={<CloseIcon size={14} />}
      {...props}
      sx={{
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
    />
  );
};

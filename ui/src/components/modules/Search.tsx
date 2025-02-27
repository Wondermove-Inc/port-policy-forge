import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

import { SearchIcon } from "../icons/SearchIcon";
type SearchProps = {
  placeholder?: string;
};
export const Search = ({ placeholder }: SearchProps) => {
  return (
    <FormControl sx={{ width: "240px" }}>
      <OutlinedInput
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start" sx={{ marginRight: "0px" }}>
            <SearchIcon />
          </InputAdornment>
        }
        sx={{
          height: "32px",
          typography: "label",
          color: "text.white",
          "& .MuiOutlinedInput-input": {
            "&::placeholder": {
              color: "text.tertiary",
              opacity: 1,
              typography: "label",
            },
          },
        }}
      />
    </FormControl>
  );
};

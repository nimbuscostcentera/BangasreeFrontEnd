import { Box } from "@mui/system";
import { IconButton, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import {Button} from "@mui/material";
export default function SearchBar({
  PlaceHolder,
  label,
  state,
  setState,
  functionHandler,
}) {
  const [color, setColor] = useState("#ffffff");
  const handleSearchChange = (e) => {
    setState({ ...state, [label]: e.target.value });
  };
  return (
    <Box my={3} mx={2} position={"unset"}>
      <Input
        type="search"
        placeholder={`Search by ` + `${PlaceHolder}` + "..........."}
        onFocus={() => {
          setColor("#1775ce");
        }}
        onBlur={() => {
          setColor("#C0C0C0");
        }}
        onChange={handleSearchChange}
        id="input-with-icon-adornment"
        sx={{
          border: `1px solid ${color}`,
          paddingX: 2,
          paddingY: 0.5,
          borderRadius: 1,
          width: "15rem",
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        autoFocus
      />
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={functionHandler}
        sx={{height:"2.5rem",width:"2.5rem",justifyContent:"center",mt:-0.4}}
      ></Button>
    </Box>
  );
}

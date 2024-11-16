import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function ReusableDropDown3({
  label,
  data,
  id,
  dvalue,
  disabled,
  ObjectKey,
  Prefix,
  uniquekey,
  state,
  deselectvalue,
  handleChange
})
{
    if (Prefix === undefined) {
        Prefix = "";
    }
    var a = [];
    var i, k;
    var n = ObjectKey.length - 1;
    if (n === 0)
    {
        a[0] = ObjectKey;
    }
    else
    {
        for (i = 0; i <= n; i++)
        {
            a[i] = ObjectKey[i];
        }
    }
  return (
    <FormControl fullWidth>
      <InputLabel shrink id="demo-simple-select-label" sx={{ fontSize: 15 }}>
        {label}
      </InputLabel>
      <Select
        notched
        labelId="demo-simple-select-label"
        id={id}
        disabled={disabled}
        native={false}
        displayEmpty={true}
        value={state[uniquekey]||""}
        MenuProps={{
          MenuListProps: {
            style: {
              maxHeight: 300, // Adjust the max height as needed
              overflowY: "auto", // Make options scrollable
            },
          },
        }}
        name={uniquekey}
        onChange={handleChange}
        sx={{ height: "2.5rem", mt: 1, bgcolor: "whitesmoke" }}
      >
        {data?.map((item, index) => {
          var str = "";
          for (k = 0; k <= n; k++) {
            if (k <= n - 1) {
              str = str + item[a[k]] + ":";
            } else {
              str = str + item[a[k]];
            }
          }
          return (
            <MenuItem value={item[uniquekey]} key={index}>
              {`${str}`}
            </MenuItem>
          );
        })}
        {deselectvalue ? (
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
        ) : null}
      </Select>
    </FormControl>
  );
}

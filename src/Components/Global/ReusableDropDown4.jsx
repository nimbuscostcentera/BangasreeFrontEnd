
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropsType from "prop-types";

function ReusableDropDown4({
  label,
  data,
  id,
  disabled,
  ObjectKey,
  Field,
  uniquekey,
  name,
  deselectvalue,
  onChange,
  onClick,
}) {
  var a = [];
  var i, k;
  var n = ObjectKey?.length - 1;
  if (n === 0) {
    a[0] = ObjectKey;
  } else {
    for (i = 0; i <= n; i++) {
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
        value={Field}
        name={name||uniquekey}
        onChange={onChange}
        onOpen={onClick}
        onClose={onClick}
        sx={{ height: "2.5rem", mt: 1, bgcolor: "whitesmoke" }}
      >
        {deselectvalue ? (
          <MenuItem value={Number(-1)}>
            <em>All</em>
          </MenuItem>
        ) : null}
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
      </Select>
    </FormControl>
  );
}
ReusableDropDown4.propTypes = {
  label: PropsType.string,
  data: PropsType.array,
  id: PropsType.string,
  disabled: PropsType.bool,
  ObjectKey: PropsType.array,
  Field: PropsType.string,
  uniquekey: PropsType.string,
  name:PropsType.string,
  deselectvalue: PropsType.bool,
  onChange: PropsType.func,
  onClick: PropsType.func,
};
export default ReusableDropDown4;
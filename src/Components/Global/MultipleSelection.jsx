import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelection({
  label,
  data,
  disabled,
  ObjectKey,
  uniquekey,
  ddwidth,
  setState,
  state,
  deselectvalue,
  setfield1,
  setfield2,
  setfield3,
  field1,
  field2,
  field3,
}) {
  var b = [];
  data?.map((i) => {
    b.push(i[uniquekey]);
  });
  var a = [];
  var i, k;
  var n = ObjectKey.length - 1;
  if (n === 0) {
    a[0] = ObjectKey;
  } else {
    for (i = 0; i <= n; i++) {
      a[i] = ObjectKey[i];
    }
  }

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setState(state.length === b.length ? [] : b);
      return;
    }
    if (field1 || field2 || field3) {
      setfield1((val) => {
        return [];
      });
      setfield2((val) => {
        return [];
      });
      setfield3((val) => {
        return [];
      });
    }
    setState(value);
  };
  return (
    <div>
      <FormControl sx={{ m: 1, width: 150 }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          size="small"
          disabled={disabled}
          value={state}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(value) => {
            var str = "";
            var joinkaro = "";
            if (data !== undefined || data.length !== 0) {
              for (var i = 0; i < value.length; i++) {
                var p = data.filter((item) => item[uniquekey] == value[i])[0];
                for (var j = 0; j < ObjectKey.length; j++) {
                  if(p !== undefined && ObjectKey[j] !== undefined)
                  {
                    str = str + p[ObjectKey[j]] + ",";
                  }
                }
              }
            }
            return str;
          }}
          MenuProps={MenuProps}
        >
          {data?.map((item) => {
            var k,
              str = "";
            for (k = 0; k <= n; k++) {
              if (k <= n - 1) {
                str = str + item[a[k]] + ":";
              } else {
                str = str + item[a[k]];
              }
            }
            return (
              <MenuItem key={item[uniquekey]} value={item[uniquekey]}>
                <Checkbox checked={state.indexOf(item[uniquekey]) > -1} />
                <ListItemText primary={str} />
              </MenuItem>
            );
          })}
          <MenuItem value="all">
            <Checkbox
              checked={b.length > 0 && state.length === b.length}
              indeterminate={state.length > 0 && state.length < b.length}
            />
            <ListItemText primary="Select All" />
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

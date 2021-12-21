import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import Stack from "@mui/material/Stack";

export default function ResponsiveDateTimePickers() {
  const [value, setValue] = React.useState(
    new Date("2018-01-01T00:00:00.000Z")
  );

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns} className="timmer">
        <Stack spacing={3} className="timmer">
          <MobileDateTimePicker
            className="timmer"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
    </div>
  );
}

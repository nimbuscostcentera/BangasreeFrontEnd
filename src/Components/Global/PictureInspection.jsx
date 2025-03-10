import React from "react";
import NoImage from "../../assets/html.jpg";
import { Divider, Grid, Box, Typography, Input } from "@mui/material";

function PictureInspection({
  data,
  Image,
  label,
  state,
  setState,
  Edit,
  reload
}) {
  const HandleChange = (e) => {
    var key = e.target.name;
    let files = e.target.files;
    setState({ ...state, [key]: files });
  };
 // console.log(data);
  return (
    <Box ml={0.5} color={"black"}>
      <br />
      {label ? (
        <Divider>
          <Typography variant="h6" textAlign={"center"} mb={1}>
            {label}
          </Typography>
        </Divider>
      ) : null}

      <Grid container rowGap={2} columnGap={0.5}>
        {Image.map((item, index) => {
          return (
            <Grid
              item
              lg={3.9}
              md={12}
              sm={12}
              xs={12}
              key={index}
              m={"auto"}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box mt={1}>
                <Typography variant="h6" mt={2} mb={2}>
                  {item.Label} :{" "}
                </Typography>
                <img
                  src={
                    data[item.field]
                      ? `${import.meta.env.VITE_IMAGEURL}/${item.url}/${
                          data[item.field]
                        }?t=${reload}`
                      : `${NoImage}`
                  }
                  alt={item.field}
                  width={300}
                  height={200}
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== `${NoImage}`) {
                      e.target.src = `${NoImage}`;
                    }
                  }}
                />

                {Edit ? (
                  <>
                    <br />
                    <Input
                      type="file"
                      name={item.field}
                      accept="image/png, image/jpeg"
                      onChange={HandleChange}
                      sx={{
                        my: 1,
                      }}
                    />
                  </>
                ) : null}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default PictureInspection;

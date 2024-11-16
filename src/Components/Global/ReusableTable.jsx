import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .RedColor": {
    backgroundColor: "#ff8275",
  },
}));

const CustomGridToolBar = () => {
  return (
    <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
      <div>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{ allColumns: true }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
            pageStyle: `@page {
              size: A4 landscape;
              margin: 10mm; /* Adjust margins as needed */
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                margin: 0; /* Remove default body margin */
              }
              .MuiDataGrid-root {
                page-break-inside: avoid; /* Prevent rows from splitting */
              }
            }
          `,
          }}
        />
      </div>
      <div>
        <GridToolbarQuickFilter />
      </div>
    </GridToolbarContainer>
  );
};
export default function ReusableDataTable({
  uniqueid,
  columns,
  rows,
  state,
  setState,
  width = "100%",
  RedMark,
  height,
  isloading,
}) {
  //console.log(rows,"checkloading");
  const [isloading1, setIsLoading1] = useState(true);
  useEffect(() => {
    if (!isloading && rows) {
      const delay2 = setTimeout(() => {
        setIsLoading1(false);
      }, 500); // 2000 milliseconds delay
      return () => clearTimeout(delay2);
    } else if (rows && rows?.length === 0 && !isloading) {
      const delay2 = setTimeout(() => {
        setIsLoading1(false);
      }, 500); // 2000 milliseconds delay
      return () => clearTimeout(delay2);
    } else {
      setIsLoading1(true);
    }
  }, [rows, isloading]);
  return (
    <StyledDataGrid
      loading={isloading1}
      selectRow
      getRowId={(row) => {
        if (!row) {
          return -1;
        } else {
          return row[uniqueid];
        }
      }}
      rows={rows || []}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 50 },
        },
      }}
      sx={{
        height: height || 550,
        width: width,
        "& .MuiDataGrid-virtualScroller": {
          "::-webkit-scrollbar": {
            height: "5px",
            bgcolor: "grey",
          },
        },
      }}
      pageSizeOptions={[10, 15]}
      checkboxSelection
      rowSelectionModel={state}
      onRowSelectionModelChange={(id) => {
        const SelectedIDs = new Set(id);
        const IDarr = Array.from(SelectedIDs);
        setState(IDarr);
      }}
      getRowClassName={(params) => {
        return params.row.red && RedMark ? `RedColor` : `whitesmoke`;
      }}
      slots={{
        //toolbar: GridToolbar,
        toolbar: CustomGridToolBar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  );
}

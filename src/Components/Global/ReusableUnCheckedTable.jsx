import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid";


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
export default function ReusableUnCheckedTable({
  uniqueid,
  columns,
  rows,
  width = "100%",
  height,
  isloading,
  onClicksingleCell,
}) {
  return (
    <div style={{ height: height || 400, width: width }}>
      <DataGrid
        loading={isloading}
        getRowId={(rows) => {
          if (!rows) {
            return -1;
          } else {
            return rows[uniqueid];
          }
        }}
        rows={rows || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
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
        slots={{ toolbar: CustomGridToolBar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        onCellClick={onClicksingleCell}
      />
    </div>
  );
}

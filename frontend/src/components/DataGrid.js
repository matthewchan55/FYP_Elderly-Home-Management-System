import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const MyDataGrid = ({api, th, data, name }) => {
  const [pageSize, setPageSize] = useState(25);
  function generateRandom() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  return (
    data && (
      <DataGrid
        columns={th}
        rows={data}
        getRowId={(row) => row._id || generateRandom()}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 25, 50, 100]}
        getEstimatedRowHeight={() => 100}
        getRowHeight={() => "auto"}
        labelRowsPerPage
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        apiRef={api}
        disableSelectionOnClick
        localeText={{
          toolbarColumns: "Columns",
          toolbarFilters: "Search by",
          toolbarExport: "Export",
        }}
        slots={{ toolbar: GridToolbar }}
        componentsProps={{
          panel: {
            sx: {
              top: "-60px !important",
            },
          },
        }}
        sx={{
          height: "750px",
          width: "100%",
          wordBreak: "break-word",
          "@media print": {
            "& .MuiDataGrid-main": {
              minWidth: 2500,
            },
          },
        }}
      />
    )
  );
};

export default MyDataGrid;

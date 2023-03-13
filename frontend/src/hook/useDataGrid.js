import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import { DataGrid } from "@mui/x-data-grid";
import { Stack, Tooltip } from "@mui/material";
import { useState } from "react";

export default function useDataGrid(apiRef, th, data, exportFileName) {

  const customToolbar = (props) => {
    const date = new Date().toLocaleDateString().replaceAll("/", "_");
    return (
      <Stack direction="row">
        <GridToolbarContainer {...props} sx={{ m: 1, gap: 2, flexGrow: 1 }}>
          <Tooltip title="Search staff by columns">
            <GridToolbarFilterButton />
          </Tooltip>
          <Tooltip title="Filter columns">
            <GridToolbarColumnsButton />
          </Tooltip>
          <Tooltip title="Export as CSV or print data">
            <GridToolbarExport
              csvOptions={{
                fileName: `${date}${exportFileName}`
              }}
              printOptions={{
                hideFooter: true,
                hideToolbar: true,
              }}
            />
          </Tooltip>
        </GridToolbarContainer>
      </Stack>
    );
  };

  const CustomDataGrid = (props) => {
    const [pageSize, setPageSize] = useState(10);
    return (
      data && (
        <DataGrid
          columns={th}
          rows={data}
          getRowId={(row) => row._id}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 25, 50]}
          getEstimatedRowHeight={() => 100}
          getRowHeight={() => 'auto'}
          labelRowsPerPage
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          apiRef={apiRef}
          disableSelectionOnClick
          localeText={{
            toolbarColumns: "Columns",
            toolbarFilters: "Search by",
            toolbarExport: "Export",
          }}
          components={{
            Toolbar: customToolbar,
          }}
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

  return { CustomDataGrid };
}

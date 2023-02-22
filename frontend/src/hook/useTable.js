import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

// CSS for tables
const StyledTable = styled(Table)(({ theme }) => ({
  width: "70%",
  "& thead th": {
    backgroundColor: "#757575",
    fontWeight: "bold",
  },
  "& tbody td": {
    fontWeight: 300,
  },
  "& tbody tr:hover": {
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
  },
}));

export default function useTable(data, headers, filter) {
  // pagination
  const pages = [10, 25, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
  // order by table heads
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  // Table
  const TableContainer = (props) => <StyledTable>{props.children}</StyledTable>;

  // Table Head
  const TableHeader = (props) => {
    const handleSort = (headerId) => {
      const isAsc = orderBy === headerId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(headerId);
    };

    return (
      <TableHead>
        <TableRow>
          {headers.map((head) => (
            <TableCell key={head.id} sortDirection={orderBy===head.id ? order:false}>
              <TableSortLabel
                active={orderBy === head.id}
                direction={orderBy === head.id ? order : "asc"}
                onClick={() => {
                  handleSort(head.id);
                }}
              >
                {head.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  // Table pagination 

  // Table pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const getComparator= (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const descendingComparator= (a, b, orderBy)=> {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const TablePaging = (props) =>
  data && (
    <TablePagination
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={filter.filtering(data).length}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{display: "flex", justifyContent: "left"}}
    />
  );

  const pagedRecords = () => {
    // use filtered data for sorting and slicing as well
    return sort(filter.filtering(data), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  return { TableContainer, TableHeader, TablePaging, pagedRecords };
}

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PageHeader from "../../components/PageHeader";

const ManagementFinance = () => {
  return (
    <div>
      <PageHeader
        title="Financial Management"
        subtitle="View staff payroll or manage elderly home finance"
        icon={
          <AttachMoneyIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
  );
};

export default ManagementFinance;

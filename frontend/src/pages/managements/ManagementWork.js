import WorkIcon from "@mui/icons-material/Work";
import PageHeader from "../../components/PageHeader";

// 1. Work overview (percentage and the TODAY's table to show how many works are done, not yet done)
// 2. Work records (past records and detailed )
// 3. schedule caregivers
// 4. schedule caregivers record



const ManagementWork = () => {
  return (
    <div>
      <PageHeader
        title="Work Management"
        subtitle="View work records"
        icon={
          <WorkIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
  );
};

export default ManagementWork;

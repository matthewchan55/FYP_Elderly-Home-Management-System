import WorkIcon from "@mui/icons-material/Work";
import PageHeader from "../../components/PageHeader";

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

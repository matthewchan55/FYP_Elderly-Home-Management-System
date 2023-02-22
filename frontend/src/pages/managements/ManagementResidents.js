import ElderlyIcon from "@mui/icons-material/Elderly";
import PageHeader from "../../components/PageHeader";

const ManagementResidents = () => {
  return (
    <div>
    <div>
      <PageHeader
        title="Residents Management"
        subtitle="View elderly profile, routine and medication records"
        icon={
          <ElderlyIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
    </div>
  )
}

export default ManagementResidents

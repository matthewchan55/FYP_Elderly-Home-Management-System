import VaccinesIcon from "@mui/icons-material/Vaccines";
import PageHeader

from "../../components/PageHeader";
const ManagementMedication = () => {
  return (
    <div>
      <PageHeader
        title="Medication Management"
        subtitle="Manage medicines or define default medicine for residents"
        icon={
          <VaccinesIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
  )
}

export default ManagementMedication
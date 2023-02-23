import VaccinesIcon from "@mui/icons-material/Vaccines";
import PageHeader from "../../components/PageHeader";

// confirmatino Dialog from MUI
const ManagementMedication = () => {
  return (
    <>
      <PageHeader
        title="Medication Management"
        subtitle="Manage medicines or define default medicine for residents"
        icon={
          <VaccinesIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </>
  )
}

export default ManagementMedication
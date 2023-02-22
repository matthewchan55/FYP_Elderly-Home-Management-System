import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import PageHeader

from "../../components/PageHeader";
const ManagementFacility = () => {
  return (
    <div>
      <PageHeader
        title="Facility Management"
        subtitle="View facility vacancy or manage rooms status"
        icon={
          <RoomPreferencesIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
  )
}

export default ManagementFacility
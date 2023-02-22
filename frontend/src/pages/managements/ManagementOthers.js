import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PageHeader from "../../components/PageHeader";

const ManagementOthers = () => {
  return (
    <div>
      <PageHeader
        title="Others Management"
        subtitle="Management on diet or others"
        icon={
          <AddCircleOutlineIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
  )
}

export default ManagementOthers
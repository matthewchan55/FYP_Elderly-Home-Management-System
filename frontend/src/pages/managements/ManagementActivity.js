import React from 'react'
import PageHeader from '../../components/PageHeader'
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
const ManagementActivity = () => {
  return (
    <div>
      <PageHeader
        title="Activity Management"
        subtitle="View activity records or manage activity status"
        icon={
          <DirectionsRunIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
    </div>
  )
}

export default ManagementActivity
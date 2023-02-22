import ProfileForm from "../components/ProfileForm";
import PageHeader from "../components/PageHeader";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";

const Profile = () => {
  const ProfilePaper = styled(Paper)(({theme}) => ({
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }))

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="View or update personal information"
        icon={<AccountBoxIcon sx={{fontSize: 60, justifyContent: "center"}}/>}
      />
      <ProfilePaper>
        <ProfileForm />
      </ProfilePaper>


    </div>
  );
};

export default Profile;

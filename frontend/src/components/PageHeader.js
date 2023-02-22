import styled from "@emotion/styled";
import { Icon, Paper, Typography, Box } from "@mui/material";

const PageHead = styled("div")({
  backgroundColor: "#f5f5f5",
  display: "flex",
  padding: 20,
  width: "100%"
});

const PageHeadPaper = styled(Paper)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 100,
  height: 100,
  marginRight: 30
});

const PageHeader = ({ title, subtitle, icon }) => {
  return (
    <PageHead>
      <PageHeadPaper>
        <Icon
          sx={{
            fontSize: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Icon>
      </PageHeadPaper>

      <Box className="pageInfo">
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6">{subtitle}</Typography>
      </Box>
    </PageHead>
  );
};

export default PageHeader;

import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Buttons(props) {
  // if there are more property, they will be stored all in other
  const { variant, color, text, size, onClick, ...other } = props;

  // createTheme = overwrite the default theme 
  // NEED TO CHANGE =]
  const theme = createTheme({
    palette: {
      neutral: {
        main: "#64748B",
        contrastText: "#fff",
      },
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant={variant || "contained"}
        color={color || "primary"}
        size={size || "medium"}
        onClick={onClick}
        {...other}
        sx={{margin: 1}}
      >
        {text}
      </Button>
    </ThemeProvider>
  );
}

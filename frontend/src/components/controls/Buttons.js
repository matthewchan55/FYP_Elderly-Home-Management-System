import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Color from "../Color";

export default function Buttons(props) {
  // if there are more property, they will be stored all in other
  const {theme} = Color();
  const { variant, color, text, size, onClick, ...other } = props;

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant={variant || "contained"}
        color={color || "primary"}
        size={size || "medium"}
        onClick={onClick}
        {...other}
        sx={{ margin: 1, textTransform: "none" }}
      >
        {text}
      </Button>
    </ThemeProvider>
  );
}

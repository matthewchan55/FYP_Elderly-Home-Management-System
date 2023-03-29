import { createTheme } from "@mui/material/styles";

export default function Color() {
  const theme = createTheme({
    palette: {
      neutral: {
        main: "#64748B",
        contrastText: "#263238",
      },
      deepBlue: {
        main: "#3f51b5",
      },
      errorRed: {
        main: "#ef5350",
        contrastText: "#fff",
      },
      whiteGrey: {
        main: "#f5f5f5",
      },
      primary: {
        light: "#757de8",
        main: "#3f51b5",
        contrastText: "#fff",
      },
      secondary: {
        light: "#834bff",
        main: "#4615b2",
        contrastText: "#fff",
      },
      success: {
        main: "#357a38",
        light: "#6fbf73"
      }
    },
  });

  return { theme };
}

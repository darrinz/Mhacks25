import { createTheme } from "@mui/material/styles";

// Light beige + green theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // medium green (MUI green[700])
      light: "#60A961",
      dark: "#005005",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8D6E63", // warm brown-ish accent for contrast
      light: "#B48A7B",
      dark: "#5C443D",
      contrastText: "#fff",
    },
    info: { main: "#1976D2" },
    background: {
      default: "#F6F1EA", // soft light beige
      paper: "#FFFFFF",
    },
    text: {
      primary: "#16321F", // dark greenish for comfortable contrast
      secondary: "#53665B",
    },
    success: { main: "#43A047" },
    warning: { main: "#F59E0B" },
    error: { main: "#E53935" },
  },
  typography: {
    fontFamily: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'].join(','),
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    h3: { fontSize: '1.125rem', fontWeight: 700 },
    body1: { fontSize: '1rem', color: '#16321F' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 14px',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #2E7D32 0%, #60A961 100%)',
          color: '#fff',
          boxShadow: '0 6px 18px rgba(46,125,50,0.12)'
        },
        outlined: {
          border: '1px solid rgba(22,50,31,0.08)',
          background: 'transparent'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          background: '#FFFFFF',
          border: '1px solid rgba(22,50,31,0.04)',
          boxShadow: '0 6px 18px rgba(16,50,31,0.06)'
        }
      }
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          background: 'transparent',
          borderRadius: 8,
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: '#FAF7F3'
          },
          '& label': {
            color: 'rgba(22,50,31,0.8)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'transparent', boxShadow: 'none' },
      }
    }
  }
});

export default theme;

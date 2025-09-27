import { createTheme } from "@mui/material/styles";

// Refined vibrant theme: less gradient, confident colors, subtle depth
const theme = createTheme({
  palette: {
    primary: {
      main: "#5B32B7", // deep purple with warmth
      light: "#7C57E6",
      dark: "#3E1E8A",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF4C6D", // punchy coral
      light: "#FF7A95",
      dark: "#CC3A58",
      contrastText: "#fff",
    },
    info: {
      main: "#2CD4DA", // cool cyan accent (subtle)
      contrastText: "#06202a",
    },
    background: {
      default: "#0F1724", // near-black navy for modern contrast
      paper: "#0B1220",
    },
    text: {
      primary: "#E6EEF8",
      secondary: "#A9BDCF",
    },
    success: { main: "#10B981" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
  },
  typography: {
    fontFamily: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'].join(','),
    h1: { fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: 700 },
    h3: { fontSize: '1.125rem', fontWeight: 700 },
    body1: { fontSize: '1rem', color: '#E6EEF8' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '9px 16px',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #5B32B7 0%, #7C57E6 100%)',
          color: '#fff',
          boxShadow: '0 6px 20px rgba(91,50,183,0.18)'
        },
        outlined: {
          border: '1px solid rgba(255,255,255,0.06)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#07101a',
          border: '1px solid rgba(255,255,255,0.03)',
          boxShadow: '0 8px 24px rgba(2,6,23,0.45)'
        }
      }
    },
    MuiTextField: {
      defaultProps: { variant: 'filled' },
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 8,
          '& .MuiFilledInput-root': {
            borderRadius: 8,
            background: 'rgba(255,255,255,0.02)'
          },
          '& label': {
            color: 'rgba(230,240,255,0.9)'
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

import { createTheme } from '@mui/material/styles';

export const lunaBelleTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B76E79',     // Rose Gold Signature
      dark: '#8B3A48',     // Deep Wine Rose
      light: '#D4939A',    // Soft Rose Gold
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4AF37',     // Champagne Gold Accent
      dark: '#A68019',
      light: '#F5E6AB',
      contrastText: '#2C1F20',
    },
    background: {
      default: '#FFFBF9',  // Warm Alabaster White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1F20',   // Espresso Charcoal
      secondary: '#5A3F42', // Muted Rose Charcoal
      disabled: '#9E7B7E',
    },
    divider: 'rgba(183, 110, 121, 0.15)',
    custom: {
      footerBg: '#6B3A3A',
      sectionBg: '#FFF5F3',
      blushSoft: '#FFF0F1',
      roseGradient: 'linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #9B4D62 100%)',
      goldGradient: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 60%, #AA820A 100%)',
      cardShadow: '0 4px 20px rgba(183, 110, 121, 0.08)',
      cardShadowHover: '0 12px 30px rgba(183, 110, 121, 0.18)',
    }
  },
  typography: {
    fontFamily: "'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(183, 110, 121, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #9B4D62 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #B58259 0%, #A45B66 40%, #863B50 100%)',
          },
        },
        outlinedPrimary: {
          borderColor: '#B76E79',
          color: '#B76E79',
          '&:hover': {
            borderColor: '#8B3A48',
            backgroundColor: 'rgba(183, 110, 121, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(183, 110, 121, 0.12)',
          boxShadow: '0 4px 20px rgba(183, 110, 121, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            boxShadow: '0 12px 30px rgba(183, 110, 121, 0.14)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2C1F20',
          boxShadow: '0 2px 12px rgba(183, 110, 121, 0.08)',
          borderBottom: '1px solid rgba(183, 110, 121, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
      styleOverrides: {
        root: {
          width: '100%',
          '@media (min-width: 1200px)': {
            maxWidth: '75% !important',
          },
          '@media (min-width: 900px) and (max-width: 1199px)': {
            maxWidth: '85% !important',
          },
          marginLeft: 'auto !important',
          marginRight: 'auto !important',
        },
      },
    },
  },
});

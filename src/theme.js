import { createTheme } from "@mui/material/styles";

/**
 * The app's palette and component defaults.
 *
 * `c` is exported for the handful of places that need a raw colour (SVG fills, one-off borders);
 * anything MUI can express through the theme should come from the theme, not from here.
 */
export const c = {
    bg: "#FFFFFF",
    canvas: "#F5F7F6",
    sunken: "#EFF3F1",
    line: "#E1E8E5",
    line2: "#CBD6D1",
    ink: "#10201B",
    ink2: "#56655F",
    ink3: "#8A9891",
    accent: "#0E7C5A",
    accentHover: "#0B6449",
    accentSoft: "#E1F2EA",
    warn: "#A8700F",
    warnSoft: "#FBEDD5",
    crit: "#BC3B2C",
    critSoft: "#FAE2DE",
};

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: c.accent, dark: c.accentHover, contrastText: "#FFFFFF" },
        error: { main: c.crit },
        warning: { main: c.warn },
        background: { default: c.canvas, paper: c.bg },
        text: { primary: c.ink, secondary: c.ink2, disabled: c.ink3 },
        divider: c.line,
    },
    shape: { borderRadius: "0.6rem" },
    // index.css sets html to 62.5%, so 1rem is 10px. Both of these keep MUI in step with that:
    // spacing() returns rem instead of px, and htmlFontSize corrects theme.typography.pxToRem.
    spacing: (factor) => `${factor * 0.8}rem`,
    typography: {
        htmlFontSize: 10,
        fontFamily: '"Lexend Deca", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        h1: { fontSize: "2.8rem", fontWeight: 620, letterSpacing: "-0.02em" },
        h2: { fontSize: "2.9rem", fontWeight: 640, letterSpacing: "-0.015em" },
        h3: { fontSize: "1.9rem", fontWeight: 620 },
        body1: { fontSize: "1.4rem" },
        body2: { fontSize: "1.25rem", color: c.ink2 },
        overline: { fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.02em", lineHeight: 1.6 },
        // MUI shouts button labels by default, and "CREATE ACCOUNT" fights everything near it.
        button: { fontSize: "1.5rem", fontWeight: 620, textTransform: "none" },
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    height: "4.8rem",
                    padding: "0 1.8rem",
                    "&:focus-visible": { outline: `0.2rem solid ${c.accent}`, outlineOffset: "0.2rem" },
                },
                outlined: { borderColor: c.line2, color: c.ink, "&:hover": { borderColor: c.line2, background: c.sunken } },
            },
        },
        MuiTextField: {
            defaultProps: { variant: "outlined", fullWidth: true },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: c.sunken,
                    fontSize: "1.5rem",
                    "& fieldset": { borderColor: c.line2 },
                    "&:hover fieldset": { borderColor: c.line2 },
                    "&.Mui-focused": { background: c.bg },
                    "&.Mui-focused fieldset": { borderWidth: "0.15rem" },
                },
                input: { padding: "1.45rem 1.5rem" },
            },
        },
        // Borders separate surfaces here, so Paper's elevation overlay is unwanted.
        MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
});

export default theme;

import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { c } from "../theme";

export default function NotFound() {
    const navigate = useNavigate();
    const signedIn = Boolean(localStorage.getItem("userEmail"));

    return (
        <Box minHeight="100vh" bgcolor={c.canvas} display="flex" flexDirection="column">
            <Box p="2.4rem">
                <Logo size={24} fontSize="1.8rem" />
            </Box>
            <Stack flex="1" alignItems="center" justifyContent="center" gap="1.2rem" p="2.4rem" textAlign="center">
                <Typography fontSize="6rem" fontWeight="640" color={c.accent} lineHeight="1">404</Typography>
                <Typography fontSize="2.2rem" fontWeight="620">There's nothing at this address</Typography>
                <Typography fontSize="1.5rem" color={c.ink2} maxWidth="42rem">
                    The page you were after has moved or never existed.
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: "1.2rem" }}
                    onClick={() => navigate(signedIn ? "/dashboard" : "/")}
                >
                    {signedIn ? "Back to your board" : "Go to log in"}
                </Button>
            </Stack>
        </Box>
    );
}

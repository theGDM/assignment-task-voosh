import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { c } from "../theme";
import initialsFrom from "../utils/initials";
import useSession from "../features/auth/useSession";

export default function AppHeader() {
    const navigate = useNavigate();
    const { user, endSession } = useSession();
    const name = user?.fullName;
    const email = user?.email;
    // Until there's a settings page to pick a picture, initials say whose board this is
    // and cost no assets.
    const initials = initialsFrom(name, email);

    const handleLogout = async () => {
        await endSession();
        navigate("/");
    };

    return (
        <Box
            component="header"
            height="6.4rem"
            flexShrink="0"
            px="2.4rem"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor={c.bg}
            borderBottom={`0.1rem solid ${c.line}`}
            position="sticky"
            top="0"
            zIndex="10"
        >
            <Logo size={24} fontSize="1.8rem" />

            {user && (
                <Stack direction="row" alignItems="center" gap="1.4rem">
                    <Stack direction="row" alignItems="center" gap="0.9rem">
                        <Box
                            aria-hidden="true"
                            sx={{
                                width: "3.2rem",
                                height: "3.2rem",
                                borderRadius: "50%",
                                border: `0.1rem solid ${c.accent}`,
                                bgcolor: c.accentSoft,
                                color: c.accent,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.4rem",
                                fontWeight: 650,
                            }}
                        >
                            {initials}
                        </Box>
                        <Typography
                            fontSize="1.4rem"
                            color={c.ink2}
                            title={email}
                            sx={{ display: { xs: "none", sm: "block" } }}
                        >
                            {name || email}
                        </Typography>
                    </Stack>
                    <Button variant="outlined" onClick={handleLogout} sx={{ height: "3.8rem" }}>
                        Log out
                    </Button>
                </Stack>
            )}
        </Box>
    );
}

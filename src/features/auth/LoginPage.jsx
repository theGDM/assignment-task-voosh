import React, { useState, useEffect } from "react";
import { Alert, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout, { PanelPoints } from "./AuthLayout";
import Field from "../../components/Field";
import useSession from "./useSession";
import { c } from "../../theme";
import { apiErrorMessage } from "../../api/client";
import { signIn } from "../../api/auth";
import { auth, provider, isGoogleSignInAvailable } from "../../api/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { startSession } = useSession();

    useEffect(() => {
        if (localStorage.getItem("userEmail")) navigate("/dashboard");
    }, [navigate]);

    const validate = () => {
        const found = {};
        if (email.trim() === "") found.email = "Enter the email you signed up with.";
        if (password === "") found.password = "Enter your password.";
        setErrors(found);
        return Object.keys(found).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;
        await attemptSignIn(email, password);
    };

    // A rejected login answers with HTTP 200 and { success: false, message }; a network or server
    // failure throws. Both used to end up reading `.message` off undefined and blanking the page.
    const attemptSignIn = async (emailAddress, secret) => {
        setSubmitting(true);
        setFormError("");
        try {
            const response = await signIn(emailAddress, secret);

            if (response.success === false) {
                // Never say which of the two was wrong — that confirms which emails have accounts.
                setFormError("That email and password don't match.");
                return;
            }

            startSession(response);
            navigate("/dashboard");
        } catch (err) {
            setFormError(apiErrorMessage(err, "Can't reach the server. Check your connection and try again."));
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((data) => attemptSignIn(data.user.email, data.user.uid))
            .catch((err) => console.log(err));
    };

    return (
        <AuthLayout
            title="Log in"
            subtitle={
                <>
                    New here?{" "}
                    <Box
                        component="span"
                        onClick={() => navigate("/register")}
                        sx={{ color: c.accent, fontWeight: 600, cursor: "pointer" }}
                    >
                        Create an account
                    </Box>
                </>
            }
            panel={
                <PanelPoints
                    headline="Plan the work. Share the load."
                    sub="Workspaces for small teams who'd rather not run their week out of a group chat."
                    points={[
                        "A board per project, columns you name",
                        "Cards assigned to as many people as it takes",
                        "Invite by email — they join when they sign up",
                    ]}
                />
            }
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack gap="1.8rem">
                    {formError && (
                        <Alert severity="error" sx={{ fontSize: "1.4rem", py: 0.5, alignItems: "center" }}>
                            {formError}
                        </Alert>
                    )}

                    <Field
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        error={errors.email}
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Field
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        error={errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            // A word, not an unlabelled eye — the most misread control in any auth form.
                            <Box
                                component="span"
                                onClick={() => setShowPassword((shown) => !shown)}
                                sx={{ fontSize: "1.3rem", color: c.ink2, cursor: "pointer", pl: 1, userSelect: "none" }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </Box>
                        }
                    />

                    <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? "Logging in…" : "Log in"}
                    </Button>

                    {isGoogleSignInAvailable && (
                        <Divider sx={{ fontSize: "1.25rem", color: c.ink3 }}>or</Divider>
                    )}

                    {isGoogleSignInAvailable && (
                        <Button variant="outlined" fullWidth onClick={handleGoogleSignIn} disabled={isSubmitting}>
                            Continue with Google
                        </Button>
                    )}

                    <Typography fontSize="1.3rem" color={c.ink3} textAlign="center">
                        Invited by a teammate? Sign in with that same address.
                    </Typography>
                </Stack>
            </Box>
        </AuthLayout>
    );
}

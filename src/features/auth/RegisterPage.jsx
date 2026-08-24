import React, { useState } from "react";
import { Alert, Box, Button, Divider, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../utils/notify";
import AuthLayout, { PanelPoints } from "./AuthLayout";
import Field from "../../components/Field";
import useSession from "./useSession";
import { c } from "../../theme";
import { apiErrorMessage } from "../../api/client";
import { register, signIn } from "../../api/auth";
import { auth, provider, isGoogleSignInAvailable } from "../../api/firebase";
import { signInWithPopup } from "firebase/auth";

const MIN_PASSWORD = 8;

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { startSession } = useSession();

    const validate = () => {
        const found = {};
        if (firstName.trim() === "") found.firstName = "Required.";
        if (lastName.trim() === "") found.lastName = "Required.";
        if (email.trim() === "") found.email = "Enter your email address.";
        else if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "That doesn't look like an email address.";
        if (password.length < MIN_PASSWORD) found.password = `At least ${MIN_PASSWORD} characters.`;
        if (confirmPassword !== password) found.confirmPassword = "Those don't match yet.";
        setErrors(found);
        return Object.keys(found).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setFormError("");
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        try {
            const response = await register(fullName, email.trim(), password);

            // A taken email comes back as { success: false } with HTTP 200. Navigating regardless
            // told the user they had signed up when they had not.
            if (!response.success) {
                setErrors((current) => ({ ...current, email: response.message }));
                return;
            }

            notifySuccess("Account created — log in to get started.");
            navigate("/");
        } catch (err) {
            setFormError(apiErrorMessage(err, "Can't reach the server. Check your connection and try again."));
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignUp = () => {
        signInWithPopup(auth, provider).then(async (data) => {
            setSubmitting(true);
            setFormError("");
            try {
                // Already registered is fine here — fall through and sign in.
                await register(data.user.displayName, data.user.email, data.user.uid);
                const response = await signIn(data.user.email, data.user.uid);

                if (response.success === false) {
                    setFormError(response.message);
                    return;
                }

                startSession(response);
                    navigate("/dashboard");
            } catch (err) {
                setFormError(apiErrorMessage(err, "Can't reach the server. Check your connection and try again."));
            } finally {
                setSubmitting(false);
            }
        }).catch((err) => console.log(err));
    };

    const strength = Math.min(4, Math.floor(password.length / 3));

    return (
        <AuthLayout
            title="Create your account"
            subtitle={
                <>
                    Already have one?{" "}
                    <Box
                        component="span"
                        onClick={() => navigate("/")}
                        sx={{ color: c.accent, fontWeight: 600, cursor: "pointer" }}
                    >
                        Log in
                    </Box>
                </>
            }
            panel={
                <PanelPoints
                    headline="Start in under a minute."
                    sub="Make a workspace, or sign up with the address a teammate invited."
                    points={[
                        "Pick a name, a password and a face",
                        "Invited already? Use that same email address",
                        "You'll land straight in their workspace",
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

                    <Stack direction="row" gap="1.2rem">
                        <Field
                            label="First name"
                            value={firstName}
                            error={errors.firstName}
                            autoFocus
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Field
                            label="Last name"
                            value={lastName}
                            error={errors.lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Stack>

                    <Field
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        error={errors.email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Box>
                        <Field
                            label="Password"
                            type="password"
                            value={password}
                            error={errors.password}
                            hint="At least 8 characters. Longer is better than complicated."
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Stack direction="row" gap="0.4rem" mt="0.7rem">
                            {[0, 1, 2, 3].map((step) => (
                                <Box
                                    key={step}
                                    flex="1"
                                    height="0.4rem"
                                    borderRadius="0.2rem"
                                    bgcolor={step < strength ? c.accent : c.line2}
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Field
                        label="Confirm password"
                        type="password"
                        value={confirmPassword}
                        // Checked while typing, so nobody submits to find out.
                        error={confirmPassword !== "" && confirmPassword !== password
                            ? "Those don't match yet."
                            : errors.confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? "Creating your account…" : "Sign up"}
                    </Button>

                    {isGoogleSignInAvailable && (
                        <Divider sx={{ fontSize: "1.25rem", color: c.ink3 }}>or</Divider>
                    )}

                    {isGoogleSignInAvailable && (
                        <Button variant="outlined" fullWidth onClick={handleGoogleSignUp} disabled={isSubmitting}>
                            Continue with Google
                        </Button>
                    )}
                </Stack>
            </Box>
        </AuthLayout>
    );
}

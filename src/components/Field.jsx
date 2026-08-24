import { Box, TextField, Typography } from "@mui/material";
import { c } from "../theme";

/**
 * A labelled input with its error message directly underneath.
 *
 * The label sits above the field rather than floating inside it: MUI's floating label on a filled
 * input collides with the value, which is why the old form needed 2.5rem of top padding to work.
 * Errors belong here too — a toast detaches the message from the field it's about.
 */
export default function Field({ label, error, hint, endAdornment, ...props }) {
    // flex + minWidth:0 so two fields can share a row without either collapsing.
    return (
        <Box display="flex" flexDirection="column" gap="0.7rem" flex="1" minWidth="0">
            <Typography component="label" fontSize="1.3rem" fontWeight="600" color={c.ink2}>
                {label}
            </Typography>
            <TextField
                error={Boolean(error)}
                InputProps={endAdornment ? { endAdornment } : undefined}
                {...props}
            />
            {error && (
                <Typography fontSize="1.25rem" color={c.crit}>{error}</Typography>
            )}
            {!error && hint && (
                <Typography fontSize="1.25rem" color={c.ink2}>{hint}</Typography>
            )}
        </Box>
    );
}

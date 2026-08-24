import { Box, Stack, Typography } from "@mui/material";
import { c } from "../theme";

/**
 * The Taskify mark.
 *
 * Three variants are kept here so the choice is a one-word change at the call site rather than a
 * rewrite. All are drawn on a 24×24 grid and inherit their colour from `tone`, so they work on
 * white, on the accent wash, and knocked out white on a solid accent.
 */

/** Three columns, ascending — a board read as progress. */
function BoardMark({ size, tone }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Taskify">
            <rect x="2.5" y="12" width="5.5" height="9.5" rx="2.2" fill={tone} opacity="0.34" />
            <rect x="9.25" y="7.5" width="5.5" height="14" rx="2.2" fill={tone} opacity="0.62" />
            <rect x="16" y="2.5" width="5.5" height="19" rx="2.2" fill={tone} />
        </svg>
    );
}

/** A T built from two cards — the initial, in the product's own material. */
function MonogramMark({ size, tone }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Taskify">
            <rect x="2.5" y="3" width="19" height="5.6" rx="2.4" fill={tone} opacity="0.42" />
            <rect x="9.2" y="3" width="5.6" height="18.5" rx="2.4" fill={tone} />
        </svg>
    );
}

/** A card with a tick. The safe, familiar one. */
function CheckMark({ size, tone }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Taskify">
            <rect x="2.9" y="2.9" width="18.2" height="18.2" rx="5.2" fill="none" stroke={tone} strokeWidth="2.2" />
            <path d="M7.6 12.3 l3.1 3.2 l5.8 -6.4" fill="none" stroke={tone} strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const MARKS = { board: BoardMark, monogram: MonogramMark, check: CheckMark };

export function LogoMark({ variant = "board", size = 24, tone = c.accent }) {
    const Mark = MARKS[variant] ?? BoardMark;
    return <Mark size={size} tone={tone} />;
}

/** Mark plus wordmark, the lockup used in headers. */
export default function Logo({ variant = "board", size = 26, tone = c.accent, color = c.ink, fontSize = "1.9rem" }) {
    return (
        <Stack direction="row" alignItems="center" gap="0.9rem">
            <Box display="flex" flexShrink="0">
                <LogoMark variant={variant} size={size} tone={tone} />
            </Box>
            <Typography fontSize={fontSize} fontWeight="650" letterSpacing="-0.02em" color={color}>
                Taskify
            </Typography>
        </Stack>
    );
}

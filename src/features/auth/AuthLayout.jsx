import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import theme, { c } from "../../theme";
import Logo from "../../components/Logo";

/**
 * The split layout shared by login and register: a tinted panel carrying the product's claim,
 * and the form on white beside it. Below 900px the panel drops away and the form goes full width.
 *
 * The app's dark theme is overridden here rather than globally, so the board is untouched.
 */
export default function AuthLayout({ title, subtitle, panel, children }) {
    const isNarrow = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            display="flex"
            minHeight="100vh"
            width="100%"
            bgcolor={c.bg}
            color={c.ink}
        >
            {!isNarrow && (
                <Box
                    // flex-basis, not width: as a plain flex item it shrank well below 42% and the
                    // panel came out around 295px on a wide screen.
                    flex="0 0 clamp(36rem, 38%, 52rem)"
                    bgcolor={c.accentSoft}
                    p="4rem 4.4rem"
                    display="flex"
                    flexDirection="column"
                    gap="3.2rem"
                >
                    <Logo />
                    <Box flex="1" display="flex" flexDirection="column" justifyContent="center" gap="2.4rem">
                        {panel}
                    </Box>
                    <MiniBoard />
                </Box>
            )}

            <Box flex="1" display="flex" justifyContent="center" alignItems="center" p="3.2rem 2.4rem">
                <Box width="100%" maxWidth="44rem">
                    {isNarrow && (
                        <Box mb="3.2rem">
                            <Logo />
                        </Box>
                    )}
                    <Typography variant="h2" component="h1">{title}</Typography>
                    <Box mt="0.8rem" mb="3.2rem" fontSize="1.5rem" color={c.ink2}>{subtitle}</Box>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

/** The three-point list used on both panels. */
export function PanelPoints({ headline, sub, points }) {
    return (
        <>
            <Box>
                <Typography fontSize="3.4rem" fontWeight="640" lineHeight="1.2" sx={{ textWrap: "balance" }}>
                    {headline}
                </Typography>
                <Typography fontSize="1.5rem" color={c.ink2} mt="1.2rem">{sub}</Typography>
            </Box>
            <Stack gap="1.4rem">
                {points.map((point) => (
                    <Stack key={point} direction="row" gap="1.1rem" alignItems="flex-start">
                        <Box
                            mt="0.2rem"
                            width="2.1rem"
                            height="2.1rem"
                            borderRadius="50%"
                            bgcolor={c.accent}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink="0"
                        >
                            <CheckIcon sx={{ fontSize: "1.4rem", color: "#FFFFFF" }} />
                        </Box>
                        <Typography fontSize="1.5rem">{point}</Typography>
                    </Stack>
                ))}
            </Stack>
        </>
    );
}

/**
 * Decorative: a board reduced to its silhouette — three columns, each with a header and cards.
 * At this size it has to read as "a board" from shape alone, so the columns need a header row and
 * more than one card; bare rectangles just looked like unloaded content.
 */
function MiniBoard() {
    const columns = [
        { header: "45%", cards: [{ stripe: c.crit, lines: ["78%", "52%"] }, { stripe: c.warn, lines: ["64%"] }] },
        { header: "58%", cards: [{ stripe: c.accent, lines: ["70%", "44%"] }] },
        { header: "38%", cards: [{ stripe: c.line2, lines: ["56%"] }] },
    ];

    return (
        <Stack direction="row" gap="0.8rem" aria-hidden="true">
            {columns.map((column, columnIndex) => (
                <Stack
                    key={columnIndex}
                    flex="1"
                    gap="0.7rem"
                    p="1rem"
                    borderRadius="0.6rem"
                    bgcolor={c.bg}
                    border={`0.1rem solid ${c.line}`}
                >
                    <Box height="0.7rem" width={column.header} borderRadius="0.4rem" bgcolor={c.ink3} sx={{ opacity: 0.45 }} />
                    {column.cards.map((card, cardIndex) => (
                        <Stack
                            key={cardIndex}
                            direction="row"
                            gap="0.5rem"
                            p="0.6rem"
                            borderRadius="0.4rem"
                            bgcolor={c.canvas}
                            border={`0.1rem solid ${c.line}`}
                        >
                            <Box width="0.2rem" borderRadius="0.1rem" bgcolor={card.stripe} flexShrink="0" />
                            <Stack gap="0.4rem" flex="1">
                                {card.lines.map((width, lineIndex) => (
                                    <Box key={lineIndex} height="0.4rem" width={width} borderRadius="0.2rem" bgcolor={c.ink3} sx={{ opacity: 0.32 }} />
                                ))}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            ))}
        </Stack>
    );
}

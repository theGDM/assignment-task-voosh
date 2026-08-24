import React from "react";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Draggable } from "react-beautiful-dnd";
import { c } from "../../theme";
import { describeDue } from "./dueDate";

/**
 * A card on the board. The whole card opens the task; only the bin is a separate action, and it
 * stops propagation so deleting never also opens what you just deleted.
 */
export default function TaskCard({ task, index, onOpen, onDelete }) {
    const due = describeDue(task.taskDeadline);

    return (
        // Ids are numbers now that the API is MySQL-backed, and react-beautiful-dnd rejects a
        // non-string draggableId outright.
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onOpen(task)}
                    sx={{
                        position: "relative",
                        mb: "1rem",
                        p: "1.2rem 1.4rem 1.2rem 1.8rem",
                        borderRadius: "0.6rem",
                        cursor: "pointer",
                        bgcolor: snapshot.isDragging ? c.bg : c.canvas,
                        border: `0.1rem solid ${snapshot.isDragging ? c.accent : c.line}`,
                        // The only shadow on the board: it marks the one card in the air.
                        boxShadow: snapshot.isDragging ? "0 0.6rem 1.6rem rgba(16, 32, 27, 0.14)" : "none",
                        overflow: "hidden",
                        "&:hover": { borderColor: c.line2, bgcolor: c.bg },
                        "&:hover .task-delete": { opacity: 1 },
                        "&:focus-visible": { outline: `0.2rem solid ${c.accent}`, outlineOffset: "0.2rem" },
                    }}
                >
                    {/* Deadline read twice: as a stripe for scanning the column, as text for reading the card. */}
                    <Box
                        position="absolute"
                        left="0"
                        top="0"
                        bottom="0"
                        width="0.3rem"
                        bgcolor={due.stripe}
                    />

                    <Stack direction="row" alignItems="flex-start" gap="0.8rem">
                        <Typography
                            flex="1"
                            fontSize="1.5rem"
                            fontWeight="600"
                            lineHeight="1.35"
                            color={c.ink}
                            sx={{ wordBreak: "break-word" }}
                        >
                            {task.title}
                        </Typography>

                        <Tooltip title="Delete task">
                            <IconButton
                                className="task-delete"
                                size="small"
                                aria-label={`Delete ${task.title}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDelete(task);
                                }}
                                sx={{
                                    opacity: 0,
                                    color: c.ink3,
                                    transition: "opacity 120ms ease",
                                    "&:hover": { color: c.crit, bgcolor: c.critSoft },
                                    "&:focus-visible": { opacity: 1 },
                                }}
                            >
                                <DeleteOutlineIcon sx={{ fontSize: "1.8rem" }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    {task.description && (
                        <Typography
                            mt="0.5rem"
                            fontSize="1.25rem"
                            color={c.ink2}
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {task.description}
                        </Typography>
                    )}

                    <Box
                        mt="1rem"
                        display="inline-block"
                        px="0.8rem"
                        py="0.3rem"
                        borderRadius="999px"
                        bgcolor={due.tone === c.ink2 ? c.sunken : `${due.tone}1A`}
                    >
                        <Typography fontSize="1.1rem" fontWeight="600" color={due.tone}>
                            {due.label}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Draggable>
    );
}

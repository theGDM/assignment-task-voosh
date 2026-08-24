import React, { useEffect, useState } from "react";
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Field from "../../components/Field";
import { c } from "../../theme";
import { apiErrorMessage } from "../../api/client";
import { createTask, updateTask } from "../../api/tasks";
import { describeDue } from "./dueDate";

/**
 * One dialog for creating and editing.
 *
 * CreateTaskDialog and UpdateTaskDialog were 294 and 296 lines of near-identical react-modal
 * markup; the only real difference was which API call ran on submit. That's a prop.
 */
export default function TaskDialog({ open, task, columnName, onClose, onSaved }) {
    const isEdit = Boolean(task);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSaving, setSaving] = useState(false);

    // Reset every time it opens, so a cancelled edit doesn't leak into the next task.
    useEffect(() => {
        if (!open) return;
        setTitle(task?.title ?? "");
        setDescription(task?.description ?? "");
        setDeadline(task?.taskDeadline ?? "");
        setErrors({});
        setFormError("");
    }, [open, task]);

    const validate = () => {
        const found = {};
        if (title.trim() === "") found.title = "Give the task a title.";
        if (description.trim() === "") found.description = "Say what needs doing.";
        if (deadline === "") found.deadline = "Pick a due date.";
        setErrors(found);
        return Object.keys(found).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setSaving(true);
        setFormError("");
        try {
            if (isEdit) {
                await updateTask(task.id, {
                    title: title.trim(),
                    description: description.trim(),
                    taskDeadline: deadline,
                });
            } else {
                await createTask(localStorage.getItem("userId"), {
                    title: title.trim(),
                    description: description.trim(),
                    taskDeadline: deadline,
                });
            }
            onSaved(isEdit ? "Task updated." : "Task created.");
            onClose();
        } catch (err) {
            setFormError(apiErrorMessage(err, "Couldn't save the task. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    const due = describeDue(deadline);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    border: `0.1rem solid ${c.line}`,
                    borderRadius: "1rem",
                    boxShadow: "0 2.4rem 6rem rgba(16, 32, 27, 0.18)",
                },
            }}
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle sx={{ p: "2.4rem 2.4rem 0" }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap="1.6rem">
                        <Box>
                            {isEdit && columnName && (
                                <Typography fontSize="1.2rem" color={c.ink3} mb="0.4rem">
                                    {columnName}
                                </Typography>
                            )}
                            <Typography fontSize="2.2rem" fontWeight="640" letterSpacing="-0.015em">
                                {isEdit ? "Edit task" : "New task"}
                            </Typography>
                        </Box>
                        <IconButton aria-label="Close" onClick={onClose} sx={{ color: c.ink3, mt: "-0.4rem" }}>
                            <CloseIcon sx={{ fontSize: "2rem" }} />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ p: "2rem 2.4rem !important" }}>
                    <Stack gap="1.8rem">
                        {formError && (
                            <Alert severity="error" sx={{ fontSize: "1.4rem", py: 0.5, alignItems: "center" }}>
                                {formError}
                            </Alert>
                        )}

                        <Field
                            label="Title"
                            placeholder="What needs doing?"
                            value={title}
                            error={errors.title}
                            autoFocus
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <Field
                            label="Description"
                            placeholder="Any detail worth remembering later"
                            value={description}
                            error={errors.description}
                            multiline
                            // `rows` renders a plain textarea; `minRows` would bring in MUI's
                            // TextareaAutosize, whose ResizeObserver trips the dev overlay with
                            // "ResizeObserver loop completed with undelivered notifications".
                            rows={6}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Field
                            label="Due date"
                            type="date"
                            value={deadline}
                            error={errors.deadline}
                            hint={deadline ? due.label : "The board sorts and colours cards by this."}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: "0 2.4rem 2.4rem", gap: "1rem" }}>
                    <Button variant="text" onClick={onClose} sx={{ color: c.ink2 }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSaving}>
                        {isSaving ? "Saving…" : isEdit ? "Save changes" : "Create task"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

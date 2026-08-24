import { useMemo, useState } from "react";
import {
    Box, Button, InputAdornment, MenuItem, Select, Stack, TextField, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import AppHeader from "../../components/AppHeader";
import TaskCard from "./TaskCard";
import TaskDialog from "./TaskDialog";
import useUserTasks from "./useUserTasks";
import { COLUMNS, DONE_COLUMN, DUE_FILTERS, columnName } from "./columns";
import { describeDue } from "./dueDate";
import { apiErrorMessage } from "../../api/client";
import { deleteTask, updateTask } from "../../api/tasks";
import { notifyError, notifySuccess } from "../../utils/notify";
import { c } from "../../theme";

const BoardPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [dueFilter, setDueFilter] = useState("all");
    const [dialogTask, setDialogTask] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const userId = localStorage.getItem("userId");
    const { tasks, refresh } = useUserTasks(userId);

    // One pipeline: search, then due filter, then group by column. The old dashboard repeated this
    // grouping three times and the two filters overwrote each other.
    const board = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        const visible = tasks.filter((task) => {
            if (term && !task.title?.toLowerCase().includes(term)) return false;
            if (dueFilter === "all") return true;

            const { days } = describeDue(task.taskDeadline);
            if (days === null) return false;
            if (dueFilter === "overdue") return days < 0;
            if (dueFilter === "today") return days === 0;
            return days >= 0 && days <= Number(dueFilter);
        });

        return COLUMNS.map((column) => ({
            ...column,
            tasks: visible
                .filter((task) => task.column === column.id)
                .sort((a, b) => String(a.taskDeadline).localeCompare(String(b.taskDeadline))),
        }));
    }, [tasks, searchTerm, dueFilter]);

    const total = tasks.length;
    const done = tasks.filter((task) => task.column === DONE_COLUMN).length;
    const isFiltered = searchTerm.trim() !== "" || dueFilter !== "all";
    const showing = board.reduce((count, column) => count + column.tasks.length, 0);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const targetColumn = Number(destination.droppableId);
        const moved = tasks.find((task) => String(task.id) === draggableId);
        if (!moved || moved.column === targetColumn) return;

        try {
            await updateTask(moved.id, { column: targetColumn });
            refresh();
        } catch (err) {
            // The card has already moved on screen; if the save failed, reload rather than leave
            // the board claiming something the server never accepted.
            notifyError(apiErrorMessage(err, "Couldn't move that task."));
            refresh();
        }
    };

    const handleDelete = async (task) => {
        try {
            await deleteTask(task.id);
            notifySuccess("Task deleted.");
            refresh();
        } catch (err) {
            notifyError(apiErrorMessage(err, "Couldn't delete that task."));
        }
    };

    const openNew = () => {
        setDialogTask(null);
        setDialogOpen(true);
    };

    const openTask = (task) => {
        setDialogTask(task);
        setDialogOpen(true);
    };

    return (
        <Box
            bgcolor={c.canvas}
            minHeight="100vh"
            height={{ md: "100vh" }}
            display="flex"
            flexDirection="column"
            overflow={{ md: "hidden" }}
        >
            <AppHeader />

            <Box
                p={{ xs: "2rem 1.2rem", md: "2.4rem 2.4rem" }}
                flex={{ md: 1 }}
                minHeight="0"
                display="flex"
                flexDirection="column"
                overflow={{ md: "hidden" }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "flex-end" }}
                    gap="1.6rem"
                    mb="2.4rem"
                    flexShrink="0"
                >
                    <Box>
                        <Typography fontSize="2.8rem" fontWeight="640" letterSpacing="-0.02em">
                            Your board
                        </Typography>
                        <Typography fontSize="1.4rem" color={c.ink2} mt="0.4rem">
                            {total === 0
                                ? "No tasks yet"
                                : `${total} ${total === 1 ? "task" : "tasks"} · ${done} done`}
                            {isFiltered && ` · showing ${showing}`}
                        </Typography>
                    </Box>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
                        New task
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    gap="1.2rem"
                    mb="2.4rem"
                    p="1.2rem"
                    flexShrink="0"
                    bgcolor={c.bg}
                    border={`0.1rem solid ${c.line}`}
                    borderRadius="0.6rem"
                >
                    <TextField
                        placeholder="Search tasks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ maxWidth: { sm: "32rem" } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: "2rem", color: c.ink3 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Select
                        value={dueFilter}
                        onChange={(e) => setDueFilter(e.target.value)}
                        sx={{ minWidth: "18rem", bgcolor: c.sunken, fontSize: "1.5rem" }}
                    >
                        {DUE_FILTERS.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontSize: "1.5rem" }}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        gap="1.6rem"
                        alignItems="stretch"
                        flex={{ md: 1 }}
                        minHeight="0"
                    >
                        {board.map((column) => (
                            <Box
                                key={column.id}
                                flex="1"
                                minWidth="0"
                                minHeight="0"
                                display="flex"
                                flexDirection="column"
                                bgcolor={c.bg}
                                border={`0.1rem solid ${c.line}`}
                                borderRadius="0.6rem"
                                p="1.4rem"
                            >
                                <Stack direction="row" alignItems="center" gap="0.8rem" mb="1.4rem">
                                    <Typography fontSize="1.4rem" fontWeight="640">
                                        {column.name}
                                    </Typography>
                                    <Box px="0.8rem" py="0.1rem" borderRadius="999px" bgcolor={c.sunken}>
                                        <Typography fontSize="1.2rem" color={c.ink2}>
                                            {column.tasks.length}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Droppable droppableId={String(column.id)}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            flex="1"
                                            // minHeight 0 lets a flex child shrink below its
                                            // content, which is what makes the scroll happen here
                                            // rather than pushing the page taller.
                                            minHeight={{ xs: "8rem", md: "0" }}
                                            overflow="auto"
                                            borderRadius="0.5rem"
                                            sx={{
                                                transition: "background-color 120ms ease",
                                                bgcolor: snapshot.isDraggingOver ? c.accentSoft : "transparent",
                                            }}
                                        >
                                            {column.tasks.map((task, index) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    index={index}
                                                    onOpen={openTask}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                            {provided.placeholder}

                                            {column.tasks.length === 0 && !snapshot.isDraggingOver && (
                                                <Box
                                                    p="2rem 1.2rem"
                                                    textAlign="center"
                                                    border={`0.1rem dashed ${c.line2}`}
                                                    borderRadius="0.6rem"
                                                >
                                                    <Typography fontSize="1.25rem" color={c.ink3}>
                                                        {isFiltered ? "Nothing matches your filters." : column.empty}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        ))}
                    </Stack>
                </DragDropContext>
            </Box>

            <TaskDialog
                open={isDialogOpen}
                task={dialogTask}
                columnName={columnName(dialogTask?.column)}
                onClose={() => setDialogOpen(false)}
                onSaved={(message) => {
                    notifySuccess(message);
                    refresh();
                }}
            />
        </Box>
    );
};

export default BoardPage;

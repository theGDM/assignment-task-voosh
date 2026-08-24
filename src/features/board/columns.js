/** The board's fixed columns. `id` is the `column` value the API stores on a task. */
export const COLUMNS = [
    { id: 0, name: "To do", empty: "Nothing queued up yet." },
    { id: 1, name: "In progress", empty: "Drag a card here when you start it." },
    { id: 2, name: "Done", empty: "Finished work lands here." },
];

export const DONE_COLUMN = 2;

export const columnName = (id) => COLUMNS.find((column) => column.id === id)?.name;

export const DUE_FILTERS = [
    { value: "all", label: "All tasks" },
    { value: "overdue", label: "Overdue" },
    { value: "today", label: "Due today" },
    { value: "3", label: "Next 3 days" },
    { value: "7", label: "Next 7 days" },
];

import { c } from "../../theme";

const DAY = 1000 * 60 * 60 * 24;

/**
 * How a deadline should read on a card.
 *
 * The old card measured `taskDeadline - createdAt`, which is the task's original duration, not the
 * time left — and wrapped it in Math.abs(), so an overdue task counted upwards as if it were fine.
 * This measures from today and says so.
 */
export function describeDue(taskDeadline) {
    if (!taskDeadline) {
        return { label: "No due date", tone: c.ink3, stripe: c.line2, days: null };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(taskDeadline);
    due.setHours(0, 0, 0, 0);

    const days = Math.round((due - today) / DAY);

    if (Number.isNaN(days)) {
        return { label: "No due date", tone: c.ink3, stripe: c.line2, days: null };
    }
    if (days < 0) {
        const overdue = Math.abs(days);
        return {
            label: overdue === 1 ? "1 day overdue" : `${overdue} days overdue`,
            tone: c.crit,
            stripe: c.crit,
            days,
        };
    }
    if (days === 0) return { label: "Due today", tone: c.crit, stripe: c.crit, days };
    if (days === 1) return { label: "Due tomorrow", tone: c.warn, stripe: c.warn, days };
    if (days <= 3) return { label: `${days} days left`, tone: c.warn, stripe: c.warn, days };

    return { label: `${days} days left`, tone: c.ink2, stripe: c.line2, days };
}

/** "1 Sep 2026" — for the dialog, where the actual date matters more than the countdown. */
export function formatDue(taskDeadline) {
    if (!taskDeadline) return "";
    const due = new Date(taskDeadline);
    if (Number.isNaN(due.getTime())) return taskDeadline;
    return due.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

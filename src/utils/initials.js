/**
 * "Gyandeep Mehra" -> "GM". One name gives one letter; a middle name is ignored, so
 * "Gyandeep Kumar Mehra" is still "GM".
 *
 * Falls back to the email's first letter, since the account always has one of the two.
 */
export default function initialsFrom(fullName, email) {
    const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return (email ?? "?").trim().charAt(0).toUpperCase() || "?";
}

// Display name and initials for a Supabase user.
// Email/password signups usually have no name metadata, so every step falls
// back gracefully: full name -> first/last name -> email -> empty string.

function firstLetter(part) {
  // Array.from keeps accented and non-Latin characters intact.
  const [letter = ""] = Array.from(part.replace(/^[^\p{L}\p{N}]+/u, ""));
  return letter.toLocaleUpperCase();
}

export function displayName(user) {
  const meta = user?.user_metadata || {};
  const joined = [meta.first_name || meta.given_name, meta.last_name || meta.family_name].filter(Boolean).join(" ");
  const name = [meta.full_name, meta.name, meta.display_name, joined].find(value => typeof value === "string" && value.trim());
  return name ? name.trim().replace(/\s+/g, " ") : "";
}

export function userInitials(user) {
  const name = displayName(user);
  if (name) {
    const letters = name.split(" ").slice(0, 2).map(firstLetter).join("");
    if (letters) return letters;
  }
  return typeof user?.email === "string" ? firstLetter(user.email) : "";
}

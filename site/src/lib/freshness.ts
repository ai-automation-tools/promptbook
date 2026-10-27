/** An item last checked against its source more than this many days ago gets a stale badge (O02). */
export const STALE_DAYS = 90;

/** `checked` is the index's YYYY-MM-DD; an item with none is never called stale, only undated. */
export const isStale = (checked: string | undefined, now = Date.now()) =>
  !!checked && now - Date.parse(checked) > STALE_DAYS * 86_400_000;

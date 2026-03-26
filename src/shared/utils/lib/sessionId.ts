import { v4 as uuidv4 } from "uuid";

const SESSION_ID_COOKIE = "starter_session_id";

/**
 * Gets the current session ID from cookies or generates a new one.
 * Should be called in Client Components.
 */
export function getOrGenerateSessionId(): string {
  if (typeof window === "undefined") return "";

  const name = SESSION_ID_COOKIE + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  // Not found, generate new
  const sessionId = uuidv4();
  const d = new Date();
  d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const expires = "expires=" + d.toUTCString();
  document.cookie = SESSION_ID_COOKIE + "=" + sessionId + ";" + expires + ";path=/";

  return sessionId;
}

/**
 * Gets the current session ID from cookies.
 * Can be used in Server Components/Actions.
 */
export function getSessionIdFromCookies(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): string | undefined {
  return cookieStore.get(SESSION_ID_COOKIE)?.value;
}

export {
  getSession,
  getApiAuth,
  PROXY_EMAIL_HEADER,
  DEV_SESSION_COOKIE,
  type Session,
  type AuthConfig,
} from "./auth.js";

export { requireAuth } from "./gate.js";

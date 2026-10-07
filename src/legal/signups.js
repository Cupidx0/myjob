import { deleteUser, getAdditionalUserInfo } from "firebase/auth";
import { LEGAL } from "./config.js";

export const SIGNUPS_CLOSED_MSG = "Sign-ups are closed for now. Only existing accounts can sign in.";

// Google/GitHub popups create an account on first use, even from the login page.
// While sign-ups are closed, undo that straight away so no new user's data is kept.
// Returns true if the sign-in was rejected.
export const rejectNewAccountIfClosed = async (result) => {
  if (LEGAL.signupsOpen || !getAdditionalUserInfo(result)?.isNewUser) return false;
  await deleteUser(result.user);
  return true;
};

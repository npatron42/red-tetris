import { parseUrlSafeName, sanitizeUrlSafeNameInput } from "./urlSafeName";

export const USER_NAME_MAX_LENGTH = 16;

export const sanitizeUserNameInput = userName => sanitizeUrlSafeNameInput(userName, USER_NAME_MAX_LENGTH);

export const parseUserName = userName => parseUrlSafeName(userName, USER_NAME_MAX_LENGTH);

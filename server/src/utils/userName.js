import { isUrlSafeNameValid, parseUrlSafeName } from "./urlSafeName.js";

export const USER_NAME_MAX_LENGTH = 16;

export const parseUserName = userName => parseUrlSafeName(userName, USER_NAME_MAX_LENGTH);

export const isUserNameFormatValid = userName => isUrlSafeNameValid(userName, USER_NAME_MAX_LENGTH);

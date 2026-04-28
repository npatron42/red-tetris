import { isUrlSafeNameValid, parseUrlSafeName } from "./urlSafeName.js";

export const ROOM_NAME_MAX_LENGTH = 32;

export const parseRoomName = roomName => parseUrlSafeName(roomName, ROOM_NAME_MAX_LENGTH);

export const isRoomNameFormatValid = roomName => isUrlSafeNameValid(roomName, ROOM_NAME_MAX_LENGTH);

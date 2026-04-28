import { parseUrlSafeName, sanitizeUrlSafeNameInput } from "./urlSafeName";

export const ROOM_NAME_MAX_LENGTH = 32;

export const sanitizeRoomNameInput = roomName => sanitizeUrlSafeNameInput(roomName, ROOM_NAME_MAX_LENGTH);

export const parseRoomName = roomName => parseUrlSafeName(roomName, ROOM_NAME_MAX_LENGTH);

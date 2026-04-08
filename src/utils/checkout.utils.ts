import { ROOM_NUMBERS } from '@/lib/constants';

export const isRoomNoValid = (roomNo: string): boolean => {
	return (ROOM_NUMBERS as readonly string[]).includes(roomNo);
};

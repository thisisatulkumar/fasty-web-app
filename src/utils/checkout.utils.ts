import { ROOM_NUMBERS } from '@/constants/allowedRooms';

export const checkRoom = (roomno: string): boolean => {
	return (ROOM_NUMBERS as readonly string[]).includes(roomno);
};

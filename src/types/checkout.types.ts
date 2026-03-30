import { ROOM_NUMBERS } from '@/constants/allowedRooms';

export type RoomNumber = (typeof ROOM_NUMBERS)[number];
export type PlaceOrderParams = {
	roomNo: RoomNumber;
	paymentMethod: 'UPI' | 'COD';
	userId: string;
};

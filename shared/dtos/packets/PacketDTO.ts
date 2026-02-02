export interface PacketDTO<T = unknown> {
	success: boolean;
	data?: T;
	error?: unknown;
	message?: string;
}
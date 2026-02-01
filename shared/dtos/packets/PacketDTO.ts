export interface PacketDTO<T = unknown> {
	success: boolean;
	data?: T | undefined;
	error?: unknown;
	message?: string;
}
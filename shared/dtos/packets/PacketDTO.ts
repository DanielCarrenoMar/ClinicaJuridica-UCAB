export interface PacketDTO<T = unknown> {
	success: boolean;
	data: T | null;
	error?: unknown;
	message?: string;
}
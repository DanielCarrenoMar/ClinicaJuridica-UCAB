import { PacketDTO } from "./PacketDTO";

export interface PacketPaginationDTO<T = unknown> extends PacketDTO<T> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        all: boolean;
    }
}
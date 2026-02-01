import { PacketDTO } from "./PacketDTO";

export interface PakectPaginationDTO<T = unknown> extends PacketDTO<T> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        all: boolean;
    }
}
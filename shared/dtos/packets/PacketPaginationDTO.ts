import { PacketDTO } from "./PacketDTO.js";

export interface PacketPaginationDTO<T = unknown> extends PacketDTO<T> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        all: boolean;
    }
}

export interface PacketPaginationQueryDTO {
    page: number;
    limit: number;
    all: boolean;
    search: string;
}
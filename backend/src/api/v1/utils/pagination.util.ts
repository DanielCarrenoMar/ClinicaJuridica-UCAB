import { PacketPaginationQueryDTO } from "@app/shared/dtos/packets/PacketPaginationDTO";

export type PaginationParams = {
  page: number;
  limit: number;
  all: boolean;
};

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'si', 'sí', 'all', 'todas'].includes(normalized);
  }
  return undefined;
}

function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function parsePagination(query: Partial<PacketPaginationQueryDTO>): PacketPaginationQueryDTO {
  const all = parseBoolean(query.all) ?? !(query.page !== undefined && query.limit !== undefined);
  const page = all ? 1 : Math.max(1, parseNumber(query.page, 1));
  const limit = all ? 0 : Math.max(1, parseNumber(query.limit, 15));
  const search = query.search ?? '';

  return { page, limit, all, search };
}

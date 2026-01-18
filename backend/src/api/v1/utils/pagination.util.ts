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

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const pageRaw = query.page ?? query.pagina;
  const limitRaw = query.limit ?? query.cantidad ?? query.perPage;
  const allRaw = query.all ?? query.todas ?? query.allPages;

  const hasPageAndLimit = pageRaw !== undefined && limitRaw !== undefined;
  const all = parseBoolean(allRaw) ?? !hasPageAndLimit;
  const page = all ? 1 : Math.max(1, parseNumber(pageRaw, 1));
  const limit = all ? 0 : Math.max(1, parseNumber(limitRaw, 15));

  return { page, limit, all };
}

import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{from}–{to} of {total}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Page size picker */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows:</span>
          <Select
            value={String(pageSize)}
            onValueChange={v => { onPageSizeChange(Number(v)); onPageChange(1); }}
          >
            <SelectTrigger className="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 20].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page nav */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper hook — keeps page/pageSize state and slices data
export function usePagination<T>(data: T[], defaultPageSize = 10) {
  const [page, setPage]         = useState_import(1);
  const [pageSize, setPageSize] = useState_import(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const sliced     = data.slice((safePage - 1) * pageSize, safePage * pageSize);

  const setPageSafe = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    page: safePage,
    pageSize,
    totalPages,
    paged: sliced,
    setPage: setPageSafe,
    setPageSize: (s: number) => { setPageSize(s); setPage(1); },
  };
}

// We can't import useState directly here without a React import, so use a thin wrapper
import { useState as useState_import } from 'react';

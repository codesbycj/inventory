import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { InventoryTable } from '../components/InventoryTable';
import { UpdateStockModal } from '../components/UpdateStockModal';
import type { InventoryItem } from '../types/inventory';

const btnPrimary =
  'px-4.5 py-2.25 bg-blue-600 text-white border border-transparent rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed';

export function InventoryPage() {
  // ── URL-synced search term ────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(value ? { search: value } : {}, { replace: true });
  };

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { data, isPending, isError, error, refetch } = useInventory();

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filtered = useMemo<InventoryItem[]>(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    );
  }, [data, search]);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleRowClick = useCallback((item: InventoryItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-275 mx-auto px-5 py-8">
      <header className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Inventory</h1>
          {data && (
            <p className="text-[13px] text-slate-500 mt-0.5">
              Showing {filtered.length} of {data.length} items
            </p>
          )}
        </div>

        <div className="relative flex-1 max-w-sm min-w-50">
          <svg
            className="absolute left-2.75 top-1/2 -translate-y-1/2 w-3.75 h-3.75 text-slate-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="w-full py-2.25 pl-8.5 pr-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            placeholder="Search by name, SKU, or category…"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search inventory"
          />
        </div>
      </header>

      <main>
        {isPending && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-20 px-6 bg-white border border-slate-200 rounded-lg"
            role="status"
            aria-label="Loading inventory"
          >
            <div
              className="w-8.5 h-8.5 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin"
              aria-hidden="true"
            />
            <p className="text-sm text-slate-500">Loading inventory…</p>
          </div>
        )}

        {isError && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-20 px-6 bg-white border border-slate-200 rounded-lg text-center"
            role="alert"
          >
            <svg
              className="w-10 h-10 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm font-medium text-red-600">
              {error instanceof Error ? error.message : 'Failed to load inventory.'}
            </p>
            <button className={btnPrimary} onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {!isPending && !isError && (
          <InventoryTable items={filtered} onRowClick={handleRowClick} />
        )}
      </main>

      {selectedItem && (
        <UpdateStockModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </div>
  );
}

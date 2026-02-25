import type { InventoryItem } from '../types/inventory';

interface Props {
  items: InventoryItem[];
  onRowClick: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onRowClick }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-slate-200 rounded-lg text-center">
        <p className="text-sm text-slate-500">No items match your search.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-2.75 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 whitespace-nowrap">Name</th>
            <th className="px-4 py-2.75 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 whitespace-nowrap">SKU</th>
            <th className="px-4 py-2.75 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 whitespace-nowrap">Category</th>
            <th className="px-4 py-2.75 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 whitespace-nowrap">Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick(item)}
              role="button"
              tabIndex={0}
              aria-label={`Edit stock for ${item.name}`}
              className="border-b border-slate-200 last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRowClick(item);
                }
              }}
            >
              <td className="px-4 py-3.25 text-sm font-medium text-slate-900">{item.name}</td>
              <td className="px-4 py-3.25 font-mono text-[13px] text-slate-400">{item.sku}</td>
              <td className="px-4 py-3.25">
                <span className="inline-block px-2.25 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {item.category}
                </span>
              </td>
              <td className="px-4 py-3.25 flex items-center gap-2">
                <span className={item.stock < 50 ? 'font-semibold text-red-600' : 'font-semibold text-slate-900'}>
                  {item.stock}
                </span>
                {item.stock < 50 && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-red-600 bg-red-50 border border-red-200 rounded-full px-1.75 py-px">
                    Low
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

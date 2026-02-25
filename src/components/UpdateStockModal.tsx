import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateStock } from '../hooks/useInventory';
import type { InventoryItem } from '../types/inventory';



const schema = z.object({
  stock: z
    .number({ error: 'Please enter a valid number.' })
    .int('Stock must be a whole number.')
    .positive('Stock must be greater than 0.'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

export function UpdateStockModal({ item, onClose }: Props) {
  const { mutate, isPending, isError, error, reset: resetMutation } = useUpdateStock();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stock: item.stock },
  });


  const onSubmit = (data: FormValues) => {
    resetMutation();
    mutate(
      { id: item.id, stock: data.stock },
      { onSuccess: () => onClose() },
    );
  };

  const handleBackdropClick = () => {
    if (!isPending) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-[200] animate-fade-in"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-110 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200">
          <h2 id="modal-title" className="text-[17px] font-semibold text-slate-900">
            Update Stock
          </h2>
          <button
            className="bg-transparent border-0 text-[22px] leading-none text-slate-400 px-2 py-0.5 rounded-md cursor-pointer transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        {/* Modal */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          <dl className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex flex-col gap-1.5">
            <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Item</dt>
              <dd className="text-sm text-slate-900">{item.name}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">SKU</dt>
              <dd className="font-mono text-sm text-slate-900">{item.sku}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Current stock</dt>
              <dd className="text-sm text-slate-900">{item.stock}</dd>
            </div>
          </dl>

          {isError && (
            <div
              className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[13px]"
              role="alert"
            >
              {error instanceof Error
                ? error.message
                : 'Update failed. Please try again.'}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="stock-input" className="text-sm font-medium text-slate-900">
                New stock quantity
              </label>
              <input
                id="stock-input"
                type="number"
                min={1}
                step={1}
                autoFocus
                disabled={isPending}
                className={`w-full px-3 py-2.25 border rounded-lg text-sm text-slate-900 bg-white outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 focus:ring-[3px] ${
                  errors.stock
                    ? 'border-red-600 focus:ring-red-600/10'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/10'
                }`}
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && (
                <span id="stock-error" className="text-[13px] text-red-600" role="alert">
                  {errors.stock.message}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                className=  'px-4.5 py-2.25 bg-transparent text-slate-900 border border-slate-200 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </button>
              <button type="submit" className=  'px-4.5 py-2.25 bg-blue-600 text-white border border-transparent rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap' disabled={isPending}>
                {isPending ? 'Saving…' : 'Update Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

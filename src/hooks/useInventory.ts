import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, updateItemStock } from '../data/mockApi';
import type { InventoryItem } from '../types/inventory';

export const INVENTORY_KEY = ['inventory'] as const;

// ─── Fetch ────────────────────────────────────────────────────────────────────

export function useInventory() {
  return useQuery<InventoryItem[], Error>({
    queryKey: INVENTORY_KEY,
    queryFn: () => fetchInventory(),
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── Update stock (with optimistic update) ────────────────────────────────────

type UpdateVars = { id: string; stock: number };
type UpdateContext = { previous: InventoryItem[] | undefined };

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation<InventoryItem, Error, UpdateVars, UpdateContext>({
    mutationFn: ({ id, stock }) => updateItemStock(id, stock),

    // 1. Optimistically apply the change before the server responds
    onMutate: async ({ id, stock }) => {
      await queryClient.cancelQueries({ queryKey: INVENTORY_KEY });

      const previous = queryClient.getQueryData<InventoryItem[]>(INVENTORY_KEY);

      queryClient.setQueryData<InventoryItem[]>(INVENTORY_KEY, (old) =>
        old?.map((item) => (item.id === id ? { ...item, stock } : item)) ?? [],
      );

      return { previous };
    },

    // 2. Roll back to the snapshot if the server returns an error
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(INVENTORY_KEY, context.previous);
      }
    },

    // 3. Always sync with the server after settle (success or error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEY });
    },
  });
}

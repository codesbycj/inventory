import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, updateItemStock } from '../data/mockApi';
import type { InventoryItem } from '../types/inventory';

export const INVENTORY_KEY = ['inventory'] as const;


export function useInventory() {
  return useQuery<InventoryItem[], Error>({
    queryKey: INVENTORY_KEY,
    queryFn: () => fetchInventory(),
    staleTime: 30000,
    retry: 1,
  });
}


type UpdateVars = { id: string; stock: number };
type UpdateContext = { previous: InventoryItem[] | undefined };

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation<InventoryItem, Error, UpdateVars, UpdateContext>({
    mutationFn: ({ id, stock }) => updateItemStock(id, stock),

    onMutate: async ({ id, stock }) => {
      await queryClient.cancelQueries({ queryKey: INVENTORY_KEY });

      const previous = queryClient.getQueryData<InventoryItem[]>(INVENTORY_KEY);

      queryClient.setQueryData<InventoryItem[]>(INVENTORY_KEY, (data) =>
        data?.map((item) => (item.id === id ? { ...item, stock } : item)) ?? [],
      );

      return { previous };
    },

    // If there's an error show the previous
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(INVENTORY_KEY, context.previous);
      }
    },

    // Always sync with the server after settle (success or error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEY });
    },
  });
}

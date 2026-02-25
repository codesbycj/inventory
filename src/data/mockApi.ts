import type { InventoryItem } from '../types/inventory';

const INITIAL_ITEMS: InventoryItem[] = [
  // Electronics
  { id: '1',  name: 'MacBook Pro 14"',        sku: 'ELC-MBP-14',   category: 'Electronics',   stock: 18  },
  { id: '2',  name: 'Dell 27" 4K Monitor',    sku: 'ELC-MON-4K',   category: 'Electronics',   stock: 34  },
  { id: '3',  name: 'Logitech MX Keys',       sku: 'ELC-KBD-MX',   category: 'Electronics',   stock: 72  },
  { id: '4',  name: 'Sony WH-1000XM5',        sku: 'ELC-HPH-XM5',  category: 'Electronics',   stock: 45  },
  // Furniture
  { id: '5',  name: 'Ergonomic Office Chair', sku: 'FRN-CHR-ERG',  category: 'Furniture',     stock: 12  },
  { id: '6',  name: 'Standing Desk 140cm',    sku: 'FRN-DSK-140',  category: 'Furniture',     stock: 9   },
  { id: '7',  name: 'Bookshelf 5-Tier',       sku: 'FRN-SHF-005',  category: 'Furniture',     stock: 27  },
  // Clothing
  { id: '8',  name: 'Merino Wool Sweater M',  sku: 'CLT-SWT-MWM',  category: 'Clothing',      stock: 88  },
  { id: '9',  name: 'Slim Chinos 32x32',      sku: 'CLT-CHN-3232', category: 'Clothing',      stock: 54  },
  { id: '10', name: 'Running Shoes Sz 10',    sku: 'CLT-SHO-R10',  category: 'Clothing',      stock: 31  },
  // Grocery
  { id: '11', name: 'Organic Olive Oil 1L',   sku: 'GRC-OIL-ORG',  category: 'Grocery',       stock: 140 },
  { id: '12', name: 'Arabica Coffee Beans 1kg', sku: 'GRC-COF-ARB', category: 'Grocery',      stock: 200 },
  { id: '13', name: 'Himalayan Pink Salt 500g', sku: 'GRC-SLT-HIM', category: 'Grocery',      stock: 310 },
  // Sports
  { id: '14', name: 'Yoga Mat 6mm',           sku: 'SPT-YGM-006',  category: 'Sports',        stock: 63  },
  { id: '15', name: 'Resistance Bands Set',   sku: 'SPT-RBS-SET',  category: 'Sports',        stock: 95  },
  { id: '16', name: 'Adjustable Dumbbells 20kg', sku: 'SPT-DBL-020', category: 'Sports',      stock: 8   },
  // Books
  { id: '17', name: 'Clean Code — R. Martin', sku: 'BKS-CCO-RMT',  category: 'Books',         stock: 47  },
  { id: '18', name: 'Atomic Habits — J. Clear', sku: 'BKS-AHB-JCL', category: 'Books',        stock: 120 },
  // Beauty
  { id: '19', name: 'Vitamin C Serum 30ml',   sku: 'BTY-SRM-VTC',  category: 'Beauty',        stock: 76  },
  { id: '20', name: 'SPF 50 Sunscreen 100ml', sku: 'BTY-SUN-SPF',  category: 'Beauty',        stock: 22  },
];

// In-memory store — persists within the same browser session
let db: InventoryItem[] = [...INITIAL_ITEMS];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates fetching inventory from an API.
 * To test the error state, change `shouldFail` to `true`.
 */
export async function fetchInventory(shouldFail = false): Promise<InventoryItem[]> {
  await delay(900);
  if (shouldFail) {
    throw new Error('Failed to load inventory. Please try again.');
  }
  return [...db];
}

/**
 * Simulates updating a single item's stock on the server.
 */
export async function updateItemStock(id: string, stock: number): Promise<InventoryItem> {
  await delay(600);
  const index = db.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Item not found.');
  db[index] = { ...db[index], stock };
  return { ...db[index] };
}

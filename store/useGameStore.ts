import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InventoryItem {
  id: string;
  name: string;
  type: 'hat' | 'shirt' | 'cape' | 'accessory';
  rarity: 'common' | 'rare' | 'epic';
  imageIcon: string;
  unlocked: boolean;
  price: number;
}

interface GameState {
  userName: string;
  lastLoginDate: string | null;
  coins: number;
  streak: number;
  currentLevel: number;
  inventory: InventoryItem[];
  equippedItems: {
    hat?: string;
    shirt?: string;
    cape?: string;
    accessory?: string;
  };
  setUserName: (name: string) => void;
  checkStreak: () => void;
  addCoins: (amount: number) => void;
  unlockItem: (itemId: string) => void;
  equipItem: (itemId: string, type: 'hat' | 'shirt' | 'cape' | 'accessory') => void;
  completeLevel: () => void;
  purchaseItem: (itemId: string) => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      userName: '',
      lastLoginDate: null,
      coins: 100,
      streak: 1,
      currentLevel: 1,
      inventory: [
        { id: 'hat_1', name: 'Boné do Pastor', type: 'hat', rarity: 'common', imageIcon: '👑', unlocked: true, price: 0 },
        { id: 'shirt_1', name: 'Túnica Simples', type: 'shirt', rarity: 'common', imageIcon: '👕', unlocked: true, price: 0 },
        { id: 'cape_1', name: 'Capa do Vencedor', type: 'cape', rarity: 'epic', imageIcon: '🦸', unlocked: false, price: 50 },
        { id: 'hat_2', name: 'Boina Artística', type: 'hat', rarity: 'rare', imageIcon: '🎨', unlocked: false, price: 200 },
        { id: 'shirt_2', name: 'Camisa Colorida', type: 'shirt', rarity: 'rare', imageIcon: '🎽', unlocked: false, price: 300 },
        { id: 'cape_2', name: 'Manto Estelar', type: 'cape', rarity: 'epic', imageIcon: '☄️', unlocked: false, price: 1000 },
      ],
      equippedItems: {
        hat: 'hat_1',
        shirt: 'shirt_1',
      },
      setUserName: (name) => set({ userName: name }),
      checkStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (!state.lastLoginDate) {
          set({ lastLoginDate: today, streak: 1 });
          return;
        }
        
        if (state.lastLoginDate === today) return;

        const lastDate = new Date(state.lastLoginDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          set({ streak: state.streak + 1, lastLoginDate: today });
        } else {
          set({ streak: 1, lastLoginDate: today });
        }
      },
      purchaseItem: (itemId) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        
        if (item && !item.unlocked && state.coins >= item.price) {
          set({
            coins: state.coins - item.price,
            inventory: state.inventory.map(i => i.id === itemId ? { ...i, unlocked: true } : i)
          });
          return true;
        }
        return false;
      },
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      unlockItem: (itemId) => set((state) => ({
        inventory: state.inventory.map(item => item.id === itemId ? { ...item, unlocked: true } : item)
      })),
      equipItem: (itemId, type) => set((state) => ({
        equippedItems: { ...state.equippedItems, [type]: itemId }
      })),
      completeLevel: () => set((state) => ({
        currentLevel: state.currentLevel + 1,
        coins: state.coins + 50
      })),
    }),
    {
      name: 'jornada-da-fe-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

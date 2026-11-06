import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  favorites: string[]; // Tool IDs
  recentTools: { id: string; timestamp: number }[]; // Tool IDs with timestamp

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  addRecentTool: (toolId: string) => void;
  clearRecentTools: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      commandPaletteOpen: false,
      favorites: ['json-formatter', 'jwt-decoder', 'hash-generator', 'diff-checker'],
      recentTools: [],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      toggleFavorite: (toolId: string) => {
        set((state) => {
          const exists = state.favorites.includes(toolId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== toolId)
              : [...state.favorites, toolId],
          };
        });
      },

      isFavorite: (toolId: string) => get().favorites.includes(toolId),

      addRecentTool: (toolId: string) => {
        set((state) => {
          const filtered = state.recentTools.filter((t) => t.id !== toolId);
          return {
            recentTools: [{ id: toolId, timestamp: Date.now() }, ...filtered].slice(0, 8),
          };
        });
      },

      clearRecentTools: () => set({ recentTools: [] }),
    }),
    {
      name: 'devvault-workspace-state',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        favorites: state.favorites,
        recentTools: state.recentTools,
      }),
    }
  )
);


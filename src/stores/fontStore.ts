import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppFontSize = 'small' | 'normal' | 'large' | 'xlarge';

export const FONT_SIZE_PX: Record<AppFontSize, string> = {
  small: '11px',
  normal: '13px',
  large: '15px',
  xlarge: '17px',
};

interface FontSizeState {
  fontSize: AppFontSize;
  setFontSize: (size: AppFontSize) => void;
  initFontSize: () => void;
}

export const applyFontSizeToDOM = (size: AppFontSize) => {
  if (typeof document === 'undefined') return;
  const px = FONT_SIZE_PX[size] || '13px';
  document.documentElement.style.fontSize = px;
  document.documentElement.setAttribute('data-font-size', size);
};

export const useFontSizeStore = create<FontSizeState>()(
  persist(
    (set, get) => ({
      fontSize: 'normal',

      setFontSize: (size: AppFontSize) => {
        applyFontSizeToDOM(size);
        set({ fontSize: size });
      },

      initFontSize: () => {
        const current = get().fontSize || 'normal';
        applyFontSizeToDOM(current);
        set({ fontSize: current });
      },
    }),
    {
      name: 'devvault-font-size',
      partialize: (state) => ({ fontSize: state.fontSize }),
    }
  )
);


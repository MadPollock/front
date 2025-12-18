/**
 * User Preferences Store (Non-Critical UX State)
 * 
 * This Zustand store manages client-side user preferences and UI state.
 * It is completely isolated from transactional/analytical data.
 * 
 * Key principles:
 * - UI reacts instantly to changes in this store
 * - Data is persisted to localStorage for persistence across sessions
 * - Does NOT contain any business/transactional data
 * - Chart components can use this ONLY for visual themes/preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Theme configuration for charts and UI components
 */
export type ChartTheme = 'default' | 'vibrant' | 'muted' | 'monochrome';

/**
 * User preference state interface
 */
export interface UserPreferences {
  // UI Layout Preferences
  sidebarCollapsed: boolean;
  compactMode: boolean;
  
  // Visual Theme Preferences
  chartTheme: ChartTheme;
  animationsEnabled: boolean;
  
  // Dashboard Customization
  favoriteViews: string[];
  defaultView: string;
  
  // Notification Preferences
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  
  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Data Display Preferences
  dateFormat: 'relative' | 'absolute';
  numberFormat: 'compact' | 'full';
  
  // Last visited state (for UX continuity)
  lastVisitedView: string;
  lastRefreshTime: number | null;
  
  // Setup Progress Tracking
  setupComplete: boolean;
  setupSteps: {
    profileCompleted: boolean;
    firstPaymentConfigured: boolean;
    whitelistConfigured: boolean;
    teamMemberAdded: boolean;
  };
}

/**
 * Actions for mutating user preferences
 */
export interface UserPreferencesActions {
  // Layout actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  
  // Theme actions
  setChartTheme: (theme: ChartTheme) => void;
  toggleAnimations: () => void;
  
  // Dashboard customization
  addFavoriteView: (viewId: string) => void;
  removeFavoriteView: (viewId: string) => void;
  setDefaultView: (viewId: string) => void;
  
  // Notification actions
  setNotificationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Accessibility actions
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  
  // Display format actions
  setDateFormat: (format: 'relative' | 'absolute') => void;
  setNumberFormat: (format: 'compact' | 'full') => void;
  
  // State tracking
  updateLastVisitedView: (viewId: string) => void;
  updateLastRefreshTime: () => void;
  
  // Setup tracking actions
  completeSetupStep: (step: keyof UserPreferences['setupSteps']) => void;
  dismissSetup: () => void;
  
  // Utility actions
  resetPreferences: () => void;
}

/**
 * Combined store type
 */
export type UserPreferencesStore = UserPreferences & UserPreferencesActions;

/**
 * Default preferences (initial state)
 */
const defaultPreferences: UserPreferences = {
  sidebarCollapsed: false,
  compactMode: false,
  chartTheme: 'default',
  animationsEnabled: true,
  favoriteViews: [],
  defaultView: 'dashboard',
  notificationsEnabled: true,
  soundEnabled: false,
  highContrast: false,
  reducedMotion: false,
  dateFormat: 'relative',
  numberFormat: 'compact',
  lastVisitedView: 'dashboard',
  lastRefreshTime: null,
  setupComplete: false,
  setupSteps: {
    profileCompleted: false,
    firstPaymentConfigured: false,
    whitelistConfigured: false,
    teamMemberAdded: false,
  },
};

/**
 * Zustand store with localStorage persistence
 * 
 * Usage example:
 * ```tsx
 * import { useUserPreferences } from '@/store/userPreferences';
 * 
 * function MyComponent() {
 *   const chartTheme = useUserPreferences(state => state.chartTheme);
 *   const setChartTheme = useUserPreferences(state => state.setChartTheme);
 *   
 *   return (
 *     <button onClick={() => setChartTheme('vibrant')}>
 *       Current theme: {chartTheme}
 *     </button>
 *   );
 * }
 * ```
 */
export const useUserPreferences = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      // State
      ...defaultPreferences,
      
      // Actions
      toggleSidebar: () => 
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setSidebarCollapsed: (collapsed) => 
        set({ sidebarCollapsed: collapsed }),
      
      setCompactMode: (enabled) => 
        set({ compactMode: enabled }),
      
      setChartTheme: (theme) => 
        set({ chartTheme: theme }),
      
      toggleAnimations: () => 
        set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      
      addFavoriteView: (viewId) => 
        set((state) => ({
          favoriteViews: state.favoriteViews.includes(viewId)
            ? state.favoriteViews
            : [...state.favoriteViews, viewId],
        })),
      
      removeFavoriteView: (viewId) => 
        set((state) => ({
          favoriteViews: state.favoriteViews.filter((id) => id !== viewId),
        })),
      
      setDefaultView: (viewId) => 
        set({ defaultView: viewId }),
      
      setNotificationsEnabled: (enabled) => 
        set({ notificationsEnabled: enabled }),
      
      setSoundEnabled: (enabled) => 
        set({ soundEnabled: enabled }),
      
      setHighContrast: (enabled) => 
        set({ highContrast: enabled }),
      
      setReducedMotion: (enabled) => 
        set({ reducedMotion: enabled }),
      
      setDateFormat: (format) => 
        set({ dateFormat: format }),
      
      setNumberFormat: (format) => 
        set({ numberFormat: format }),
      
      updateLastVisitedView: (viewId) => 
        set({ lastVisitedView: viewId }),
      
      updateLastRefreshTime: () => 
        set({ lastRefreshTime: Date.now() }),
      
      completeSetupStep: (step) => 
        set((state) => {
          const newSteps = {
            ...state.setupSteps,
            [step]: true,
          };
          
          // Check if all steps are complete
          const allComplete = Object.values(newSteps).every(Boolean);
          
          return {
            setupSteps: newSteps,
            setupComplete: allComplete,
          };
        }),
      
      dismissSetup: () => 
        set({ setupComplete: true }),
      
      resetPreferences: () => 
        set(defaultPreferences),
    }),
    {
      name: 'cqrs-dashboard-preferences', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields (exclude lastRefreshTime)
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
        chartTheme: state.chartTheme,
        animationsEnabled: state.animationsEnabled,
        favoriteViews: state.favoriteViews,
        defaultView: state.defaultView,
        notificationsEnabled: state.notificationsEnabled,
        soundEnabled: state.soundEnabled,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        dateFormat: state.dateFormat,
        numberFormat: state.numberFormat,
        lastVisitedView: state.lastVisitedView,
        setupComplete: state.setupComplete,
        setupSteps: state.setupSteps,
      }),
    }
  )
);

/**
 * Selector helpers for common use cases
 * These provide optimized access to frequently used state slices
 */

export const useIsSidebarCollapsed = () => 
  useUserPreferences((state) => state.sidebarCollapsed);

export const useChartThemeConfig = () => 
  useUserPreferences((state) => state.chartTheme);

export const useAnimationPreference = () => 
  useUserPreferences((state) => state.animationsEnabled);

export const useFavoriteViews = () => 
  useUserPreferences((state) => state.favoriteViews);

export const useAccessibilitySettings = () => 
  useUserPreferences((state) => ({
    highContrast: state.highContrast,
    reducedMotion: state.reducedMotion,
  }));

export const useSetupComplete = () =>
  useUserPreferences((state) => state.setupComplete);

export const useSetupSteps = () =>
  useUserPreferences((state) => state.setupSteps);

/**
 * Get chart theme colors based on current preference
 * This is the ONLY way chart components should access the preference store
 */
export const getChartColors = (theme: ChartTheme) => {
  const themes = {
    default: {
      primary: '#ff4c00',
      secondary: '#ffb400',
      tertiary: 'rgba(255, 76, 0, 0.6)',
      quaternary: 'rgba(255, 180, 0, 0.5)',
      danger: '#d4534d',
    },
    vibrant: {
      primary: '#ff6622',
      secondary: '#ffcc33',
      tertiary: '#ff8844',
      quaternary: '#ffdd66',
      danger: '#d4534d',
    },
    muted: {
      primary: 'rgba(255, 76, 0, 0.7)',
      secondary: 'rgba(255, 180, 0, 0.7)',
      tertiary: 'rgba(255, 76, 0, 0.4)',
      quaternary: 'rgba(255, 180, 0, 0.4)',
      danger: 'rgba(212, 83, 77, 0.7)',
    },
    monochrome: {
      primary: '#4a4a4a',
      secondary: '#7a7a7a',
      tertiary: '#9a9a9a',
      quaternary: '#bababa',
      danger: '#6a6a6a',
    },
  };
  
  return themes[theme];
};
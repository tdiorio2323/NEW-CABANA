/**
 * Demo Controls Store
 * Manages demo mode settings and persona switching
 */

import { create } from 'zustand';
import type { DemoSettings, DemoPersona } from '../../types';
import { DEMO_PERSONAS, DEMO_CREDENTIALS, seedDatabase } from '../mock/fixtures';
import { setApiConfig } from '../mock/api';
import { setSeed } from '../mock/factories';
import { useAuthStore } from './authStore';

interface DemoState extends DemoSettings {
  // State
  personas: Record<string, DemoPersona>;
  isOpen: boolean;

  // Actions
  togglePanel: () => void;
  switchPersona: (personaId: string) => Promise<void>;
  resetData: (newSeed?: number) => void;
  toggleNetworkDelay: () => void;
  setNetworkDelay: (ms: number) => void;
  toggleRandomErrors: () => void;
  setErrorRate: (rate: number) => void;
  toggleToasts: () => void;
  setSeed: (seed: number) => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  // Initial state
  currentPersona: null,
  enableNetworkDelay: true,
  networkDelayMs: 500,
  enableRandomErrors: false,
  errorRate: 0.1,
  enableToasts: true,
  seed: 42,
  personas: DEMO_PERSONAS,
  isOpen: false,

  togglePanel: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  switchPersona: async (personaId: string) => {
    const persona = get().personas[personaId];
    if (!persona) return;

    // Find credentials for this persona
    const credEntry = Object.values(DEMO_CREDENTIALS).find(
      (cred) => cred.persona.id === personaId
    );

    if (!credEntry) return;

    // Login as this persona
    const authStore = useAuthStore.getState();
    const success = await authStore.login({
      email: credEntry.email,
      password: credEntry.password,
    });

    if (success) {
      set({ currentPersona: personaId });
    }
  },

  resetData: (newSeed) => {
    const currentSeed = newSeed ?? get().seed;

    // Reset database with new seed
    setSeed(currentSeed);
    seedDatabase(currentSeed);

    // Update seed in store
    set({ seed: currentSeed });

    // Logout current user
    const authStore = useAuthStore.getState();
    authStore.logout();

    console.log(`[Demo] Data reset with seed: ${currentSeed}`);
  },

  toggleNetworkDelay: () => {
    set((state) => {
      const newValue = !state.enableNetworkDelay;
      setApiConfig({ enableNetworkDelay: newValue });
      return { enableNetworkDelay: newValue };
    });
  },

  setNetworkDelay: (ms: number) => {
    set({ networkDelayMs: ms });
    setApiConfig({ minDelayMs: ms / 2, maxDelayMs: ms });
  },

  toggleRandomErrors: () => {
    set((state) => {
      const newValue = !state.enableRandomErrors;
      setApiConfig({ enableRandomErrors: newValue });
      return { enableRandomErrors: newValue };
    });
  },

  setErrorRate: (rate: number) => {
    set({ errorRate: rate });
    setApiConfig({ errorRate: rate });
  },

  toggleToasts: () => {
    set((state) => ({ enableToasts: !state.enableToasts }));
  },

  setSeed: (seed: number) => {
    set({ seed });
    setSeed(seed);
  },
}));

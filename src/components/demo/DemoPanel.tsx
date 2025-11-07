/**
 * Demo Control Panel
 * Floating panel for controlling demo settings and switching personas
 */

import React, { useState } from 'react';
import { useDemoStore } from '../../lib/store/demoStore';
import { useAuthStore } from '../../lib/store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { toast } from '../shared/Toast';
import { DEMO_CREDENTIALS } from '../../lib/mock/fixtures';

export const DemoPanel: React.FC = () => {
  const {
    isOpen,
    togglePanel,
    currentPersona,
    personas,
    switchPersona,
    resetData,
    enableNetworkDelay,
    networkDelayMs,
    enableRandomErrors,
    errorRate,
    seed,
    toggleNetworkDelay,
    setNetworkDelay,
    toggleRandomErrors,
    setErrorRate,
    setSeed: setStoreSeed,
  } = useDemoStore();

  const { user } = useAuthStore();
  const [seedInput, setSeedInput] = useState(seed.toString());

  const handlePersonaSwitch = async (personaId: string) => {
    await switchPersona(personaId);
    toast.success(`Switched to ${personas[personaId].name}`);
  };

  const handleResetData = () => {
    const newSeed = parseInt(seedInput, 10);
    if (isNaN(newSeed)) {
      toast.error('Invalid seed number');
      return;
    }
    resetData(newSeed);
    toast.success(`Data reset with seed: ${newSeed}`);
  };

  const handleRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    setSeedInput(newSeed.toString());
    setStoreSeed(newSeed);
    resetData(newSeed);
    toast.success(`New random seed: ${newSeed}`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 z-50 bg-[var(--brand-gold)] text-black px-4 py-3 rounded-full shadow-lg hover:bg-[var(--brand-gold)]/90 transition-all font-medium flex items-center gap-2"
        aria-label="Open demo panel"
      >
        <span className="text-xl">🎮</span>
        <span className="hidden sm:inline">Demo Controls</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="bg-gray-900 border-2 border-[var(--brand-gold)]/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-red)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h3 className="font-bold text-black">Demo Controls</h3>
          </div>
          <button
            onClick={togglePanel}
            className="text-black hover:text-gray-700 transition-colors text-xl"
            aria-label="Close demo panel"
          >
            ×
          </button>
        </div>

        <div className="p-4 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Current User */}
          {user && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Current User</p>
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">{user.displayName}</p>
                  <p className="text-xs text-gray-400">
                    @{user.username} · {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Persona Switcher */}
          <div>
            <Label className="mb-3 block">Switch Persona</Label>
            <div className="space-y-2">
              {Object.values(personas).map((persona) => {
                const cred = Object.values(DEMO_CREDENTIALS).find(
                  (c) => c.persona.id === persona.id
                );
                const isActive = currentPersona === persona.id;

                return (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSwitch(persona.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      isActive
                        ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{persona.name}</p>
                        <p className="text-xs text-gray-400">{persona.description}</p>
                      </div>
                      {isActive && <span className="text-[var(--brand-gold)]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Controls */}
          <div>
            <Label className="mb-3 block">Data Controls</Label>
            <div className="space-y-3">
              {/* Seed */}
              <div>
                <Label htmlFor="seed" className="text-xs text-gray-400">
                  Random Seed
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="seed"
                    type="number"
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                    className="flex-1"
                    placeholder="42"
                  />
                  <Button variant="outline" size="sm" onClick={handleRandomSeed}>
                    🎲
                  </Button>
                </div>
              </div>

              {/* Reset Button */}
              <Button variant="outline" className="w-full" onClick={handleResetData}>
                🔄 Reset Database
              </Button>
            </div>
          </div>

          {/* Network Settings */}
          <div>
            <Label className="mb-3 block">Network Simulation</Label>
            <div className="space-y-3">
              {/* Network Delay Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="delay-toggle" className="text-sm cursor-pointer">
                  Simulate Network Delay
                </Label>
                <button
                  id="delay-toggle"
                  onClick={toggleNetworkDelay}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    enableNetworkDelay ? 'bg-[var(--brand-gold)]' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      enableNetworkDelay ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Delay Slider */}
              {enableNetworkDelay && (
                <div>
                  <Label htmlFor="delay-slider" className="text-xs text-gray-400">
                    Delay: {networkDelayMs}ms
                  </Label>
                  <input
                    id="delay-slider"
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={networkDelayMs}
                    onChange={(e) => setNetworkDelay(parseInt(e.target.value, 10))}
                    className="w-full mt-1"
                  />
                </div>
              )}

              {/* Random Errors Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="error-toggle" className="text-sm cursor-pointer">
                  Random Errors
                </Label>
                <button
                  id="error-toggle"
                  onClick={toggleRandomErrors}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    enableRandomErrors ? 'bg-[var(--brand-red)]' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      enableRandomErrors ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Error Rate Slider */}
              {enableRandomErrors && (
                <div>
                  <Label htmlFor="error-slider" className="text-xs text-gray-400">
                    Error Rate: {(errorRate * 100).toFixed(0)}%
                  </Label>
                  <input
                    id="error-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={errorRate}
                    onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-400">
              💡 <strong>Tip:</strong> Use this panel to switch between personas, control network
              behavior, and reset mock data for demos and testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

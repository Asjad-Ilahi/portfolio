"use client";

import React, { createContext, useState, useEffect } from 'react';

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: Date;
}

interface MissionContextType {
  collectedArtifacts: string[];
  collectArtifact: (section: string) => void;
  missionUnlocked: boolean;
  setMissionUnlocked: (value: boolean) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  missionAccepted: boolean;
  setMissionAccepted: (value: boolean) => void;
  terminalCode: string;
  setTerminalCode: (code: string) => void;
  vaultCodeEntered: boolean;
  setVaultCodeEntered: (value: boolean) => void;
  isMissionComplete: boolean;
  interactedCards: string[];
  interactCard: (cardId: string) => boolean;
  konamiActivated: boolean;
  setKonamiActivated: (value: boolean) => void;
  leaderboard: LeaderboardEntry[];
  addToLeaderboard: (name: string, score: number) => Promise<void>;
  vaultClosed: boolean;
  setVaultClosed: (value: boolean) => void;
}

export const MissionContext = createContext<MissionContextType>({} as MissionContextType);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collectedArtifacts, setCollectedArtifacts] = useState<string[]>([]);
  const [missionUnlocked, setMissionUnlocked] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [terminalCode, setTerminalCode] = useState('');
  const [vaultCodeEntered, setVaultCodeEntered] = useState(false);
  const [interactedCards, setInteractedCards] = useState<string[]>([]);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [vaultClosed, setVaultClosed] = useState(false);

  const collectArtifact = (section: string) => {
    if (!collectedArtifacts.includes(section)) {
      setCollectedArtifacts([...collectedArtifacts, section]);
    }
  };

  const interactCard = (cardId: string) => {
    if (!interactedCards.includes(cardId)) {
      setInteractedCards([...interactedCards, cardId]);
      return true; // Indicates points should be awarded
    }
    return false;
  };

  const addToLeaderboard = async (name: string, score: number) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      // Fetch updated leaderboard
      await fetchLeaderboard();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    // Fetch leaderboard on mount
    fetchLeaderboard();
  }, []);

  const isMissionComplete = collectedArtifacts.length === 5 && vaultCodeEntered;

  useEffect(() => {
    if (isMissionComplete && !missionUnlocked) {
      setMissionUnlocked(true);
    }
  }, [collectedArtifacts, vaultCodeEntered, missionUnlocked]);

  return (
    <MissionContext.Provider value={{
      collectedArtifacts,
      collectArtifact,
      missionUnlocked,
      setMissionUnlocked,
      playerName,
      setPlayerName,
      missionAccepted,
      setMissionAccepted,
      terminalCode,
      setTerminalCode,
      vaultCodeEntered,
      setVaultCodeEntered,
      isMissionComplete,
      interactedCards,
      interactCard,
      konamiActivated,
      setKonamiActivated,
      leaderboard,
      addToLeaderboard,
      vaultClosed,
      setVaultClosed
    }}>
      {children}
    </MissionContext.Provider>
  );
};

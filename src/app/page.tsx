"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { ChevronRight, Mail, Github, Linkedin, Twitter, Volume2, VolumeX, Star, Zap, Shield, Gamepad2, Trophy, Code, Database, Palette, Rocket, Coins, Book, PenTool, Scroll, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Create Context for Mission State
const MissionContext = createContext();

const MissionProvider = ({ children }) => {
  const [collectedArtifacts, setCollectedArtifacts] = useState([]);
  const [missionUnlocked, setMissionUnlocked] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [terminalCode, setTerminalCode] = useState('');
  const [vaultCodeEntered, setVaultCodeEntered] = useState(false);
  const [interactedCards, setInteractedCards] = useState([]);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [vaultClosed, setVaultClosed] = useState(false); // New state for vault closure

  const collectArtifact = (section) => {
    if (!collectedArtifacts.includes(section)) {
      setCollectedArtifacts([...collectedArtifacts, section]);
    }
  };

  const interactCard = (cardId) => {
    if (!interactedCards.includes(cardId)) {
      setInteractedCards([...interactedCards, cardId]);
      return true; // Indicates points should be awarded
    }
    return false;
  };

  const addToLeaderboard = (name, score) => {
    const newEntry = { name: name || 'Unknown Agent', score, timestamp: Date.now() };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10); // Top 10
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
  };

  const isMissionComplete = collectedArtifacts.length === 6 && vaultCodeEntered;

  useEffect(() => {
    if (isMissionComplete && !missionUnlocked) {
      setMissionUnlocked(true);
    }
  }, [collectedArtifacts, vaultCodeEntered, missionUnlocked]);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  return (
    <MissionContext.Provider value={{
      collectedArtifacts, collectArtifact, missionUnlocked, setMissionUnlocked,
      playerName, setPlayerName, missionAccepted, setMissionAccepted,
      terminalCode, setTerminalCode, vaultCodeEntered, setVaultCodeEntered, isMissionComplete,
      interactedCards, interactCard, konamiActivated, setKonamiActivated,
      leaderboard, addToLeaderboard, vaultClosed, setVaultClosed // Provide vaultClosed state
    }}>
      {children}
    </MissionContext.Provider>
  );
};

// Vault Opening Sequence Component
const VaultOpeningSequence = ({ onComplete }) => {
  const [phase, setPhase] = useState('cutscene');

  useEffect(() => {
    const phaseTimeout = setTimeout(() => {
      setPhase('vault');
    }, 2000);
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => {
      clearTimeout(phaseTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]"
    >
      {phase === 'cutscene' && (
        <motion.div
          className="relative h-64 flex items-center justify-center"
        >
          <motion.div
            initial={{ scaleX: 0.8, opacity: 0.7 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-br from-gray-700 to-gray-900 border-r-4 border-gray-500 shadow-xl"
            style={{ filter: 'blur(1px)' }}
          />
          <motion.div
            initial={{ scaleX: 0.8, opacity: 0.7 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-tl from-gray-700 to-gray-900 border-l-4 border-gray-500 shadow-xl"
            style={{ filter: 'blur(1px)' }}
          />
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -40, opacity: 0.7 }}
              animate={{ y: 60, opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.08, repeat: Infinity }}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
          <h3 className="text-3xl text-cyan-400 z-10 animate-pulse" style={{ letterSpacing: 2 }}>
            VAULT OPENING...
          </h3>
        </motion.div>
      )}
      {phase === 'vault' && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="space-y-4"
        >
          <h3 className="text-3xl text-cyan-400">VAULT UNLOCKING...</h3>
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <Coins className="w-16 h-16 text-white animate-spin" />
          </div>
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const RetroArcadePortfolioInner = () => {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const audioContextRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [showKonamiPopup, setShowKonamiPopup] = useState(false);
  const [showKonamiSuccess, setShowKonamiSuccess] = useState(false);
  const [visitedScreens, setVisitedScreens] = useState([]);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      setIsLoaded(true);
    }
  }, []);

  // Easter Egg: Konami Code
  const [konamiCode, setKonamiCode] = useState([]);
  const konamiSequence = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  const { konamiActivated, setKonamiActivated, interactCard } = useContext(MissionContext);

  useEffect(() => {
    const handleKonamiCode = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        const newSequence = [...konamiCode, e.code].slice(-konamiSequence.length);
        setKonamiCode(newSequence);
        
        if (JSON.stringify(newSequence) === JSON.stringify(konamiSequence) && !konamiActivated) {
          playSound(1500, 500, 'triangle');
          setShowKonamiPopup(true);
          setKonamiActivated(true);
          setScore(prev => prev + 1000);
          setShowKonamiSuccess(true);
          setTimeout(() => setShowKonamiSuccess(false), 3000);
          setKonamiCode([]);
        }
      }
    };

    window.addEventListener('keydown', handleKonamiCode);
    return () => window.removeEventListener('keydown', handleKonamiCode);
  }, [konamiCode, soundEnabled, konamiActivated]);

  // Play retro sound effect
  const playSound = (frequency = 440, duration = 200, type = 'square') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };

  // Award score for tab change only once
  const handleNavigation = (screen) => {
    playSound(800, 150);
    setCurrentScreen(screen);
    if (!visitedScreens.includes(screen)) {
      setScore(prev => prev + 100);
      setVisitedScreens(prev => [...prev, screen]);
    }
  };

  const handleProjectClick = (project) => {
    playSound(1200, 200, 'triangle');
    setSelectedProject(project);
    if (interactCard(`project-${project.id}`)) {
      setScore(prev => prev + 100);
    }
  };

  // --- Custom Projects Data ---
  // Grouped and tagged as requested
  const bossProjects = [
    {
      id: 7,
      title: "Wowcouple UI/UX",
      description: "Created UI/UX for Wowcouple in Figma.",
      tools: ["Figma"],
      stars: 5,
      level: "BOSS LEVEL",
      color: "from-fuchsia-500 to-pink-500",
      live: "https://www.linkedin.com/posts/asjad-ilahi_appdevelopment-flutter-wowcouple-activity-7229334246992097282-W7Ud?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFAOI3MBON5g8kSGeEx5508ftm7mdJnJjgA",
      code: null
    },
    {
      id: 2,
      title: "Petlove",
      description: "Flutter based single vendor ecommerce app deployed to Play Store and App Store. Firebase, web, PHP backend.",
      tools: ["Flutter", "Dart", "Firebase", "PHP Backend", "Web"],
      stars: 5,
      level: "BOSS LEVEL",
      color: "from-blue-500 to-cyan-500",
      live: "https://petlovekw.com",
      code: null
    },
    {
      id: 1,
      title: "Taabaawi",
      description: "A Flutter single vendor ecommerce app deployed to both app and play store. 3D views, payments, PHP backend.",
      tools: ["Flutter", "Dart", "Firebase", "PHP Backend", "3D Views", "Payment Gateways"],
      stars: 5,
      level: "BOSS LEVEL",
      color: "from-purple-500 to-pink-500",
      live: "https://play.google.com/store/apps/details?id=com.zfloos.ta3bwi&pcampaignid=web_share",
      code: null
    }
  ];
  const level4Projects = [
    {
      id: 3,
      title: "Wowcouple",
      description: "A Matrimonial app that leads to meaningful relationships. Deployed to Play Store.",
      tools: ["Flutter", "Dart", "Firebase", "Google Maps"],
      stars: 4,
      level: "LEVEL 4",
      color: "from-green-500 to-emerald-500",
      live: "https://play.google.com/store/apps/details?id=com.wowcouple_matrimony.app&pcampaignid=web_share",
      code: null
    },
    {
      id: 4,
      title: "Bank Learning App",
      description: "A banking app built in Next.js. Typescript and Tailwind.",
      tools: ["Next.js", "TypeScript", "TailwindCSS"],
      stars: 4,
      level: "LEVEL 4",
      color: "from-yellow-500 to-orange-500",
      live: "https://edubank.vercel.app",
      code: null
    }
  ];
  const level3Projects = [
    {
      id: 6,
      title: "Bank App UI/UX",
      description: "UI/UX for banking learning app. Built in Figma with plugins.",
      tools: ["Figma"],
      stars: 3,
      level: "LEVEL 3",
      color: "from-cyan-500 to-blue-500",
      live: "https://www.linkedin.com/posts/asjad-ilahi_uiux-fintechdesign-bankingapp-activity-7336846457607462912-ypYT?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFAOI3MBON5g8kSGeEx5508ftm7mdJnJjgA",
      code: null
    },
    {
      id: 5,
      title: "SunShineOnward",
      description: "A WordPress based taxi booking website built using custom plugins and WordPress.",
      tools: ["WordPress", "PHP", "Custom Plugin", "Maps API"],
      stars: 3,
      level: "LEVEL 3",
      color: "from-pink-500 to-yellow-500",
      live: "https://www.linkedin.com/posts/asjad-ilahi_webdevelopment-wordpress-php-activity-7215368579930574848-2U2w?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFAOI3MBON5g8kSGeEx5508ftm7mdJnJjgA",
      code: null
    },
    {
      id: 8,
      title: "Bluetooth Attendance App",
      description: "Bluetooth attendance through phone in class built in Flutter, Dart and Bluetooth package from pub.dev.",
      tools: ["Flutter", "Dart", "Bluetooth"],
      stars: 3,
      level: "LEVEL 3",
      color: "from-blue-500 to-indigo-500",
      live: null,
      code: "https://github.com/Asjad-Ilahi/Bluetooth_Attendence_App_In_Flutter"
    }
  ];
  // Shuffle within each group for variety
  function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const projects = [
    ...shuffle(bossProjects),
    ...shuffle(level4Projects),
    ...shuffle(level3Projects)
  ];

  // Sample data
  const skills = [
    { name: "Flutter", icon: <img src="https://img.icons8.com/?size=100&id=7I3BjCqe9rjG&format=png&color=000000" alt="Flutter" className="w-10 h-10" />, level: 92, color: "text-blue-400" },
    { name: "Next.js", icon: <img src="/next.svg" alt="Next.js" className="w-10 h-10" />, level: 90, color: "text-gray-400" },
    { name: "UI/UX", icon: <img src="/ui-ux.png" alt="UI/UX" className="w-10 h-10" />, level: 88, color: "text-pink-400" },
    { name: "MERN", icon: <img src="/logo.png" alt="MERN" className="w-10 h-10" />, level: 89, color: "text-green-400" },
  ];

  const experience = [
    {
      year: "2023-Present",
      role: "Mobile App Development | Freelance",
      company: "Developed 10+ cross-platform Android/iOS apps using Flutter, with 1K+ combined downloads. Collaborated with clients to deliver custom features such as real-time chat, in-app purchases, payment integration, location-based services and more.",
      stage: "FINAL BOSS"
    },
    {
      year: "2023-Present",
      role: "Web Development | Freelance",
      company: "Built 6+ full-stack web applications using MongoDB, Express, React, Node.js, and Next.js. Delivered feature-rich dashboards, admin panels, and landing pages tailored to client needs and business goals.",
      stage: "LEVEL 4"
    },
    {
      year: "2023-Present",
      role: "UI/UX Design | Freelance",
      company: "Designed 10+ UI/UX prototypes for mobile and web apps using Figma. Translated user requirements into intuitive interfaces and design systems for startups and small businesses.",
      stage: "LEVEL 3"
    },
    {
      year: "Aug 2022 - Present",
      role: "BACHELORS",
      company: "Bachelor of Science in Software Engineering. COMSATS UNIVERSITY ISLAMABAD",
      stage: "LEVEL 2"
    },
    {
      year: "Aug 2020 - June 2022",
      role: "INTERMEDIATE",
      company: "The Orbit Group of Schools and Colleges Swabi - Main Campus Tandkoi",
      stage: "LEVEL 1"
    }
  ];

  // Animated Background Component
  const AnimatedBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black opacity-80"></div>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        ></div>
      ))}
      {scanlines && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-repeat-y animate-pulse opacity-30"
             style={{ backgroundSize: '100% 4px' }}></div>
      )}
    </div>
  );

  // Mission Progress HUD Component
  const MissionProgressHUD = () => {
    const { collectedArtifacts, vaultCodeEntered } = useContext(MissionContext);
    return (collectedArtifacts.length > 0 || vaultCodeEntered) && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-10 right-10 bg-gray-900/80 border-4 border-yellow-500 p-4 z-[1000] pixel-font"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-yellow-500 animate-spin" />
            <span className="text-white">ARTIFACTS: {collectedArtifacts.length}/6</span>
          </div>
          <div className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-cyan-400" />
            <span className="text-white">CODE: {vaultCodeEntered ? 'DECRYPTED' : 'LOCKED'}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Hidden Artifact Component
  const HiddenArtifact = ({ section }) => {
    const { collectArtifact, collectedArtifacts } = useContext(MissionContext);
    const isCollected = collectedArtifacts.includes(section);

    const artifactIcons = {
      start: <Coins className="w-8 h-8 text-yellow-500 animate-pulse" />,
      about: <Book className="w-8 h-8 text-yellow-500 animate-pulse" />,
      projects: <PenTool className="w-8 h-8 text-yellow-500 animate-pulse" />,
      skills: <Scroll className="w-8 h-8 text-yellow-500 animate-pulse" />,
      contact: <Key className="w-8 h-8 text-yellow-500 animate-pulse" />,
      experience: <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
    };

    if (isCollected) return null;

    // For the start artifact, fix its position for pointer
    const artifactPosition =
      section === "start"
        ? { top: "80%", left: "18%" }
        : {
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          };

    return (
      <motion.div
        whileHover={{ scale: 1.2, rotate: 360 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => {
          playSound(1000, 200, 'triangle');
          collectArtifact(section);
          setScore(prev => prev + 1000);
        }}
        className="absolute cursor-pointer z-[1000]"
        style={artifactPosition}
      >
        {artifactIcons[section]}
      </motion.div>
    );
  };

  // Terminal Puzzle Component
  const TerminalPuzzle = ({ setShowTerminal }) => {
    const { terminalCode, setTerminalCode, setVaultCodeEntered } = useContext(MissionContext);
    const correctCode = 'APPLES';

    const handleSubmit = (e) => {
      e.preventDefault();
      if (terminalCode.toUpperCase() === correctCode) {
        playSound(1500, 300, 'triangle');
        setVaultCodeEntered(true);
        setScore(prev => prev + 2000);
        setShowTerminal(false);
      } else {
        playSound(300, 200, 'square');
        setTerminalCode('');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]"
      >
        <div className="bg-gray-900 border-4 border-green-500 p-6 max-w-md w-full relative pixel-font">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-cyan-500"></div>
          <button
            onClick={() => {
              playSound(400, 100);
              setShowTerminal(false);
            }}
            className="absolute top-2 right-2 text-red-400 hover:text-red-300 pixel-font"
          >
            CLOSE
          </button>
          <h3 className="text-2xl text-green-400 mb-4">DECRYPT ACCESS KEY</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">></span>
              <input
                type="text"
                value={terminalCode}
                onChange={(e) => setTerminalCode(e.target.value)}
                placeholder="ENTER CODE"
                className="w-full p-2 bg-black border-2 border-green-600 text-green-400 pixel-font outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-400 text-black font-bold pixel-font border-2 border-green-300 hover:border-green-200"
              onMouseEnter={() => playSound(900, 100)}
            >
              SUBMIT
            </button>
          </form>
          <p className="mt-4 text-gray-400 text-[10px]">Hint 1: Search for highlighted letters in headings across the site...</p>
          <p className="mt-1 text-gray-400 text-[10px]">Hint 2: The word is related to something we eat maybe a fruit?</p>
        </div>
      </motion.div>
    );
  };

  // Mission Vault Screen Component
  const MissionVaultScreen = () => {
    const {
      missionUnlocked, setMissionUnlocked, playerName, setPlayerName,
      isMissionComplete, addToLeaderboard, leaderboard,
      vaultClosed, setVaultClosed
    } = useContext(MissionContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showSequence, setShowSequence] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
      if (missionUnlocked && !vaultClosed) {
        playSound(2000, 1000, 'triangle');
        setIsOpen(true);
        setShowSequence(true);
      }
    }, [missionUnlocked, vaultClosed]);

    useEffect(() => {
      if (scoreSubmitted && playerName) {
        const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
        const idx = sorted.findIndex(entry => entry.name === playerName && entry.score === score);
        setUserRank(idx >= 0 ? idx + 1 : null);
      }
    }, [scoreSubmitted, leaderboard, playerName, score]);

    const handleSubmitScore = () => {
      setError('');
      if (!playerName.trim()) {
        setError('Please enter your agent name.');
        return;
      }
      addToLeaderboard(playerName.trim(), score);
      setScoreSubmitted(true);
    };

    const handleCloseVault = () => {
      playSound(400, 100);
      setIsOpen(false);
      setVaultClosed(true); // Mark vault as closed forever
    };

    if (!isOpen || vaultClosed) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]"
      >
        {showSequence ? (
          <VaultOpeningSequence onComplete={() => setShowSequence(false)} />
        ) : (
          <div className="bg-gray-900 border-4 border-cyan-500 p-8 max-w-md w-full text-center relative pixel-font overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            <div className="space-y-6">
              <h3 className="text-3xl text-yellow-400 animate-pulse">🎉 MISSION COMPLETE 🎉</h3>
              <p className="text-white">You've unlocked the secret vault!</p>
              <div className="text-2xl text-green-400">+5000 XP</div>
              <div className="text-cyan-400">Access granted to top-secret file...</div>
              <div className="text-lg text-yellow-300">Your Score: <span className="font-bold">{score.toLocaleString()}</span></div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Agent Name"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-gray-600 focus:border-yellow-400 text-white pixel-font outline-none"
                  disabled={scoreSubmitted}
                  required
                />
              
                {!scoreSubmitted ? (
                  <button
                    onClick={handleSubmitScore}
                    className="inline-block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold pixel-font border-2 border-blue-300 hover:border-blue-200 hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center space-x-2 justify-center">
                      <Trophy className="w-5 h-5" />
                      <span>SUBMIT YOUR SCORE</span>
                    </span>
                  </button>
                ) : (
                  <div className="text-green-400 font-bold">
                    Score submitted! {userRank && (
                      <span>Your leaderboard position: #{userRank}</span>
                    )}
                  </div>
                )}
                {error && <div className="text-red-400">{error}</div>}
              </div>
              <a
                  href="/Asjad Ilahi.pdf"
                  download="Asjad-Ilahi.pdf"
                  onClick={() => {
                    playSound(1200, 200);
                    setScore(prev => prev + 1000);
                  }}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold pixel-font border-2 border-purple-300 hover:border-purple-200 hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5" />
                    <span>DOWNLOAD RESUME</span>
                  </span>
                </a>
              <div className="mt-4">
                <p className="text-yellow-400">🏅 Secret Seeker: {playerName || 'Unknown Agent'}</p>
                <div className="flex justify-center space-x-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
              <button
                onClick={handleCloseVault}
                className="mt-4 text-red-400 hover:text-red-300 pixel-font"
              >
                CLOSE VAULT
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Konami Code Popup Component
  const KonamiPopup = () => {
    const { setMissionAccepted } = useContext(MissionContext);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]"
      >
        <div className="bg-gray-900 border-4 border-yellow-500 p-8 max-w-md w-full text-center relative pixel-font">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
          <h3 className="text-2xl text-yellow-400 mb-4">HIDDEN TRANSMISSION</h3>
          <p className="text-white mb-6">Do you accept the mission?</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                playSound(800, 200);
                setMissionAccepted(true);
                setShowKonamiPopup(false);
              }}
              className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-bold pixel-font border-2 border-green-300 hover:border-green-200"
            >
              YES
            </button>
            <button
              onClick={() => {
                playSound(400, 100);
                setShowKonamiPopup(false);
              }}
              className="px-6 py-2 bg-red-500 hover:bg-red-400 text-white font-bold pixel-font border-2 border-red-300 hover:border-red-200"
            >
              NO
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Konami Success Animation Component
  const KonamiSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]"
    >
      <div className="text-center relative">
        <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse pixel-font mb-4">
          CHEAT CODE CRACKED!
        </div>
        <div className="text-2xl text-cyan-400 pixel-font mb-4">
          SECRET UNLOCKED!
        </div>
        <div className="text-4xl text-yellow-400 pixel-font bg-black border-4 border-yellow-400 px-6 py-3 inline-block animate-bounce">
          +1000 BONUS POINTS!
        </div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 1 }}
            animate={{ y: 400, opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.1 }}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400"
            style={{
              left: `${Math.random() * 100 - 50}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  // Leaderboard Screen Component
  const LeaderboardScreen = () => {
    const { leaderboard } = useContext(MissionContext);

    return (
      <div className="min-h-screen pt-20 px-4 relative">
        <AnimatedBackground />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-lg lg:text-3xl sm:text-4xl font-bold text-cyan-400 pixel-font mb-4">RANKINGS</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="bg-gray-900/80 border-4 border-yellow-500 p-6">
            <h3 className="text-l lg:text-2xl text-yellow-400 pixel-font mb-6">TOP AGENTS</h3>
            {leaderboard.length === 0 ? (
              <p className="text-white pixel-font">No agents have cracked the vault yet!</p>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-800/50 border-2 border-gray-600"
                  >
                    <span className="text-white pixel-font text-[10px] lg:text-base mr-1">
                      {index + 1}. {entry.name}
                    </span>
                    <span className="text-yellow-400 pixel-font text-[8px] lg:text-base">{entry.score.toLocaleString()} PTS</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="block" style={{ height: 200 }} />
      </div>
    );
  };

  // Mission Briefing Popup Component
  const MissionBriefingPopup = ({ open, onClose }) => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gray-900/95 border-4 border-yellow-400 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md pixel-font shadow-2xl relative"
          >
            <button
              className="absolute top-2 right-3 text-yellow-400 hover:text-yellow-200 text-lg"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-[13px] sm:text-[15px] text-yellow-400 mb-2 pixel-font">MISSION BRIEFING</h3>
            <ul className="text-cyan-200 text-[11px] sm:text-xs space-y-2 list-decimal list-inside">
              <li>
                <span className="text-[11px] sm:text-[12px] text-white">Mission 1:</span> Collect all the <span className="text-[11px] sm:text-[12px] text-green-400">artifacts</span> scattered across each page.
              </li>
              <li>
                <span className="text-[11px] sm:text-[12px] text-white">Mission 2:</span> Find the <span className="text-[11px] sm:text-[12px] text-green-400">&lt;&gt;</span> sign in the portfolio. Click it and follow the instructions.
              </li>
            </ul>
            <div className="mt-3 text-gray-400 text-[10px] sm:text-[11px]">Complete all missions to unlock the secret vault!</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Start Screen Component
  const StartScreen = () => {
    const [showBriefing, setShowBriefing] = useState(false);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative px-2 sm:px-4">
        <AnimatedBackground />
        {/* Artifact for start page */}
        <HiddenArtifact section="start" />
        {/* Pointer and hint for the first artifact */}
        <div
          className="absolute z-[1100] flex flex-col items-center"
          style={{
            top: "79%",
            left: "19%",
            transform: "translate(-50%, -100%)",
            pointerEvents: "none"
          }}
        >
          <div className="py-1 mb-1 text-xs pixel-font text-yellow-100 whitespace-nowrap">
            Collect!
          </div>
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: [ -10, 0, -10 ] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-yellow-300"
            style={{ fontSize: 32, lineHeight: 1 }}
          >
            ↓
          </motion.div>
        </div>
        {/* Floating Question Mark Button */}
        <button
          className="fixed bottom-4 right-4 z-30 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-yellow-600 animate-bounce"
          aria-label="Show Mission Briefing"
          onClick={() => setShowBriefing(true)}
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 22, lineHeight: 1 }}
        >
          ?
        </button>
    
        {/* Mission Briefing Popup */}
        <MissionBriefingPopup open={showBriefing} onClose={() => setShowBriefing(false)} />
        <div className="text-center z-10 space-y-8 w-full max-w-auto mx-auto">
          <div className="flex flex-wrap items-center text-center justify-center w-full">
            <h2 className="text-3xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pixel-font">
              ASJAD.IL
              <span className="text-3xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-green-600 pixel-font animate-pulse">
                A
              </span>
              HI
            </h2>
          </div>
        
          <div className="space-y-4">
            <p className="text-cyan-300 text-xs xs:text-sm sm:text-base md:text-xl pixel-font">SOFTWARE DEVELOPER PORTFOLIO</p>
            <div className="flex justify-center items-center space-x-1 xs:space-x-2 sm:space-x-4 text-yellow-400">
              <span className="pixel-font text-xs xs:text-sm sm:text-base">{`SCORE: ${score.toLocaleString()}`}</span>
              <span className="pixel-font text-xs xs:text-sm sm:text-base">LIVES: ∞</span>
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => handleNavigation('about')}
              onMouseEnter={() => playSound(600, 100)}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold text-lg sm:text-xl pixel-font hover:from-green-400 hover:to-emerald-400 transition-all duration-300 border-4 border-green-300 hover:border-green-200 transform hover:scale-105 hover:rotate-1"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="animate-pulse">PRESS START</span>
              </span>
              <div className="absolute inset-0 bg-white/20 animate-ping opacity-0 group-hover:opacity-100"></div>
            </button>

            <div className="flex justify-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                onMouseEnter={() => playSound(400, 100)}
                className="p-2 sm:p-3 bg-gray-800 border-2 border-gray-600 hover:border-yellow-400 transition-colors pixel-font text-white hover:bg-gray-700"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={() => setScanlines(!scanlines)}
                onMouseEnter={() => playSound(400, 100)}
                className="p-2 sm:p-3 bg-gray-800 border-2 border-gray-600 hover:border-yellow-400 transition-colors pixel-font text-white hover:bg-gray-700"
              >
                CRT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
      { id: 'about', label: 'PLAYER' },
      { id: 'projects', label: 'LEVELS' },
      { id: 'skills', label: 'ITEMS' },
      { id: 'experience', label: 'MAP' },
      { id: 'contact', label: 'PORTAL' },
      { id: 'leaderboard', label: 'RANKINGS' }
    ];

    return (
      <nav className="fixed top-0 left-0 right-0 z-[999] bg-black/80 backdrop-blur-sm border-b-2 border-cyan-500">
        <div className="container mx-auto px-2 md:px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="md:hidden text-cyan-400 focus:outline-none"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Open navigation"
              >
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
                  <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
                  <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
                </svg>
              </button>
              <div
                onClick={() => {
                  setMobileOpen(false);
                  handleNavigation('start');
                }}
                className="hidden md:block cursor-pointer text-cyan-400 font-bold pixel-font hover:text-cyan-300 transition-colors text-base xs:text-lg md:text-xl"
              >
                ASJAD
              </div>
            </div>
            <div className="hidden md:flex space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  onMouseEnter={() => playSound(500, 50)}
                  className={`pixel-font transition-colors hover:text-yellow-400 ${
                    currentScreen === item.id ? 'text-yellow-400' : 'text-white'
                  } text-base lg:text-lg`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="text-yellow-400 pixel-font text-xs xs:text-sm md:text-base">
              SCORE: {score.toLocaleString()}
            </div>
          </div>
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="md:hidden absolute left-0 right-0 top-full bg-black/95 border-b-2 border-cyan-500 shadow-lg"
              >
                <div className="flex flex-col py-2 px-4 space-y-2">
                  {/* Add ASJAD clickable text for mobile */}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleNavigation('start');
                    }}
                    className="pixel-font py-2 w-full text-left transition-colors rounded text-cyan-400 font-bold text-base xs:text-lg md:text-xl hover:text-cyan-300"
                  >
                    ASJAD
                  </button>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileOpen(false);
                        handleNavigation(item.id);
                      }}
                      className={`pixel-font py-2 w-full text-left transition-colors rounded hover:bg-cyan-900/40 ${
                        currentScreen === item.id ? 'text-yellow-400' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    );
  };

  // About Screen Component
  const AboutScreen = () => {
    const [showTerminal, setShowTerminal] = useState(false);

    return (
      <div className="min-h-screen pt-20 px-2 xs:px-3 sm:px-4 relative">
        <AnimatedBackground />
        <HiddenArtifact section="about" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center text-center justify-center gap-1">
            <h2 className="text-xl sm:text-lg lg:text-4xl font-bold text-cyan-400 pixel-font mb-4">
              PLAY
            </h2>
            <span className="text-xl sm:text-lg lg:text-4xl font-bold text-green-600 pixel-font animate-pulse mb-4">
              E
            </span>
            <h2 className="text-xl sm:text-lg lg:text-4xl font-bold text-cyan-400 pixel-font mb-4">
              R.PROFILE
            </h2>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-4"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/80 border-4 border-cyan-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              
              <div className="text-center mb-6">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 border-4 border-white mb-4 relative overflow-hidden flex items-center justify-center">
                  <img
                    src="/profile.png"
                    alt="Asjad Ilahi profile"
                    className="w-full h-full object-cover rounded"
                    style={{ minHeight: '100%', minWidth: '100%' }}
                  />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-white pixel-font">ASJAD ILAHI</h3>
                <p className="text-cyan-300 pixel-font text-sm lg:text-xl">SOFTWARE WARRIOR</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white pixel-font text-sm lg:text-xl">EXPERIENCE</span>
                  <span className="text-yellow-400 pixel-font text-sm lg:text-xl">2+YEARS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white pixel-font text-sm lg:text-xl">LEVEL</span>
                  <span className="text-green-400 pixel-font text-sm lg:text-xl">MEDIUM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white pixel-font text-sm lg:text-xl">POWER</span>
                  <span className="text-red-400 pixel-font text-sm lg:text-xl">MAXIMUM</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  playSound(1000, 200);
                  setShowTerminal(true);
                }}
                className="absolute bottom-4 right-4 cursor-pointer"
              >
                <Code className="w-8 h-8 text-green-400 animate-pulse" />
              </motion.div>
            </div>

            <div className="bg-gray-900/80 border-4 border-purple-500 p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              <h3 className="text-sm lg:text-xl font-bold text-purple-400 pixel-font mb-4">MISSION BRIEFING</h3>
              
              <div className="space-y-4 text-white">
                <p className="leading-relaxed">
                  2+ years of freelancing experience. Fluent in Next.js, MERN, and Flutter. Also a UI/UX designer.
                </p>
                <p className="leading-relaxed">
                  Always exploring new tech, building creative solutions, and delivering quality results.
                </p>
                <div className="pt-4">
                  <h4 className="text-sm lg:text-xl text-cyan-400 pixel-font mb-2">SPECIAL ABILITIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Communication skill', 'Leadership', 'Problem solving', 'Creative thinking'].map((ability) => (
                      <span key={ability} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 text-cyan-300 text-sm pixel-font">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTerminal && <TerminalPuzzle setShowTerminal={setShowTerminal} />}
        <div className="block" style={{ height: 200 }} />
      </div>
    );
  };

  // Projects Screen Component
  const ProjectsScreen = () => (
    <div className="min-h-screen pt-20 px-4 relative">
      <AnimatedBackground />
      <HiddenArtifact section="projects" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-wrap items-center text-center justify-center gap-1">
          <h2 className="text-xl sm:text-lg lg:text-4xl font-bold text-cyan-400 pixel-font mb-4">
            LEV
          </h2>
          <span className="text-xl sm:text-lg lg:text-4xl font-bold text-green-600 pixel-font animate-pulse mb-4">
            L
          </span>
          <h2 className="text-xl sm:text-lg lg:text-4xl font-bold text-cyan-400 pixel-font mb-4">
            LS
          </h2>
        </div>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-4"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              onMouseEnter={() => playSound(700, 1)}
              className="group cursor-pointer relative bg-gray-900/80 border-4 border-gray-600 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${project.color}`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs pixel-font">
                    {project.level}
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(project.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white pixel-font mb-2 group-hover:text-yellow-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="px-2 py-1 bg-blue-500/20 border border-blue-500 text-blue-300 text-xs pixel-font">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-green-400 pixel-font text-sm">CLICK TO PLAY</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </div>
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur animate-pulse transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000] p-4">
          <div className="bg-gray-900 border-4 border-cyan-500 max-w-2xl w-full relative">
            <div className={`h-2 bg-gradient-to-r ${selectedProject.color}`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white pixel-font">{selectedProject.title}</h3>
                <button
                  onClick={() => {
                    playSound(400, 100);
                    setSelectedProject(null);
                  }}
                  className="text-red-500 hover:text-red-400 pixel-font"
                >
                  CLOSE
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                
                <div>
                  <h4 className="text-cyan-400 pixel-font mb-2">TECHNOLOGIES USED</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools.map((tool) => (
                      <span key={tool} className="px-3 py-1 bg-blue-500/20 border border-blue-500 text-blue-300 pixel-font">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSound(800, 200)}
                      className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-bold pixel-font transition-colors"
                    >
                      VIEW LIVE
                    </a>
                  )}
                  {selectedProject.code && (
                    <a
                      href={selectedProject.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSound(800, 200)}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold pixel-font transition-colors"
                    >
                      VIEW CODE
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="block" style={{ height: 200 }} />
    </div>
  );

  // Skills Screen Component
  const SkillsScreen = () => (
    <div className="min-h-screen pt-20 px-4 relative">
      <AnimatedBackground />
      <HiddenArtifact section="skills" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-xl lg:text-4xl sm:text-4xl font-bold text-cyan-400 pixel-font mb-4">
            POWER-UPS &amp; ITEM
            <span className="text-xl lg:text-4xl sm:text-4xl font-bold text-green-600 pixel-font animate-pulse">
              S
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              onMouseEnter={() => playSound(600 + index * 100)}
              className="group bg-gray-900/80 border-4 border-gray-600 hover:border-yellow-400 p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-1 bg-gray-600 border-2 border-gray-600 group-hover:border-yellow-400 ${skill.color} transition-colors`}>
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white pixel-font group-hover:text-yellow-400 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-gray-400 pixel-font">LEVEL {skill.level}</p>
                </div>
              </div>

              <div className="relative">
                <div className="h-4 bg-gray-700 border-2 border-gray-600">
                  <div 
                    className={`h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <div className="absolute top-1 left-1 right-1 h-2 bg-gradient-to-r from-white/30 to-transparent"></div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-yellow-400 pixel-font text-sm">{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-purple-400 pixel-font mb-6 text-center">INVENTORY</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Flutter', img: 'https://img.icons8.com/?size=100&id=7I3BjCqe9rjG&format=png&color=000000' },
              { name: 'Dart', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
              { name: 'Unity', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' },
              { name: 'Firebase', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
              { name: 'PHP', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
              { name: 'HTML5', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
              { name: 'CSS3', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
              { name: 'JavaScript', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
              { name: 'TypeScript', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
              { name: 'React', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
              { name: 'Vue.js', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
              { name: 'Node.js', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
              { name: 'MongoDB', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
              { name: 'Git', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
              { name: 'Figma', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
              { name: 'Tailwind', img: 'https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000' },
            ].map((item, index) => (
              <div
                key={item.name}
                onMouseEnter={() => playSound(800 + index * 50, 100)}
                className="group bg-gray-800/80 border-2 border-gray-600 hover:border-blue-400 p-4 text-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 cursor-pointer overflow-hidden text-ellipsis"
              >
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                  <img src={item.img} alt={item.name} className="w-8 h-8 object-contain" />
                </div>
                <span className="text-white pixel-font text-xs group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="block" style={{ height: 200 }} />
    </div>
  );

  // Experience Screen Component
  const ExperienceScreen = () => {
    const { interactCard } = useContext(MissionContext);

    const handleTimelineClick = (index) => {
      if (interactCard(`experience-${index}`)) {
        setScore(prev => prev + 100);
      }
    };

    return (
      <div className="min-h-screen pt-20 px-4 relative">
        <AnimatedBackground />
        {/* Add artifact for experience/world map section */}
        <HiddenArtifact section="experience" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-xl lg:text-4xl sm:text-4xl font-bold text-cyan-400 pixel-font mb-4">
              WORLD MA
              <span className="text-xl lg:text-4xl sm:text-4xl font-bold text-green-600 pixel-font animate-pulse">
                P
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-yellow-400 to-red-400"></div>

            {experience.map((exp, index) => (
              <div
                key={index}
                onClick={() => handleTimelineClick(index)}
                onMouseEnter={() => playSound(500 + index * 200, 200)}
                className="group relative flex items-center mb-12 cursor-pointer"
              >
                <div className="relative z-10 w-16 h-16 bg-gray-900 border-4 border-yellow-400 group-hover:border-green-400 flex items-center justify-center mr-8 transition-all duration-300 transform group-hover:scale-110">
                  <Trophy className="w-8 h-8 text-yellow-400 group-hover:text-green-400 transition-colors" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs pixel-font">{index + 1}</span>
                  </div>
                </div>

                <div className="flex-1 bg-gray-900/80 border-4 border-gray-600 group-hover:border-cyan-400 p-6 transition-all duration-300 transform group-hover:translate-x-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="p-1 bg-blue-500 text-white pixel-font text-[8px] xs:text-sm mr-3">
                      {exp.stage}
                    </span>
                    <span className="text-yellow-400 pixel-font text-[8px] xs:text-sm sm:text-base">{exp.year}</span>
                  </div>

                  <h3 className="text-sm xs:text-lg sm:text-xl font-bold text-purple-500 pixel-font mb-1 group-hover:text-cyan-400 transition-colors">
                    {exp.role}
                  </h3>
                  <p className="text-gray-300 text-xs xs:text-sm sm:text-base hidden sm:block">{exp.company}</p>

                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="block" style={{ height: 200 }} />
      </div>
    );
  };

  // Contact Screen Component
  const ContactScreen = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      playSound(1000, 300, 'triangle');
      
      setTimeout(() => {
        setShowSuccess(true);
        setScore(prev => prev + 500);
        setIsSubmitting(false);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1500);
    };

    return (
      <div className="min-h-screen pt-20 px-4 relative">
        <AnimatedBackground />
        <HiddenArtifact section="contact" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-xl lg:text-4xl font-bold text-cyan-400 pixel-font mb-4">
              <span className="text-xl lg:text-4xl font-bold text-green-600 pixel-font animate-pulse ml-3">
                P
              </span>
              ORTAL
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/80 border-4 border-cyan-500 p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              
              <h3 className="text-xl font-bold text-cyan-400 pixel-font mb-6">SEND MESSAGE</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white pixel-font mb-2">PLAYER NAME</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-gray-800 border-2 border-gray-600 focus:border-yellow-400 text-white pixel-font outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white pixel-font mb-2">EMAIL</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 bg-gray-800 border-2 border-gray-600 focus:border-yellow-400 text-white pixel-font outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white pixel-font mb-2">MESSAGE</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-3 bg-gray-800 border-2 border-gray-600 focus:border-yellow-400 text-white pixel-font outline-none transition-colors h-32 resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => playSound(900, 150)}
                  className={`w-full py-3 font-bold pixel-font transition-all duration-300 transform border-2 ${
                    isSubmitting 
                      ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black hover:scale-105 border-green-300 hover:border-green-200'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>TRANSMITTING...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span>SEND TRANSMISSION</span>
                      </>
                    )}
                                   </span>
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/80 border-4 border-purple-500 p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                
                <h3 className="text-xl font-bold text-purple-400 pixel-font mb-6">DIRECT CHANNELS</h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gray-800/50 border-2 border-gray-600 hover:border-cyan-400 transition-colors cursor-pointer group">
                    <Mail className="w-6 h-6 text-cyan-400 group-hover:animate-bounce" />
                    <div>
                      <p className="text-white pixel-font">EMAIL</p>
                      <p className="text-gray-300 text-sm">alex@developer.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-gray-800/50 border-2 border-gray-600 hover:border-cyan-400 transition-colors cursor-pointer group">
                    <Github className="w-6 h-6 text-cyan-400 group-hover:animate-bounce" />
                    <div>
                      <p className="text-white pixel-font">GITHUB</p>
                      <p className="text-gray-300 text-sm">github.com/alexdev</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-gray-800/50 border-2 border-gray-600 hover:border-cyan-400 transition-colors cursor-pointer group">
                    <Linkedin className="w-6 h-6 text-cyan-400 group-hover:animate-bounce" />
                    <div>
                      <p className="text-white pixel-font">LINKEDIN</p>
                      <p className="text-gray-300 text-sm">linkedin.com/in/alexdev</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-gray-800/50 border-2 border-gray-600 hover:border-cyan-400 transition-colors cursor-pointer group">
                    <Twitter className="w-6 h-6 text-cyan-400 group-hover:animate-bounce" />
                    <div>
                      <p className="text-white pixel-font">TWITTER</p>
                      <p className="text-gray-300 text-sm">@alexdev</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/80 border-4 border-yellow-500 p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                
                <h3 className="text-xl font-bold text-yellow-400 pixel-font mb-4">CURRENT STATUS</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 pixel-font">ONLINE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 pixel-font">AVAILABLE FOR HIRE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 pixel-font">RESPONSE TIME: 24H</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000]">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-green-600 p-8 text-center animate-bounce shadow-xl">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-black pixel-font mb-2">MISSION COMPLETE!</h3>
                <p className="text-black pixel-font mb-2">Message sent successfully!</p>
                <div className="text-xl text-black pixel-font bg-gray-800 px-4 py-2 inline-block border-2 border-yellow-600">
                  +500 POINTS EARNED!
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-600 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
            <div className="bg-gray-900 border-4 border-cyan-400 p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-cyan-400 pixel-font">ESTABLISHING CONNECTION...</p>
              <div className="mt-2 flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="block" style={{ height: 200 }} />
      </div>
    );
  };

  // Main Render
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl pixel-font animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <MissionProvider>
      <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          
          .pixel-font {
            font-family: 'Press Start 2P', monospace;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
          }
          
          @keyframes pixelate {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          .animate-pixelate {
            animation: pixelate 2s infinite;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #1a1a1a;
            border: 1px solid #333;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #00bcd4, #9c27b0);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #00acc1, #8e24aa);
          }
          
          body {
            animation: flicker 0.15s infinite linear alternate;
            background: #000;
            margin: 0;
            padding: 0;
          }
          
          @keyframes flicker {
            0% { opacity: 1; }
            98% { opacity: 1; }
            99% { opacity: 0.98; }
            100% { opacity: 1; }
          }
          
          .keyboard-hint {
            position: fixed;
            bottom: 20px;
                       left: 20px;
            background: rgba(0,0,0,0.8);
            border: 2px solid #00bcd4;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            color: #00bcd4;
            z-index: 1000;
          }
        `}</style>

        {currentScreen !== 'start' && <Navigation />}
        
        {currentScreen === 'start' && <StartScreen />}
        {currentScreen === 'about' && <AboutScreen />}
        {currentScreen === 'projects' && <ProjectsScreen />}
        {currentScreen === 'skills' && <SkillsScreen />}
        {currentScreen === 'experience' && <ExperienceScreen />}
        {currentScreen === 'contact' && <ContactScreen />}
        {currentScreen === 'leaderboard' && <LeaderboardScreen />}

        <MissionProgressHUD />
        <MissionVaultScreen />
        {showKonamiPopup && <KonamiPopup />}
        <AnimatePresence>
          {showKonamiSuccess && <KonamiSuccess />}
        </AnimatePresence>
      </div>
    </MissionProvider>
  );
};

const RetroArcadePortfolio = () => {
  return (
    <MissionProvider>
      <RetroArcadePortfolioInner />
    </MissionProvider>
  );
};

export default RetroArcadePortfolio;
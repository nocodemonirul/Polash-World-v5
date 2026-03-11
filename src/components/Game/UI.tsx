import React from 'react';
import { useGameStore } from '../../game/store';
import { Color, Space, Radius, Type } from '../../styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Instagram, 
  Linkedin, 
  Facebook, 
  MessageSquare, 
  ExternalLink,
  Twitter
} from 'lucide-react';

const SocialIcon = ({ name, size = 20 }: { name: string, size?: number }) => {
  const n = name.toLowerCase();
  if (n === 'x' || n === 'twitter') return <Twitter size={size} />;
  if (n === 'instagram') return <Instagram size={size} />;
  if (n === 'linkedin') return <Linkedin size={size} />;
  if (n === 'facebook') return <Facebook size={size} />;
  if (n === 'reddit') return <MessageSquare size={size} />;
  return <ExternalLink size={size} />;
};

export const UI: React.FC = () => {
  const hint = useGameStore((state) => state.hint);
  const activePOI = useGameStore((state) => state.activePOI);
  const setActivePOI = useGameStore((state) => state.setActivePOI);
  const viewMode = useGameStore((state) => state.viewMode);
  const setViewMode = useGameStore((state) => state.setViewMode);
  const health = useGameStore((state) => state.health);
  const fuel = useGameStore((state) => state.fuel);
  const isDayNightCycleActive = useGameStore((state) => state.isDayNightCycleActive);
  const setDayNightCycleActive = useGameStore((state) => state.setDayNightCycleActive);
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const setTimeOfDay = useGameStore((state) => state.setTimeOfDay);
  const setFiringFromUI = useGameStore((state) => state.setFiringFromUI);
  const isFiringFromUI = useGameStore((state) => state.isFiringFromUI);
  const isFlying = useGameStore((state) => state.isFlying);
  const toggleFlying = useGameStore((state) => state.toggleFlying);
  const ammo = useGameStore((state) => state.ammo);
  const maxAmmo = useGameStore((state) => state.maxAmmo);
  const isReloading = useGameStore((state) => state.isReloading);
  const setCameraCommand = useGameStore((state) => state.setCameraCommand);
  const isRotationLocked = useGameStore((state) => state.isRotationLocked);
  const setRotationLocked = useGameStore((state) => state.setRotationLocked);
  const isFollowingPlayer = useGameStore((state) => state.isFollowingPlayer);
  const setFollowingPlayer = useGameStore((state) => state.setFollowingPlayer);

  return (
    <>
      {/* HUD: Health & Fuel */}
      <div style={{
        position: 'absolute',
        top: Space.L,
        left: Space.L,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: Space.S,
      }}>
        {/* Health Bar */}
        <div style={{
          width: '200px',
          height: '20px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: Radius.M,
          overflow: 'hidden',
          border: `1px solid ${Color.Base.Content[3]}`
        }}>
          <div style={{
            width: `${health}%`,
            height: '100%',
            backgroundColor: Color.Error.Surface[1],
            transition: 'width 0.2s ease-out'
          }} />
          <span style={{
            position: 'absolute',
            left: Space.S,
            top: '2px',
            fontSize: '10px',
            color: 'white',
            fontWeight: 'bold',
            textShadow: '0 1px 2px black'
          }}>HEALTH</span>
        </div>

        {/* Ammo Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: Space.S,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: `${Space.XS}px ${Space.M}px`,
          borderRadius: Radius.M,
          border: `1px solid ${Color.Base.Content[3]}`,
          color: 'white',
          ...Type.Readable.Label.M
        }}>
          <span style={{ fontSize: '16px' }}>🔫</span>
          <span>{ammo} / {maxAmmo}</span>
          {isReloading && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ color: Color.Accent.Surface[1], marginLeft: Space.S, fontSize: '10px' }}
            >
              RELOADING...
            </motion.span>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: Space.L,
        right: Space.L,
        zIndex: 50,
      }}>
        <button
          onClick={() => {
            const modes: ('side' | 'eyes' | 'free')[] = ['side', 'eyes', 'free'];
            const currentIndex = modes.indexOf(viewMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            setViewMode(modes[nextIndex]);
          }}
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: Color.Base.Content[1],
            border: 'none',
            borderRadius: Radius.M,
            padding: `${Space.S}px ${Space.M}px`,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            ...Type.Readable.Label.S
          }}
        >
          {viewMode === 'side' ? 'Side View (M)' : viewMode === 'eyes' ? 'Eyes View (M)' : 'Free Cam (M)'}
        </button>
        <div style={{ marginTop: Space.S, display: 'flex', flexDirection: 'column', gap: Space.S }}>
          <button
            onClick={() => setDayNightCycleActive(!isDayNightCycleActive)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: Color.Base.Content[1],
              border: 'none',
              borderRadius: Radius.M,
              padding: `${Space.S}px ${Space.M}px`,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              ...Type.Readable.Label.S
            }}
          >
            {isDayNightCycleActive ? 'Pause Cycle' : 'Resume Cycle'}
          </button>
          <button
            onClick={() => {
              // Toggle between Noon (12) and Midnight (0)
              // If it's roughly day (6-18), switch to night (0). Else switch to day (12).
              const isDay = timeOfDay > 6 && timeOfDay < 18;
              setTimeOfDay(isDay ? 0 : 12);
            }}
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: Color.Base.Content[1],
              border: 'none',
              borderRadius: Radius.M,
              padding: `${Space.S}px ${Space.M}px`,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              ...Type.Readable.Label.S
            }}
          >
            Toggle Day/Night
          </button>
          
          {viewMode === 'free' && (
            <div style={{ 
              marginTop: Space.S, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: Space.XS,
              backgroundColor: 'rgba(0,0,0,0.4)',
              padding: Space.S,
              borderRadius: Radius.M,
              backdropFilter: 'blur(4px)',
              width: '180px'
            }}>
              <span style={{ color: Color.Base.Content[2], fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>QUICK VIEWS</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Space.XS }}>
                {['top', 'bottom', 'front', 'back', 'left', 'right'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setCameraCommand(cmd as any)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: Color.Base.Content[1],
                      border: 'none',
                      borderRadius: Radius.S,
                      padding: `${Space.XS}px`,
                      cursor: 'pointer',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCameraCommand('reset')}
                style={{
                  marginTop: Space.XS,
                  backgroundColor: Color.Accent.Surface[1],
                  color: Color.Accent.Content[1],
                  border: 'none',
                  borderRadius: Radius.S,
                  padding: `${Space.XS}px`,
                  cursor: 'pointer',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                Reset View
              </button>
              <button
                onClick={() => setRotationLocked(!isRotationLocked)}
                style={{
                  marginTop: Space.XS,
                  backgroundColor: isRotationLocked ? Color.Error.Surface[1] : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: Radius.S,
                  padding: `${Space.XS}px`,
                  cursor: 'pointer',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
              >
                {isRotationLocked ? '🔓 Unlock Rotation' : '🔒 Lock Rotation'}
              </button>
              {!isFollowingPlayer && (
                <button
                  onClick={() => setFollowingPlayer(true)}
                  style={{
                    marginTop: Space.XS,
                    backgroundColor: Color.Success.Surface[1],
                    color: 'white',
                    border: 'none',
                    borderRadius: Radius.S,
                    padding: `${Space.XS}px`,
                    cursor: 'pointer',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🎯 Follow Player
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activePOI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                backgroundColor: Color.Base.Surface[2],
                padding: Space.XL,
                borderRadius: Radius.L,
                maxWidth: '500px',
                width: '90%',
                color: Color.Base.Content[1],
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
            >
              <h2 style={{ ...Type.Expressive.Headline.L, marginBottom: Space.M }}>
                {activePOI.data.title}
              </h2>
              <p style={{ ...Type.Readable.Body.M, marginBottom: Space.L, color: Color.Base.Content[2] }}>
                {activePOI.data.description || "No description available."}
              </p>

              {activePOI.data.socialLinks && (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: Space.M, 
                  marginBottom: Space.L,
                }}>
                  {activePOI.data.socialLinks.map((link: any, i: number) => (
                    <motion.div
                      key={i}
                      initial="initial"
                      whileHover="hover"
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: Space.L,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: Radius.L,
                        border: '1px solid rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        height: '100px'
                      }}
                    >
                      {/* Icon and Name */}
                      <motion.div
                        variants={{
                          initial: { y: 0, opacity: 1 },
                          hover: { y: -15, opacity: 0.5 }
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: Space.S
                        }}
                      >
                        <div style={{ color: Color.Accent.Surface[1] }}>
                          <SocialIcon name={link.name} size={32} />
                        </div>
                        <span style={{ ...Type.Readable.Label.S, color: Color.Base.Content[1] }}>
                          {link.name}
                        </span>
                      </motion.div>

                      {/* Hover Button */}
                      <motion.a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={{
                          initial: { y: 40, opacity: 0 },
                          hover: { y: 0, opacity: 1 }
                        }}
                        style={{
                          position: 'absolute',
                          bottom: Space.M,
                          padding: `${Space.XS}px ${Space.L}px`,
                          backgroundColor: Color.Accent.Surface[1],
                          color: Color.Accent.Content[1],
                          borderRadius: Radius.Full,
                          textDecoration: 'none',
                          ...Type.Readable.Label.S,
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                      >
                        OPEN
                      </motion.a>
                    </motion.div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: Space.M, justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setActivePOI(null)}
                  style={{
                    padding: `${Space.S}px ${Space.M}px`,
                    backgroundColor: 'transparent',
                    border: `1px solid ${Color.Base.Content[3]}`,
                    color: Color.Base.Content[1],
                    borderRadius: Radius.M,
                    cursor: 'pointer',
                    ...Type.Readable.Label.S
                  }}
                >
                  Close
                </button>
                <a 
                  href={activePOI.data.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    padding: `${Space.S}px ${Space.M}px`,
                    backgroundColor: Color.Accent.Surface[1],
                    color: Color.Accent.Content[1],
                    borderRadius: Radius.M,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    ...Type.Readable.Label.S
                  }}
                >
                  Open Link
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        position: 'absolute',
        bottom: Space.L,
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 50,
      }}>
        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: `${Space.S}px ${Space.M}px`,
                borderRadius: Radius.Full,
                color: Color.Base.Content[1],
                backdropFilter: 'blur(4px)',
                ...Type.Readable.Label.S
              }}
            >
              {hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls: Fly & Fire */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        right: '25px',
        display: 'flex',
        flexDirection: 'column',
        gap: Space.M,
        zIndex: 50,
      }}>
        {/* Fly Button */}
        <div 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isFlying ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.4)',
            border: `2px solid ${isFlying ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.7)'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            userSelect: 'none',
            boxShadow: isFlying ? '0 0 15px rgba(59, 130, 246, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
          onClick={() => toggleFlying()}
        >
          🚀
        </div>

        {/* Fire Button */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: isFiringFromUI ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.4)',
            border: `2px solid ${isFiringFromUI ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.7)'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '32px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            userSelect: 'none',
            boxShadow: isFiringFromUI ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
            transform: isFiringFromUI ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.1s ease'
          }}
          onPointerDown={() => setFiringFromUI(true)}
          onPointerUp={() => setFiringFromUI(false)}
          onPointerLeave={() => setFiringFromUI(false)}
        >
          🔥
        </div>
      </div>
    </>
  );
};

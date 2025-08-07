import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const InstallPrompt = () => {
  const promptEvent = useInstallPrompt();
  const [installed, setInstalled] = useState(false);

  const handleInstallClick = async () => {
    if (!promptEvent) return;

    // @ts-ignore
    await promptEvent.prompt(); // Muestra el prompt
    // @ts-ignore
    const result = await promptEvent.userChoice;

    if (result.outcome === 'accepted') {
      console.log('✅ App instalada');
      setInstalled(true);
    } else {
      console.log('❌ Instalación cancelada');
    }
  };

  // Detectar si es mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!promptEvent || !isMobile || installed) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16 }}>
      <button
        onClick={handleInstallClick}
        style={{
          backgroundColor: '#00bcd4',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
      >
        Instalar Agüita 💧
      </button>
    </div>
  );
};

export default InstallPrompt;
import { Audio } from 'expo-av';
import { useCallback, useEffect } from 'react';

// Remote URLs for quick prototyping since we don't have local assets
const SOUND_URLS = {
  click: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
  coin: 'https://www.soundjay.com/misc/sounds/coin-drop-4.mp3',
  victory: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3'
};

export function useAudio() {
  useEffect(() => {
    // Configura o áudio para tocar mesmo no modo silencioso do iOS
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  const playSound = async (url: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync(); // Limpa da memória após tocar
        }
      });
    } catch (e) {
      console.log('Erro ao tocar áudio', e);
    }
  };

  const playClick = useCallback(() => playSound(SOUND_URLS.click), []);
  const playCoin = useCallback(() => playSound(SOUND_URLS.coin), []);
  const playVictory = useCallback(() => playSound(SOUND_URLS.victory), []);

  return { playClick, playCoin, playVictory };
}

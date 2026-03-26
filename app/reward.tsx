import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import MascotLeo from '../components/MascotLeo';
import { useAudio } from '../hooks/useAudio';
import { MotiView } from 'moti';

export default function RewardScreen() {
  const router = useRouter();
  const { playVictory, playClick } = useAudio();
  const { completeLevel, unlockItem, inventory } = useGameStore();

  useEffect(() => {
    // Toca o som mágico e wow de vitória
    playVictory();
    // Ao montar a tela, consolida a vitória
    completeLevel();
    // Tenta desbloquear a "Capa do Vencedor" pra dar o efeito "WOW"
    const capa = inventory.find(i => i.id === 'cape_1');
    if (capa && !capa.unlocked) {
      unlockItem('cape_1');
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Confetti simulation with Moti */}
      <MotiView
        from={{ translateY: -500, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        style={styles.rewardBox}
      >
        <Text style={styles.title}>VITÓRIA!</Text>
        <Text style={styles.coinsText}>+50 Moedas 🪙</Text>
        
        <View style={styles.chestContainer}>
          <Text style={styles.chestEmoji}>🎁</Text>
          <Text style={styles.newItemText}>Novo Item Desbloqueado!</Text>
          <Text style={styles.itemEmoji}>🦸</Text>
        </View>
      </MotiView>

      <View style={styles.mascotHolder}>
        <MascotLeo emotion="excited" message="Incrível! Você foi muito bem!" />
      </View>

      <Pressable style={styles.continueButton} onPress={() => { playClick(); router.replace('/'); }}>
        <Text style={styles.continueText}>CONTINUAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FACC15', // Yellow background for celebration
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  rewardBox: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#A16207',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#F97316',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 20,
  },
  coinsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EAB308',
    marginBottom: 30,
  },
  chestContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 20,
    width: '100%',
  },
  chestEmoji: { fontSize: 60, marginBottom: 10 },
  newItemText: { fontSize: 18, fontWeight: 'bold', color: '#B45309', marginBottom: 10 },
  itemEmoji: { fontSize: 50 },
  mascotHolder: { marginBottom: 40 },
  continueButton: {
    backgroundColor: '#22C55E',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#16A34A',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  continueText: { fontSize: 24, fontWeight: '900', color: '#FFF' },
});

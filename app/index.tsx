import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import MascotLeo from '../components/MascotLeo';
import Avatar from '../components/Avatar';
import { useAudio } from '../hooks/useAudio';
import { MotiView } from 'moti';
import { Coins, Flame, Shirt } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { playClick } = useAudio();
  const { coins, streak, userName, checkStreak } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Evita loop de redirecionamento ou hidratação incorreta
    setMounted(true);
    checkStreak();
  }, []);

  useEffect(() => {
    if (mounted && !userName) {
      router.replace('/onboarding');
    }
  }, [mounted, userName]);

  if (!mounted || !userName) {
    return <View style={styles.container} />; // Tela vazia até resolver
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statBadge}>
          <Flame color="#EF4444" size={24} fill="#EF4444" />
          <Text style={styles.statText}>{streak}</Text>
        </View>
        <View style={styles.statBadge}>
          <Coins color="#FACC15" size={24} fill="#FACC15" />
          <Text style={styles.statText}>{coins}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
        >
          <Text style={styles.title}>Jornada da Fé</Text>
        </MotiView>
        
        <View style={styles.characterSection}>
          <Avatar />
          <View style={styles.mascotContainer}>
            <MascotLeo message={`Vamos continuar,\n${userName}?`} emotion="excited" />
          </View>
        </View>

        {/* Big Play Button */}
        <MotiView
          from={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 1500,
          }}
        >
          <Pressable 
            style={styles.playButton}
            onPress={() => {
              playClick();
              router.push('/map');
            }}
          >
            <Text style={styles.playButtonText}>JOGAR</Text>
          </Pressable>
        </MotiView>
      </View>

      {/* Footer Nav */}
      <View style={styles.footer}>
        <Pressable 
          style={styles.wardrobeButton}
          onPress={() => router.push('/wardrobe')}
        >
          <Shirt color="#FFF" size={32} />
          <Text style={styles.wardrobeText}>Meu Guarda-Roupa</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38BDF8', // Sky Blue
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
    marginBottom: 20,
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  mascotContainer: {
    position: 'absolute',
    right: -80,
    top: -40,
  },
  playButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#16A34A',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
  },
  wardrobeButton: {
    backgroundColor: '#F97316',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#EA580C',
    shadowColor: '#C2410C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  wardrobeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});

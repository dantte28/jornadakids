import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Smile, Zap, Star } from 'lucide-react-native';

interface MascotLeoProps {
  message?: string;
  emotion?: 'happy' | 'excited' | 'sad' | 'thinking';
}

export default function MascotLeo({ message, emotion = 'happy' }: MascotLeoProps) {
  const getIcon = () => {
    switch (emotion) {
      case 'excited': return <Zap color="#F59E0B" size={48} />;
      case 'happy': return <Smile color="#3B82F6" size={48} />;
      default: return <Star color="#F59E0B" size={48} />;
    }
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ translateY: -10 }}
        animate={{ translateY: 0 }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1500,
        }}
        style={styles.mascot}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
      </MotiView>
      
      {message && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.bubble}
        >
          <Text style={styles.messageText}>{message}</Text>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mascot: {
    marginBottom: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bubble: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#BAE6FD',
    maxWidth: 250,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
  }
});

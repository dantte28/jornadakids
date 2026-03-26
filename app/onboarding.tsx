import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import MascotLeo from '../components/MascotLeo';
import { MotiView } from 'moti';

export default function OnboardingScreen() {
  const router = useRouter();
  const setUserName = useGameStore((state) => state.setUserName);
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim().length > 1) {
      setUserName(name.trim());
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.header}
        >
          <Text style={styles.title}>Bem-vindo!</Text>
        </MotiView>
        
        <View style={styles.mascotHolder}>
          <MascotLeo message="Olá amiguinho! Como você se chama?" emotion="happy" />
        </View>

        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 400 }}
          style={styles.form}
        >
          <TextInput
            style={styles.input}
            placeholder="Seu nome incrível!"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            maxLength={15}
          />

          <Pressable 
            style={[styles.button, name.trim().length <= 1 && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={name.trim().length <= 1}
          >
            <Text style={styles.buttonText}>Começar Aventura!</Text>
          </Pressable>
        </MotiView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#38BDF8' },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 30 },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center'
  },
  mascotHolder: { marginBottom: 40, transform: [{ scale: 1.2 }] },
  form: { width: '100%', alignItems: 'center' },
  input: {
    backgroundColor: '#FFF',
    width: '90%',
    padding: 20,
    borderRadius: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  button: {
    backgroundColor: '#22C55E',
    width: '90%',
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    borderColor: '#4B5563',
    shadowColor: '#4B5563',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
  }
});

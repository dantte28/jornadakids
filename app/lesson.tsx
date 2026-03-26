import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MascotLeo from '../components/MascotLeo';
import { MotiView } from 'moti';
import { X, Check } from 'lucide-react-native';
import { WORLDS, LessonData } from '../constants/worlds';

export default function LessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  
  // Encontra a lição
  const flatLessons = WORLDS.flatMap((w) => w.lessons);
  const lesson = flatLessons.find(l => l.id === Number(lessonId)) || flatLessons[0];

  const [taps, setTaps] = useState(0);
  const requiredTaps = 3;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const handleFinish = () => {
    setTimeout(() => {
      router.replace('/reward');
    }, 1000);
  };

  const handleTap = () => {
    if (taps < requiredTaps) {
      setTaps(taps + 1);
      if (taps + 1 === requiredTaps) handleFinish();
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedAnswer(index);
    if (index === lesson.correctAnswerIndex) {
      setIsAnswerCorrect(true);
      handleFinish();
    } else {
      setIsAnswerCorrect(false);
    }
  };

  const renderContent = () => {
    switch (lesson.type) {
      case 'story':
        return (
          <View style={styles.gameArea}>
            <Text style={styles.storyText}>{lesson.content}</Text>
            <Pressable style={styles.primaryButton} onPress={() => handleFinish()}>
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </Pressable>
          </View>
        );

      case 'interaction':
        return (
          <View style={styles.gameArea}>
            <Text style={styles.instructionText}>{lesson.content}</Text>
            <Pressable onPress={handleTap} style={styles.interactiveElement}>
              <MotiView animate={{ scale: taps > 0 ? [1, 1.2, 1] : 1 }} transition={{ type: 'timing', duration: 200 }}>
                <Text style={styles.emoji}>🖐️</Text>
              </MotiView>
            </Pressable>
            <Text style={styles.tapCounter}>{taps} / {requiredTaps}</Text>
          </View>
        );

      case 'quiz':
        return (
          <View style={styles.gameArea}>
            <Text style={styles.questionText}>{lesson.question}</Text>
            {lesson.options?.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = isSelected && isAnswerCorrect;
              const isWrong = isSelected && isAnswerCorrect === false;

              return (
                <Pressable 
                  key={index} 
                  onPress={() => handleOptionSelect(index)}
                  style={[
                    styles.optionButton,
                    isSelected ? styles.optionSelected : null,
                    isCorrect ? styles.optionCorrect : null,
                    isWrong ? styles.optionWrong : null
                  ]}
                >
                  <Text style={[styles.optionText, (isSelected || isCorrect || isWrong) && styles.optionTextWhite]}>
                    {option}
                  </Text>
                  {isCorrect && <Check color="#FFF" size={24} style={styles.resultIcon} />}
                  {isWrong && <X color="#FFF" size={24} style={styles.resultIcon} />}
                </Pressable>
              );
            })}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X color="#9CA3AF" size={32} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.innerContent}
        >
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {renderContent()}
        </MotiView>
      </View>

      <View style={styles.footer}>
        <MascotLeo 
          emotion={taps === requiredTaps || isAnswerCorrect ? 'excited' : isAnswerCorrect === false ? 'thinking' : 'happy'} 
          message={
            isAnswerCorrect ? 'Você é demaaais!' :
            isAnswerCorrect === false ? 'Ops! Tente novamente!' :
            taps === requiredTaps ? 'Isso aí!' : 
            'Preste muita atenção!'
          } 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60 },
  closeButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  innerContent: { width: '100%', alignItems: 'center' },
  lessonTitle: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 30, color: '#38BDF8' },
  gameArea: { alignItems: 'center', width: '100%' },
  storyText: { fontSize: 22, color: '#4B5563', textAlign: 'center', marginBottom: 40, lineHeight: 32 },
  questionText: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 30 },
  instructionText: { fontSize: 20, color: '#4B5563', textAlign: 'center', marginBottom: 40 },
  primaryButton: { backgroundColor: '#22C55E', width: '80%', paddingVertical: 20, borderRadius: 30, alignItems: 'center', borderWidth: 4, borderColor: '#16A34A', shadowColor: '#15803D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0 },
  primaryButtonText: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  interactiveElement: { width: 150, height: 150, backgroundColor: '#F3F4F6', borderRadius: 75, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#D1D5DB' },
  emoji: { fontSize: 80 },
  tapCounter: { fontSize: 24, fontWeight: 'bold', color: '#9CA3AF', marginTop: 20 },
  optionButton: { width: '100%', padding: 20, backgroundColor: '#F1F5F9', borderRadius: 20, marginVertical: 8, borderWidth: 3, borderColor: '#CBD5E1', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  optionSelected: { backgroundColor: '#38BDF8', borderColor: '#0284C7' },
  optionCorrect: { backgroundColor: '#22C55E', borderColor: '#16A34A' },
  optionWrong: { backgroundColor: '#EF4444', borderColor: '#B91C1C' },
  optionText: { fontSize: 18, fontWeight: 'bold', color: '#334155', textAlign: 'center' },
  optionTextWhite: { color: '#FFF' },
  resultIcon: { position: 'absolute', right: 20 },
  footer: { paddingBottom: 40 }
});

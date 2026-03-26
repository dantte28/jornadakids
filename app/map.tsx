import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import { ArrowLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import { WORLDS } from '../constants/worlds';

export default function MapScreen() {
  const router = useRouter();
  const currentLevel = useGameStore((state) => state.currentLevel);

  // Flatten all lessons across all worlds to easily calculate 'isUnlocked'
  const flatLessons = WORLDS.flatMap((w) => w.lessons.map(l => ({ ...l, worldTheme: w.themeColor, nodeColor: w.nodeColor, worldName: w.name })));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#FFF" size={28} />
        </Pressable>
        <Text style={styles.title}>Mapa da Aventura</Text>
      </View>

      <ScrollView contentContainerStyle={styles.mapContainer}>
        {WORLDS.map((world, worldIndex) => (
          <View key={world.id} style={[styles.worldSection, { backgroundColor: world.themeColor }]}>
            <View style={styles.worldHeader}>
              <Text style={styles.worldTitle}>{world.name}</Text>
            </View>
            
            <View style={styles.nodesContainer}>
              {world.lessons.map((lesson, lessonIndex) => {
                const globalIndex = flatLessons.findIndex(l => l.id === lesson.id);
                const isUnlocked = lesson.id <= currentLevel;
                const isCurrent = lesson.id === currentLevel;
                const isEven = lessonIndex % 2 === 0;

                return (
                  <View key={lesson.id} style={[styles.nodeWrapper, { marginLeft: isEven ? -80 : 80 }]}>
                    {/* Linha que conecta os nós */}
                    {lessonIndex < world.lessons.length - 1 && (
                      <View style={[styles.pathLine, { transform: [{ rotate: isEven ? '45deg' : '-45deg' }] }]} />
                    )}
                    {/* Linha para conectar mundos */}
                    {lessonIndex === world.lessons.length - 1 && worldIndex < WORLDS.length - 1 && (
                      <View style={[styles.worldConnectionLine, { transform: [{ rotate: isEven ? '20deg' : '-20deg' }] }]} />
                    )}
                    
                    <MotiView
                      from={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: globalIndex * 100 }}
                    >
                      <Pressable
                        onPress={() => isUnlocked ? router.push({ pathname: '/lesson', params: { lessonId: lesson.id } }) : null}
                        style={[
                          styles.node,
                          { backgroundColor: world.nodeColor },
                          !isUnlocked && styles.nodeLocked,
                          isCurrent && styles.nodeCurrent
                        ]}
                      >
                        {isCurrent ? (
                          <Text style={styles.nodeIcon}>⭐</Text>
                        ) : isUnlocked ? (
                          <Text style={styles.nodeText}>{lesson.id}</Text>
                        ) : (
                          <Text style={styles.nodeIcon}>🔒</Text>
                        )}
                      </Pressable>
                    </MotiView>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#38BDF8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0284C7',
    borderBottomWidth: 4,
    borderBottomColor: '#0369A1',
  },
  backButton: { padding: 8, backgroundColor: '#0EA5E9', borderRadius: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', marginLeft: 16 },
  mapContainer: { paddingBottom: 60 },
  worldSection: { width: '100%', paddingVertical: 40, alignItems: 'center', borderBottomWidth: 10, borderColor: 'rgba(0,0,0,0.1)' },
  worldHeader: { backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginBottom: 40 },
  worldTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  nodesContainer: { alignItems: 'center', width: '100%' },
  nodeWrapper: { alignItems: 'center', marginVertical: 30, position: 'relative', height: 80, width: 120 },
  lessonTitle: { position: 'absolute', bottom: -30, fontSize: 14, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', width: 140 },
  node: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 5,
    zIndex: 2,
  },
  nodeLocked: { backgroundColor: '#9CA3AF', borderColor: '#4B5563' },
  nodeCurrent: { borderWidth: 6, borderColor: '#FFF', transform: [{ scale: 1.1 }] },
  nodeText: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  nodeIcon: { fontSize: 32 },
  pathLine: { position: 'absolute', top: 60, width: 10, height: 80, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 1 },
  worldConnectionLine: { position: 'absolute', top: 60, width: 14, height: 120, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1 }
});

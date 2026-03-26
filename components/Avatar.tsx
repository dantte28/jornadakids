import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { MotiView } from 'moti';

export default function Avatar() {
  const { equippedItems, inventory } = useGameStore();

  const getEquippedIcon = (type: string) => {
    const itemId = equippedItems[type as keyof typeof equippedItems];
    if (!itemId) return null;
    const item = inventory.find(i => i.id === itemId);
    return item ? item.imageIcon : null;
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        style={styles.avatarBase}
      >
        <Text style={styles.baseEmoji}>🧑</Text>
        
        {/* Hat Layer */}
        {getEquippedIcon('hat') && (
          <View style={[styles.layer, styles.hatLayer]}>
            <Text style={styles.itemEmoji}>{getEquippedIcon('hat')}</Text>
          </View>
        )}

        {/* Shirt Layer */}
        {getEquippedIcon('shirt') && (
          <View style={[styles.layer, styles.shirtLayer]}>
            <Text style={styles.itemEmoji}>{getEquippedIcon('shirt')}</Text>
          </View>
        )}

        {/* Cape Layer */}
        {getEquippedIcon('cape') && (
          <View style={[styles.layer, styles.capeLayer]}>
            <Text style={styles.itemEmoji}>{getEquippedIcon('cape')}</Text>
          </View>
        )}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: 150,
    height: 150,
  },
  avatarBase: {
    width: 120,
    height: 120,
    backgroundColor: '#FDE68A',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#F59E0B',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  baseEmoji: {
    fontSize: 60,
  },
  layer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  itemEmoji: {
    fontSize: 40,
  },
  hatLayer: {
    top: -30,
    zIndex: 3,
  },
  shirtLayer: {
    bottom: -15,
    zIndex: 2,
    transform: [{ scale: 1.2 }],
  },
  capeLayer: {
    bottom: 10,
    zIndex: 1,
    transform: [{ scale: 1.5 }],
    opacity: 0.9,
  }
});

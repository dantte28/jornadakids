import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore, InventoryItem } from '../store/useGameStore';
import Avatar from '../components/Avatar';
import { useAudio } from '../hooks/useAudio';
import { ArrowLeft, Coins } from 'lucide-react-native';

export default function WardrobeScreen() {
  const router = useRouter();
  const { playCoin } = useAudio();
  const { coins, inventory, equippedItems, equipItem, purchaseItem } = useGameStore();
  const [activeTab, setActiveTab] = useState<'hat' | 'shirt' | 'cape'>('hat');

  const filteredItems = inventory.filter((item) => item.type === activeTab);

  const handlePressItem = (item: InventoryItem) => {
    if (item.unlocked) {
      equipItem(item.id, item.type);
    } else {
      if (coins >= item.price) {
        Alert.alert(
          "Comprar Item",
          `Deseja comprar ${item.name} por ${item.price} moedas?`,
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Comprar", 
              onPress: () => {
                const success = purchaseItem(item.id);
                if (success) {
                  playCoin();
                  equipItem(item.id, item.type); // Equipa automaticamente ao comprar
                }
              }
            }
          ]
        );
      } else {
        Alert.alert("Ops!", "Você não tem moedas suficientes. Jogue mais para ganhar!");
      }
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const isEquipped = equippedItems[item.type] === item.id;
    const canAfford = coins >= item.price;

    return (
      <Pressable 
        style={[
          styles.itemCard,
          !item.unlocked && styles.itemLocked,
          isEquipped && styles.itemEquipped
        ]}
        onPress={() => handlePressItem(item)}
      >
        <View style={[styles.itemIconContainer, item.rarity === 'epic' && styles.bgEpic, item.rarity === 'rare' && styles.bgRare]}>
          <Text style={styles.itemIcon}>{item.unlocked ? item.imageIcon : '🔒'}</Text>
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
        {!item.unlocked ? (
          <View style={styles.purchaseContainer}>
            <View style={styles.priceContainer}>
              <Coins color={canAfford ? "#FACC15" : "#9CA3AF"} size={14} fill={canAfford ? "#FACC15" : "#9CA3AF"} />
              <Text style={[styles.priceText, !canAfford && styles.priceTextDisabled]}>{item.price}</Text>
            </View>
            <Text style={[styles.buyText, !canAfford && styles.buyTextDisabled]}>Comprar</Text>
          </View>
        ) : (
          <Text style={styles.statusText}>{isEquipped ? 'Equipado' : 'Equipar'}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#FFF" size={28} />
        </Pressable>
        <Text style={styles.title}>Minha Coleção</Text>
        <View style={styles.coinBadge}>
          <Coins color="#FACC15" size={20} fill="#FACC15" />
          <Text style={styles.coinText}>{coins}</Text>
        </View>
      </View>

      <View style={styles.avatarSection}>
        <Avatar />
      </View>

      <View style={styles.inventorySection}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, activeTab === 'hat' && styles.tabActive]} onPress={() => setActiveTab('hat')}>
            <Text style={[styles.tabText, activeTab === 'hat' && styles.tabTextActive]}>Cabeça</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'shirt' && styles.tabActive]} onPress={() => setActiveTab('shirt')}>
            <Text style={[styles.tabText, activeTab === 'shirt' && styles.tabTextActive]}>Roupa</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'cape' && styles.tabActive]} onPress={() => setActiveTab('cape')}>
            <Text style={[styles.tabText, activeTab === 'cape' && styles.tabTextActive]}>Capa</Text>
          </Pressable>
        </View>

        {/* Grid */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F97316',
    borderBottomWidth: 4,
    borderBottomColor: '#C2410C',
  },
  backButton: { padding: 8, backgroundColor: '#EA580C', borderRadius: 20 },
  title: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  coinText: { fontSize: 16, fontWeight: 'bold', marginLeft: 4, color: '#333' },
  avatarSection: {
    height: 200,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#FED7AA',
  },
  inventorySection: { flex: 1, backgroundColor: '#F8FAFC' },
  tabs: { flexDirection: 'row', padding: 10, justifyContent: 'space-around', backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  tabActive: { backgroundColor: '#38BDF8' },
  tabText: { fontSize: 16, fontWeight: 'bold', color: '#64748B' },
  tabTextActive: { color: '#FFF' },
  grid: { padding: 10 },
  itemCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  itemLocked: { opacity: 0.8, backgroundColor: '#F1F5F9' },
  itemEquipped: { borderColor: '#22C55E', backgroundColor: '#DCFCE7' },
  itemIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  bgEpic: { backgroundColor: '#E879F9' },
  bgRare: { backgroundColor: '#38BDF8' },
  itemIcon: { fontSize: 30 },
  itemName: { fontSize: 12, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
  purchaseContainer: { alignItems: 'center', backgroundColor: '#FEF08A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, width: '100%'},
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  priceText: { fontSize: 12, fontWeight: 'bold', color: '#A16207', marginLeft: 4 },
  priceTextDisabled: { color: '#6B7280' },
  buyText: { fontSize: 10, fontWeight: '800', color: '#A16207', textTransform: 'uppercase'},
  buyTextDisabled: { color: '#6B7280' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#22C55E' }
});

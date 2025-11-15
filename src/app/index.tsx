import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import AddItemModal from "@/components/AddItemModal";
import GroceryItem from "@/components/GroceryItem";

const Page = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const db = useSQLiteContext();

  const fetchData = async () => {
    const result = await db.getAllAsync("SELECT * FROM grocery_items");
    setGroceryItems(result);
  };

  const handleAddItem = async (
    name: string,
    quantity: string,
    category: string
  ) => {
    if (!name.trim()) {
      alert("Tên món không được để trống");
      return;
    }

    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?)`,
      [name, quantity, category, 0, Date.now()]
    );
    fetchData();
    setModalVisible(false);
  };

  const handleToggleBought = async (id: number) => {
    const itemIndex = groceryItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    const newBoughtState = groceryItems[itemIndex].bought === 1 ? 0 : 1;

    await db.runAsync(`UPDATE grocery_items SET bought = ? WHERE id = ?`, [
      newBoughtState,
      id,
    ]);

    setGroceryItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        bought: newBoughtState,
      };
      return updatedItems;
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <AddItemModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddItem={handleAddItem}
      />

      {groceryItems.length === 0 ? (
        <Text style={styles.emptyStateText}>
          Danh sách trống, thêm món cần mua nhé!
        </Text>
      ) : (
        <FlatList
          data={groceryItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GroceryItem
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              category={item.category}
              bought={item.bought}
              onToggleBought={handleToggleBought}
            />
          )}
        />
      )}

      <FAB
        icon="plus"
        onPress={() => setModalVisible(true)}
        style={styles.fab}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyStateText: {
    textAlign: "center",
    fontSize: 18,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee",
  },
});

export default Page;

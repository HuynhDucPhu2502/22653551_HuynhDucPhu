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

    const newItem = {
      id: Date.now(),
      name,
      quantity,
      category,
      bought: 0,
    };

    setGroceryItems((prevItems) => [newItem, ...prevItems]);
    setModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const result = await db.getAllAsync("SELECT * FROM grocery_items");
        setGroceryItems(result);
      };
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
              name={item.name}
              quantity={item.quantity}
              category={item.category}
              bought={item.bought}
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

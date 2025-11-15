import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import AddItemModal from "@/components/AddItemModal";
import GroceryItem from "@/components/GroceryItem";
import EditItemModal from "@/components/EditItemModal";

const Page = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Dùng để lưu item đang được sửa
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
    const item = groceryItems.find((item) => item.id === id);
    if (!item) return;

    const newBoughtState = item.bought === 1 ? 0 : 1;
    await db.runAsync(`UPDATE grocery_items SET bought = ? WHERE id = ?`, [
      newBoughtState,
      id,
    ]);
    fetchData();
  };

  const handleEditItem = (id: number) => {
    const item = groceryItems.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
      setEditModalVisible(true);
    }
  };

  const handleSaveEditItem = async (
    name: string,
    quantity: string,
    category: string
  ) => {
    if (!name.trim()) {
      alert("Tên món không được để trống");
      return;
    }

    await db.runAsync(
      `UPDATE grocery_items SET name = ?, quantity = ?, category = ? WHERE id = ?`,
      [name, quantity, category, currentItem.id]
    );
    fetchData();
    setEditModalVisible(false);
    setCurrentItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    await db.runAsync(`DELETE FROM grocery_items WHERE id = ?`, [id]);
    fetchData(); // Refresh danh sách sau khi xóa
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
      <EditItemModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        item={currentItem}
        onSave={handleSaveEditItem}
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
              onEdit={handleEditItem}
              onDelete={handleDeleteItem} // Thêm hàm xóa cho mỗi item
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

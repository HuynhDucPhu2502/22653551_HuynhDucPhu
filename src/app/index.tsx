import React, { useState, useMemo, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, TextInput } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { FAB } from "react-native-paper";
import AddItemModal from "@/components/AddItemModal";
import GroceryItem from "@/components/GroceryItem";
import EditItemModal from "@/components/EditItemModal";
import { useFocusEffect } from "expo-router";

const Page = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Dùng để lưu item đang được sửa
  const db = useSQLiteContext();

  const fetchData = async () => {
    const result = await db.getAllAsync("SELECT * FROM grocery_items");
    setGroceryItems(result);
    setFilteredItems(result); // Initialize filteredItems with all items
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

  // Handle real-time search
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      if (!searchTerm) {
        setFilteredItems(groceryItems); // Nếu không có tìm kiếm, hiển thị toàn bộ danh sách
      } else {
        const filtered = groceryItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered); // Lọc danh sách theo tên
      }
    },
    [groceryItems]
  );

  // UseMemo for optimized search performance
  const filteredData = useMemo(() => filteredItems, [filteredItems]);
  const handleDeleteItem = async (id: number) => {
    await db.runAsync(`DELETE FROM grocery_items WHERE id = ?`, [id]);
    fetchData();
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

      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm món hàng"
        value={searchTerm}
        onChangeText={handleSearch} // Gọi hàm lọc khi gõ vào search
      />

      {filteredData.length === 0 ? (
        <Text style={styles.emptyStateText}>
          Không tìm thấy món nào phù hợp!
        </Text>
      ) : (
        <FlatList
          data={filteredData}
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
              onDelete={handleDeleteItem}
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
  searchInput: {
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
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

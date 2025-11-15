import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { FAB } from "react-native-paper";
import AddItemModal from "@/components/AddItemModal";
import GroceryItem from "@/components/GroceryItem";
import EditItemModal from "@/components/EditItemModal";
import useGroceryItems from "./hooks/useGroceryItems";

const Page = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [url, setUrl] = useState(""); // URL nhập vào API
  const [importModalVisible, setImportModalVisible] = useState(false); // Modal cho nhập URL API
  const {
    groceryItems,
    loading,
    error,
    addItem,
    toggleBought,
    updateItem,
    deleteItem,
    importFromAPI,
    searchItems,
  } = useGroceryItems(); // Sử dụng custom hook

  const handleAddItem = async (
    name: string,
    quantity: string,
    category: string
  ) => {
    await addItem(name, quantity, category); // Thêm món
    setModalVisible(false);
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
    await updateItem(currentItem.id, name, quantity, category); // Cập nhật món
    setEditModalVisible(false);
    setCurrentItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    await deleteItem(id); // Xóa món
  };

  const handleImportFromAPI = () => {
    importFromAPI(url); // Import từ API
    setImportModalVisible(false);
  };

  const handleSearch = (searchTerm: string) => {
    searchItems(searchTerm); // Tìm kiếm món hàng
  };

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

      {/* Nút Import từ API */}
      <Button
        title="Import từ API"
        onPress={() => setImportModalVisible(true)}
      />

      {/* Modal nhập URL API */}
      <Modal
        visible={importModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập URL API</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="Nhập URL API"
            />
            <Button title="Lưu" onPress={handleImportFromAPI} />
            <Button
              title="Hủy"
              onPress={() => setImportModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>

      {/* Hiển thị loading khi đang fetch */}
      {loading && <ActivityIndicator size="large" color="#6200ee" />}

      {/* Hiển thị lỗi nếu fetch thất bại */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
            onToggleBought={toggleBought}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        )}
      />

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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee",
  },
});

export default Page;

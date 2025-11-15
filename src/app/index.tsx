import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { FAB } from "react-native-paper";
import AddItemModal from "@/components/AddItemModal";
import GroceryItem from "@/components/GroceryItem";
import EditItemModal from "@/components/EditItemModal";

const Page = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State để lưu thông báo lỗi
  const [url, setUrl] = useState(""); // State để lưu URL người dùng nhập vào
  const [importModalVisible, setImportModalVisible] = useState(false); // Modal cho nhập URL API
  const db = useSQLiteContext();

  // Fetch data từ SQLite khi load
  const fetchData = async () => {
    const result = await db.getAllAsync("SELECT * FROM grocery_items");
    setGroceryItems(result); // Cập nhật danh sách món hàng từ SQLite
  };

  useEffect(() => {
    fetchData(); // Gọi khi component load lần đầu
  }, []);

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

  // Hàm Import từ API
  const handleImportFromAPI = async () => {
    setLoading(true);
    setError(""); // Reset lỗi trước khi gọi API

    try {
      const response = await fetch(url); // Lấy URL người dùng nhập vào
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const data = await response.json();

      // Lọc và thêm dữ liệu từ API vào SQLite
      for (const item of data) {
        const { name, quantity, category, completed } = item;
        const bought = completed ? 1 : 0;

        // Kiểm tra nếu item đã có trong cơ sở dữ liệu
        const existingItem = groceryItems.find((i) => i.name === name);
        if (!existingItem) {
          await db.runAsync(
            `INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?)`,
            [name, quantity, category, bought, Date.now()]
          );
        }
      }

      fetchData(); // Refresh danh sách sau khi import
      setImportModalVisible(false); // Đóng modal sau khi hoàn tất
    } catch (err) {
      setError("Không thể tải dữ liệu từ API.");
    } finally {
      setLoading(false);
    }
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
              onDelete={handleDeleteItem} // Truyền hàm xóa vào
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
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
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
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee",
  },
});

export default Page;

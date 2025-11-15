// useGroceryItems.ts
import { useState, useCallback, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";

// Hook quản lý các món hàng
const useGroceryItems = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Lỗi fetch
  const db = useSQLiteContext();

  // Fetch tất cả dữ liệu món hàng từ SQLite
  const fetchData = useCallback(async () => {
    try {
      const result = await db.getAllAsync("SELECT * FROM grocery_items");
      setGroceryItems(result);
    } catch (err) {
      console.error("Failed to fetch items from SQLite:", err);
    }
  }, [db]);

  // Thêm món mới vào SQLite
  const addItem = async (name: string, quantity: string, category: string) => {
    if (!name.trim()) {
      alert("Tên món không được để trống");
      return;
    }

    try {
      await db.runAsync(
        `INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?)`,
        [name, quantity, category, 0, Date.now()]
      );
      fetchData(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  // Cập nhật trạng thái món (đã mua/chưa mua)
  const toggleBought = async (id: number) => {
    const item = groceryItems.find((item) => item.id === id);
    if (!item) return;

    const newBoughtState = item.bought === 1 ? 0 : 1;
    try {
      await db.runAsync(`UPDATE grocery_items SET bought = ? WHERE id = ?`, [
        newBoughtState,
        id,
      ]);
      fetchData(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to toggle bought state:", err);
    }
  };

  // Cập nhật món
  const updateItem = async (
    id: number,
    name: string,
    quantity: string,
    category: string
  ) => {
    try {
      await db.runAsync(
        `UPDATE grocery_items SET name = ?, quantity = ?, category = ? WHERE id = ?`,
        [name, quantity, category, id]
      );
      fetchData(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  // Xóa món
  const deleteItem = async (id: number) => {
    try {
      await db.runAsync(`DELETE FROM grocery_items WHERE id = ?`, [id]);
      fetchData(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // Import dữ liệu từ API
  const importFromAPI = async (url: string) => {
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
    } catch (err) {
      setError("Không thể tải dữ liệu từ API.");
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách theo tên
  const searchItems = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) {
        fetchData();
      } else {
        const filteredItems = groceryItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setGroceryItems(filteredItems);
      }
    },
    [groceryItems, fetchData]
  );

  // Fetch dữ liệu khi load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    groceryItems,
    loading,
    error,
    addItem,
    toggleBought,
    updateItem,
    deleteItem,
    importFromAPI,
    searchItems,
  };
};

export default useGroceryItems;

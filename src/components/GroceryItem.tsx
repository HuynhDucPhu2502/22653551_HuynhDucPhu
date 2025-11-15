import React from "react";
import { View, Text, Pressable, Button, StyleSheet, Alert } from "react-native";

type GroceryItemProps = {
  id: number;
  name: string;
  quantity: number;
  category?: string;
  bought: number;
  onToggleBought: (id: number) => void;
  onEdit: (id: number) => void; // Callback để sửa món
  onDelete: (id: number) => void; // Callback để xóa món
};

const GroceryItem: React.FC<GroceryItemProps> = ({
  id,
  name,
  quantity,
  category,
  bought,
  onToggleBought,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa món này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: () => onDelete(id) },
      ],
      { cancelable: false }
    );
  };

  return (
    <View className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <Pressable
        onPress={() => onToggleBought(id)} // Toggle trạng thái khi bấm vào item
        style={styles.itemTextContainer}
      >
        <Text
          style={[
            styles.itemText,
            bought === 1 ? styles.boughtText : styles.notBoughtText,
          ]}
        >
          {name}
        </Text>
      </Pressable>
      <Text style={styles.quantityText}>Số lượng: {quantity}</Text>
      <Text style={styles.categoryText}>
        Danh mục: {category || "Không có"}
      </Text>

      <Button title="Sửa" onPress={() => onEdit(id)} color="blue" />
      <Button title="Xóa" onPress={handleDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  itemText: {
    fontSize: 18,
    fontWeight: "500",
  },
  boughtText: {
    textDecorationLine: "line-through",
    color: "green",
  },
  notBoughtText: {
    color: "black",
  },
  quantityText: {
    color: "#555",
  },
  categoryText: {
    color: "#777",
  },
  itemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default GroceryItem;

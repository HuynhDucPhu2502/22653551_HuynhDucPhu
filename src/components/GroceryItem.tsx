import React from "react";
import { View, Text, Pressable, Button, StyleSheet } from "react-native";

type GroceryItemProps = {
  id: number;
  name: string;
  quantity: number;
  category?: string;
  bought: number;
  onToggleBought: (id: number) => void;
  onEdit: (id: number) => void; // Callback để sửa món
};

const GroceryItem: React.FC<GroceryItemProps> = ({
  id,
  name,
  quantity,
  category,
  bought,
  onToggleBought,
  onEdit,
}) => {
  return (
    <View className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <Pressable
        onPress={() => onToggleBought(id)} // Toggle trạng thái mua khi bấm vào toàn bộ item
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

      <Text
        style={[
          styles.statusText,
          bought === 1 ? styles.boughtStatus : styles.notBoughtStatus,
        ]}
      >
        {bought === 1 ? "Đã mua" : "Chưa mua"}
      </Text>

      <Button title="Sửa" onPress={() => onEdit(id)} color="blue" />
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
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  boughtStatus: {
    color: "green",
  },
  notBoughtStatus: {
    color: "red",
  },
  itemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default GroceryItem;

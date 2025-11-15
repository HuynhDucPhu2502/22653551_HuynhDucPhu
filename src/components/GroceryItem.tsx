import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type GroceryItemProps = {
  id: number;
  name: string;
  quantity: number;
  category?: string;
  bought: number;
  onToggleBought: (id: number) => void;
};

const GroceryItem: React.FC<GroceryItemProps> = ({
  id,
  name,
  quantity,
  category,
  bought,
  onToggleBought,
}) => {
  return (
    <View className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <Pressable
        onPress={() => onToggleBought(id)}
        style={{ flexDirection: "column", padding: 10 }}
      >
        <Text
          style={[
            styles.itemText,
            bought === 1 ? styles.boughtText : styles.notBoughtText,
          ]}
        >
          {name}
        </Text>
        <Text style={styles.quantityText}>Số lượng: {quantity}</Text>
        <Text style={styles.categoryText}>
          Danh mục: {category || "Không có"}
        </Text>

        <Text
          style={[
            styles.statusText,
            bought === 1 ? styles.boughtStatusText : styles.notBoughtStatusText,
          ]}
        >
          {bought === 1 ? "Đã mua" : "Chưa mua"}
        </Text>
      </Pressable>
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
  boughtStatusText: {
    color: "green",
  },
  notBoughtStatusText: {
    color: "red",
  },
});

export default GroceryItem;

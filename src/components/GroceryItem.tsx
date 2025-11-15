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
        className="flex-row items-center"
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
});

export default GroceryItem;

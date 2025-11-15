import React, { useState } from "react";
import { View, FlatList, Text } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import GroceryItem from "@/components/GroceryItem";

const Page = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const db = useSQLiteContext();

  const fetchData = async () => {
    const result = await db.getAllAsync("SELECT * FROM grocery_items");
    setGroceryItems(result);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View className="flex-1 p-4">
      {groceryItems.length === 0 ? (
        <Text className="text-center">
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
    </View>
  );
};

export default Page;

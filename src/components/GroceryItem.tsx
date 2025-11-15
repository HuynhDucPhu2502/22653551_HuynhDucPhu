import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { StyleSheet } from "react-native";

type GroceryItemProps = {
  name: string;
  quantity: number;
  category?: string;
  bought: number;
};

const GroceryItem: React.FC<GroceryItemProps> = ({
  name,
  quantity,
  category,
  bought,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Title title={name} subtitle={`Số lượng: ${quantity}`} />
      <Card.Content>
        <Paragraph style={styles.paragraph}>
          Danh mục: {category || "Không có"}
        </Paragraph>
        <Paragraph style={bought === 1 ? styles.bought : styles.notBought}>
          {bought === 1 ? "Đã mua" : "Chưa mua"}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: "#f9f9f9",
  },
  paragraph: {
    color: "#555",
    marginBottom: 5,
  },
  bought: {
    color: "green",
    fontWeight: "bold",
  },
  notBought: {
    color: "red",
    fontWeight: "bold",
  },
});

export default GroceryItem;

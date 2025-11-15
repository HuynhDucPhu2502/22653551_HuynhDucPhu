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
      <Card.Content>
        <Title style={styles.title}>{name}</Title>
        <Paragraph style={styles.paragraph}>Số lượng: {quantity}</Paragraph>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paragraph: {
    color: "#555",
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

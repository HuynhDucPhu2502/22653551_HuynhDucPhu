import React, { useState, useEffect } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Text } from "react-native";

type EditItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, quantity: string, category: string) => void;
  item: { id: number; name: string; quantity: number; category: string } | null; // Kiểm tra nếu item là null
};

const EditItemModal: React.FC<EditItemModalProps> = ({
  visible,
  onClose,
  onSave,
  item,
}) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setCategory(item.category);
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      onSave(name, quantity, category);
      onClose();
    }
  };

  if (!item) return null; // Nếu item là null, không render modal

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chỉnh sửa món</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Tên món"
          />
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Số lượng"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Danh mục"
          />
          <Button title="Lưu" onPress={handleSave} />
          <Button title="Hủy" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});

export default EditItemModal;

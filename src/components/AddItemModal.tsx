import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Text } from "react-native";

type AddItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddItem: (name: string, quantity: string, category: string) => void;
};

const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên món không được để trống", [{ text: "OK" }]);
      return;
    }
    onAddItem(name, quantity, category);
    setName("");
    setQuantity("1");
    setCategory("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thêm món mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên món (bắt buộc)"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Số lượng"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Danh mục (tùy chọn)"
            value={category}
            onChangeText={setCategory}
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

export default AddItemModal;

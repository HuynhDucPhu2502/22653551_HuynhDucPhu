import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { Slot, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { initTable } from "@/db";

export default function Layout() {
  return (
    <SQLiteProvider
      databaseName="HuynhDucPhu_22653551.db"
      onInit={(db) => initTable(db)}
    >
      <SafeAreaProvider>
        <SafeAreaView className="flex flex-1">
          <Stack />
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}

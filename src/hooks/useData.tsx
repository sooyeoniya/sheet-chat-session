import { createContext, useContext, useState, ReactNode } from "react";
import { ClassSpace, DailySheet, SheetEntry, ChatMessage, User } from "@/types";
import {
  mockUsers,
  mockClassSpaces,
  mockDailySheets,
  mockSheetEntries,
  mockChatMessages,
} from "@/data/mockData";

interface DataContextType {
  users: User[];
  classSpaces: ClassSpace[];
  dailySheets: DailySheet[];
  sheetEntries: SheetEntry[];
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "createdAt">) => void;
  updateSheetEntry: (
    entry: Omit<SheetEntry, "id" | "createdAt" | "updatedAt">
  ) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(mockUsers);
  const [classSpaces] = useState<ClassSpace[]>(mockClassSpaces);
  const [dailySheets] = useState<DailySheet[]>(mockDailySheets);
  const [sheetEntries, setSheetEntries] =
    useState<SheetEntry[]>(mockSheetEntries);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(mockChatMessages);

  const addChatMessage = (
    messageData: Omit<ChatMessage, "id" | "createdAt">
  ) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
  };

  const updateSheetEntry = (
    entryData: Omit<SheetEntry, "id" | "createdAt" | "updatedAt">
  ) => {
    const existingEntryIndex = sheetEntries.findIndex(
      (entry) =>
        entry.dailySheetId === entryData.dailySheetId &&
        entry.rowId === entryData.rowId &&
        entry.userId === entryData.userId
    );

    if (existingEntryIndex >= 0) {
      // 기존 엔트리 업데이트
      setSheetEntries((prev) =>
        prev.map((entry, index) =>
          index === existingEntryIndex
            ? {
                ...entry,
                content: entryData.content,
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
    } else {
      // 새 엔트리 추가
      const newEntry: SheetEntry = {
        ...entryData,
        id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSheetEntries((prev) => [...prev, newEntry]);
    }
  };

  return (
    <DataContext.Provider
      value={{
        users,
        classSpaces,
        dailySheets,
        sheetEntries,
        chatMessages,
        addChatMessage,
        updateSheetEntry,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

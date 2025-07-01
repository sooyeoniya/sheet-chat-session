
export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'instructor' | 'student';
  avatar?: string;
}

export interface ClassSpace {
  id: string;
  name: string;
  instructorId: string;
  startDate: string;
  endDate: string;
  inviteCode: string;
  students: string[]; // user ids
  createdAt: string;
}

export interface DailySheet {
  id: string;
  classSpaceId: string;
  date: string;
  title: string;
  rows: SheetRow[];
  createdAt: string;
}

export interface SheetRow {
  id: string;
  title: string;
  isPublic: boolean;
  order: number;
  type: 'text' | 'question' | 'discussion' | 'checkin';
}

export interface SheetEntry {
  id: string;
  dailySheetId: string;
  rowId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  classSpaceId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

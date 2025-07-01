import {
  ClassSpace,
  DailySheet,
  SheetRow,
  SheetEntry,
  ChatMessage,
  User,
} from "@/types";

export const mockUsers: User[] = [
  {
    id: "instructor_1",
    phone: "010-1234-5678",
    name: "김지훈",
  },
  {
    id: "student_1",
    phone: "010-2345-6789",
    name: "박소연",
  },
  {
    id: "student_2",
    phone: "010-3456-7890",
    name: "이민준",
  },
  {
    id: "student_3",
    phone: "010-4567-8901",
    name: "정하은",
  },
];

export const mockClassSpaces: ClassSpace[] = [
  {
    id: "class_1",
    name: "레벨 1",
    instructorId: "instructor_1",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    inviteCode: "LEVEL1ABC",
    students: ["student_1", "student_2", "student_3"],
    createdAt: "2024-07-01T09:00:00Z",
  },
  {
    id: "class_2",
    name: "레벨 2",
    instructorId: "instructor_1",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    inviteCode: "LEVEL2DEF",
    students: ["student_1", "student_2"],
    createdAt: "2024-08-01T09:00:00Z",
  },
];

export const mockDailySheets: DailySheet[] = [
  {
    id: "sheet_1",
    classSpaceId: "class_1",
    date: "2024-07-01",
    title: "1주차 1일차 - 오리엔테이션",
    rows: [
      {
        id: "row_1",
        title: "체크인 점수 (1-10)",
        isPublic: true,
        order: 1,
        type: "checkin",
      },
      {
        id: "row_2",
        title: "오늘의 목표",
        isPublic: true,
        order: 2,
        type: "text",
      },
      {
        id: "row_3",
        title: "궁금한 점",
        isPublic: true,
        order: 3,
        type: "question",
      },
      {
        id: "row_4",
        title: "토론: 최고의 학습 방법은?",
        isPublic: false,
        order: 4,
        type: "discussion",
      },
    ],
    createdAt: "2024-07-01T09:00:00Z",
  },
  {
    id: "sheet_2",
    classSpaceId: "class_1",
    date: "2024-07-02",
    title: "1주차 2일차 - 기초 이론",
    rows: [
      {
        id: "row_5",
        title: "체크인 점수 (1-10)",
        isPublic: true,
        order: 1,
        type: "checkin",
      },
      {
        id: "row_6",
        title: "어제 학습한 내용 정리",
        isPublic: true,
        order: 2,
        type: "text",
      },
      {
        id: "row_7",
        title: "오늘의 어려운 점",
        isPublic: true,
        order: 3,
        type: "question",
      },
    ],
    createdAt: "2024-07-02T09:00:00Z",
  },
];

export const mockSheetEntries: SheetEntry[] = [
  {
    id: "entry_1",
    dailySheetId: "sheet_1",
    rowId: "row_1",
    userId: "student_1",
    content: "8",
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-07-01T10:00:00Z",
  },
  {
    id: "entry_2",
    dailySheetId: "sheet_1",
    rowId: "row_1",
    userId: "student_2",
    content: "7",
    createdAt: "2024-07-01T10:01:00Z",
    updatedAt: "2024-07-01T10:01:00Z",
  },
  {
    id: "entry_3",
    dailySheetId: "sheet_1",
    rowId: "row_2",
    userId: "student_1",
    content: "React의 기초를 확실히 이해하기",
    createdAt: "2024-07-01T10:05:00Z",
    updatedAt: "2024-07-01T10:05:00Z",
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    classSpaceId: "class_1",
    userId: "instructor_1",
    content: "오늘 수업을 시작하겠습니다! 체크인 점수부터 입력해주세요.",
    createdAt: "2024-07-01T09:30:00Z",
  },
  {
    id: "msg_2",
    classSpaceId: "class_1",
    userId: "student_1",
    content: "안녕하세요! 잘 부탁드립니다.",
    createdAt: "2024-07-01T09:31:00Z",
  },
  {
    id: "msg_3",
    classSpaceId: "class_1",
    userId: "student_2",
    content: "체크인 점수 입력 완료했습니다!",
    createdAt: "2024-07-01T09:35:00Z",
  },
];

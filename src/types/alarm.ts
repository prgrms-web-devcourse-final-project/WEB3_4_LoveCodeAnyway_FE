export enum AlarmType {
  PARTY_INVITATION = "PARTY_INVITATION",
  PARTY_ACCEPTED = "PARTY_ACCEPTED",
  PARTY_REJECTED = "PARTY_REJECTED",
  PARTY_CANCELLED = "PARTY_CANCELLED",
  PARTY_REMINDER = "PARTY_REMINDER",
  MESSAGE = "MESSAGE",
  SUBSCRIBE = "SUBSCRIBE",
  SYSTEM = "SYSTEM"
}

export interface AlarmResponse {
  id: number;
  receiverId: number;
  title: string;
  content: string;
  readStatus: boolean;
  alarmType: AlarmType;
  relId: number;
  createdAt: string;
  modifiedAt: string;
}

export interface AlarmCountResponse {
  totalCount: number;
  unreadCount: number;
} 
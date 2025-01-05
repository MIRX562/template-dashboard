import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user-schema";
import { Image, Video, Music, FileText, FileSpreadsheet } from "lucide-react";

export const fileTypeEnum = pgEnum("file_type", [
  "document",
  "image",
  "video",
  "audio",
  "sheet",
]);

export const fileTable = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  url: text().notNull().unique(),
  type: fileTypeEnum().notNull(),
  mimeType: varchar({ length: 100 }).notNull(),
  size: bigint({ mode: "number" }).notNull(),
  createdAt: timestamp().defaultNow(),
  uploadedBy: uuid().references(() => usersTable.id),
});

export const fileTypeIcons = {
  document: FileText,
  image: Image,
  video: Video,
  audio: Music,
  sheet: FileSpreadsheet,
} as const;

export type FileType = keyof typeof fileTypeIcons;

export function getFileTypeIcon(type: FileType) {
  return fileTypeIcons[type];
}

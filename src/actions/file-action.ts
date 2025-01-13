"use server";
import { fileTable } from "@/db/schemas";
import { logAction } from "./log-action";
import { getCurrentSession } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { determineFileType } from "@/lib/utils";

export async function uploadFile(formData: FormData) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }
    // Extract form values and the file
    const file = formData.get("file") as File | null;
    if (!file) {
      throw new Error("No file provided");
    }

    // Limit file size allowed
    if (file.size > 1024 * 1024 * 2) {
      throw new Error("File is too big");
    }

    // Validate MIME type
    const fileType = determineFileType(file.type);
    if (!fileType) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    // Generate unique file name and path
    const fileName = `${user.id}-${file.name}`;
    const filePath = path.join(process.cwd(), "uploads", fileName);

    // Ensure uploads directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Save file to local directory
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // Save file metadata in the database
    const savedFile = await db
      .insert(fileTable)
      .values({
        url: `/uploads/${fileName}`,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        uploadedBy: user.id,
      })
      .returning();

    await logAction(user.id, "CREATE", "files", "File uploded!");
    return {
      success: true,
      message: "File uploaded successfully",
      file: {
        id: savedFile[0].id,
        url: `/uploads/${fileName}`,
        type: fileType,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}

export async function downloadFile(fileId: string) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }

    // Fetch file metadata from the database
    const fileMetadata = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.id, fileId))
      .limit(1)
      .execute();

    if (fileMetadata.length === 0) {
      throw new Error("File not found");
    }

    const file = fileMetadata[0];
    const filePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(file.url)
    );

    // Check if the file exists on the local disk
    try {
      await fs.access(filePath);
    } catch {
      throw new Error("File not found on server");
    }

    // Read the file content
    const fileBuffer = await fs.readFile(filePath);

    await logAction(user.id, "CREATE", "files", "File sent");
    // Return file content and metadata
    return {
      success: true,
      file: {
        name: path.basename(file.url),
        mimeType: file.mimeType,
        content: fileBuffer.toString("base64"),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}
export async function updateFile(fileUrl: string, formData: FormData) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }

    // Fetch the existing file metadata from the database
    const existingFileMetadata = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.url, fileUrl))
      .limit(1)
      .execute();

    if (existingFileMetadata.length === 0) {
      throw new Error("File not found");
    }

    const existingFile = existingFileMetadata[0];

    // Extract the new file from FormData
    const newFile = formData.get("file") as File | null;
    if (!newFile) {
      throw new Error("No file provided");
    }

    // Validate the new file's MIME type
    const fileType = determineFileType(newFile.type);
    if (!fileType) {
      throw new Error(`Unsupported file type: ${newFile.type}`);
    }

    // Generate unique file name and path for the new file
    const newFileName = `${user.id}-${newFile.name}`;
    const newFilePath = path.join(process.cwd(), "uploads", newFileName);

    // Ensure the uploads directory exists
    await fs.mkdir(path.dirname(newFilePath), { recursive: true });

    // Save the new file to the local directory
    const newFileBuffer = Buffer.from(await newFile.arrayBuffer());
    await fs.writeFile(newFilePath, newFileBuffer);

    // Delete the old file from the local directory
    const oldFilePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(existingFile.url)
    );
    try {
      await fs.unlink(oldFilePath);
    } catch {
      console.warn(`Old file not found or already deleted: ${oldFilePath}`);
    }

    // Update the file metadata in the database
    await db
      .update(fileTable)
      .set({
        url: `/uploads/${newFileName}`,
        type: fileType,
        mimeType: newFile.type,
        size: newFile.size,
        uploadedBy: user.id,
      })
      .where(eq(fileTable.id, existingFileMetadata[0].id));

    return {
      success: true,
      message: "File updated successfully",
      file: {
        id: existingFileMetadata[0].id,
        url: `/uploads/${newFileName}`,
        type: fileType,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}

export async function updateUserImageFile(formData: FormData) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }
    const fileUrl = user.avatarUrl;

    // Fetch the existing file metadata from the database
    const existingFileMetadata = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.url, fileUrl))
      .limit(1)
      .execute();

    if (existingFileMetadata.length === 0) {
      throw new Error("File not found");
    }

    const existingFile = existingFileMetadata[0];

    // Extract the new file from FormData
    const newFile = formData.get("file") as File | null;
    if (!newFile) {
      throw new Error("No file provided");
    }

    // Validate the new file's MIME type
    const fileType = determineFileType(newFile.type);
    if (!fileType) {
      throw new Error(`Unsupported file type: ${newFile.type}`);
    }

    // Generate unique file name and path for the new file
    const newFileName = `${user.id}-${newFile.name}`;
    const newFilePath = path.join(process.cwd(), "uploads", newFileName);

    // Ensure the uploads directory exists
    await fs.mkdir(path.dirname(newFilePath), { recursive: true });

    // Save the new file to the local directory
    const newFileBuffer = Buffer.from(await newFile.arrayBuffer());
    await fs.writeFile(newFilePath, newFileBuffer);

    // Delete the old file from the local directory
    const oldFilePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(existingFile.url)
    );
    try {
      await fs.unlink(oldFilePath);
    } catch {
      console.warn(`Old file not found or already deleted: ${oldFilePath}`);
    }

    // Update the file metadata in the database
    await db
      .update(fileTable)
      .set({
        url: `/uploads/${newFileName}`,
        type: fileType,
        mimeType: newFile.type,
        size: newFile.size,
        uploadedBy: user.id,
      })
      .where(eq(fileTable.id, existingFileMetadata[0].id));

    return {
      success: true,
      message: "File updated successfully",
      file: {
        id: existingFileMetadata[0].id,
        url: `/uploads/${newFileName}`,
        type: fileType,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}

export async function handleDownload(fileId: string) {
  const response = await downloadFile(fileId);

  if (response.success) {
    const { name, mimeType, content } = response.file;
    const link = document.createElement("a");
    link.href = `data:${mimeType};base64,${content}`;
    link.download = name;
    link.click();
  } else {
    console.error("Download failed");
  }
}

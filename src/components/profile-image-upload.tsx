"use client";

import { useState, useRef } from "react";
import { SquarePen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "./ui/avatar";

export function ProfileImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Here you would typically upload the file to your server or cloud storage
      console.log("Uploading file:", selectedFile.name);
      // Reset the state after upload
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen className="mr-2 h-4 w-4" />
          Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Image</DialogTitle>
          <DialogDescription>
            Choose an image file to upload as your profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Picture
            </Label>
            <Input
              id="picture"
              type="file"
              className="col-span-3"
              onChange={handleFileChange}
              accept="image/*"
              ref={fileInputRef}
            />
          </div>
          {previewUrl && (
            <div className="mt-4 relative">
              <Avatar className="h-32 w-32 mx-auto">
                <AvatarImage src={previewUrl} />
              </Avatar>

              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={!selectedFile}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

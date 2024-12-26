"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./notification-list";

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2 mr-2 bg-background/40 backdrop-blur-md">
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          <TabsContent value="unread" className="h-80 overflow-auto">
            <NotificationList type="unread" />
          </TabsContent>
          <TabsContent value="read" className="h-80 overflow-auto">
            <NotificationList type="read" />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

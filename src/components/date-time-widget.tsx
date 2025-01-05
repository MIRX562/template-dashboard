"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "./ui/sidebar";
import { Separator } from "./ui/separator";

export function DateTimeWidget() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { isMobile, state } = useSidebar();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`flex ${
        state == "collapsed" ? "flex-row items-center space-x-2" : "flex-col"
      } items-end space-y-0`}
    >
      <div className="text-sm font-medium text-muted-foreground">
        {formatDate(currentDateTime)}
      </div>
      {state == "collapsed" && (
        <Separator orientation="vertical" className=" h-8" />
      )}
      <div className="text-xl font-normal tabular-nums">
        {formatTime(currentDateTime)}
      </div>
    </div>
  );
}

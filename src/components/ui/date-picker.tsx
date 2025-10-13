"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface Props {
  value?: Date;
  className?: string;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ value, className, onChange }: Props) {
  // const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = useState(false);
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setOpen(false);
    }
    onChange(date);
  };
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value}
            className={cn(
              "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal",
              className
            )}
          >
            <CalendarIcon />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

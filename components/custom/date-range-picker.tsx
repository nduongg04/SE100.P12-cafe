import * as React from "react";
import { Button } from "@/components/ui/button";
import { format, set, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface DateRangePickerProps {
    startDate: Date | undefined;
    endDate: Date | undefined;
    setStartDate: (date: Date | undefined) => void;
    setEndDate: (date: Date | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) => {
    // Handle when the start date changes
    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        // If the start date is after the current end date, reset the end date
        if (date && endDate && isBefore(endDate, date)) {
            setEndDate(undefined); // Reset end date
            toast.error("Invalid date time", {
                description: "Start date must be before end date",
            });
        }
    };

    // Handle when the end date changes
    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        // If the end date is before the current start date, reset the start date
        if (date && startDate && isBefore(date, startDate)) {
            setStartDate(undefined); // Reset start date
            toast.error("Invalid date time", {
                description: "End date must be after start date",
            });
        }
    };

    return (
        <div className="flex items-center">
            <p className="mx-2">From</p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                            format(startDate, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <p className="mx-2">To</p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                            format(endDate, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export { DateRangePicker };

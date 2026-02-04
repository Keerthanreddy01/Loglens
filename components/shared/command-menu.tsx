"use client";

import React, { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/ui/command";
import {
    Activity,
    LayoutDashboard,
    Settings,
    Shield,
    Terminal,
    Trash,
    Download,
    Eye
} from "lucide-react";
import { useLogStore } from "@/lib/store";
import { toast } from "sonner";

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const { setLevelFilter, setActiveTab, clearLogs } = useLogStore();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        command();
        setOpen(false);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => runCommand(() => setActiveTab("overview"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Go to Overview</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setActiveTab("analytics"))}>
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Go to Analytics</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setActiveTab("live-logs"))}>
                        <Terminal className="mr-2 h-4 w-4" />
                        <span>Go to Live Logs</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Quick Filters">
                    <CommandItem onSelect={() => runCommand(() => setLevelFilter(["ERROR"]))}>
                        <Shield className="mr-2 h-4 w-4 text-destructive" />
                        <span>Show Errors Only</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setLevelFilter(["WARN"]))}>
                        <Shield className="mr-2 h-4 w-4 text-warning" />
                        <span>Show Warnings Only</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setLevelFilter(["ERROR", "WARN", "INFO", "DEBUG", "TRACE"]))}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Show All Logs</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                    <CommandItem onSelect={() => runCommand(() => {
                        clearLogs();
                        toast.success("Logs cleared");
                    })}>
                        <Trash className="mr-2 h-4 w-4 text-destructive" />
                        <span>Clear Current Logs</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => toast.info("Exporting logs..."))}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export Logs...</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}

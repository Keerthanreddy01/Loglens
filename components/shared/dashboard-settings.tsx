"use client";

import { useLogStore } from "../../store/useLogsStore";
import {
    Settings,
    Sparkles,
    Volume2,
    Layout,
    Moon,
    Maximize2,
    BellRing,
    Check
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { cn } from "../../lib/utils";
import { audioSystem } from "../../lib/audio";

export function DashboardSettings() {
    const {
        settings,
        updateSettings,
        viewMode,
        setViewMode,
        isAiInsightCollapsed,
        toggleAiInsightCollapsed
    } = useLogStore();

    const handleTestSound = () => {
        const volMap = { low: 0.2, medium: 0.5, high: 0.8 };
        audioSystem?.play('neutral', volMap[settings.volume]);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <Settings className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4 bg-card/95 backdrop-blur-xl border-border shadow-2xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Dashboard Settings
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {/* AI Insights Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    AI Insights
                                </Label>
                                <p className="text-[11px] text-muted-foreground">Show AI-powered log analysis</p>
                            </div>
                            <Switch
                                checked={settings.showAiInsights}
                                onCheckedChange={(checked) => updateSettings({ showAiInsights: checked })}
                            />
                        </div>

                        {/* Audio Alerts Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm flex items-center gap-2">
                                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                                    Audio Alerts
                                </Label>
                                <p className="text-[11px] text-muted-foreground">Subtle sounds for critical events</p>
                            </div>
                            <Switch
                                checked={settings.soundsEnabled}
                                onCheckedChange={(checked) => updateSettings({ soundsEnabled: checked })}
                            />
                        </div>

                        {settings.soundsEnabled && (
                            <div className="pl-6 space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex gap-1 flex-1">
                                        {['low', 'medium', 'high'].map((v) => (
                                            <Button
                                                key={v}
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "h-6 flex-1 text-[10px] capitalize",
                                                    settings.volume === v && "bg-primary/10 border-primary/50 text-primary"
                                                )}
                                                onClick={() => updateSettings({ volume: v as any })}
                                            >
                                                {v}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={handleTestSound}>
                                        Test
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* View Mode */}
                        <div className="space-y-3 pt-2 border-t border-border/50">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Display Density
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "h-8 gap-2 text-xs",
                                        viewMode === 'comfortable' && "bg-secondary border-primary/30"
                                    )}
                                    onClick={() => setViewMode('comfortable')}
                                >
                                    <Layout className="w-3.5 h-3.5" />
                                    Comfortable
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "h-8 gap-2 text-xs",
                                        viewMode === 'compact' && "bg-secondary border-primary/30"
                                    )}
                                    onClick={() => setViewMode('compact')}
                                >
                                    <Maximize2 className="w-3.5 h-3.5 scale-90" />
                                    Compact
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground text-center">
                            Settings are saved automatically to your profile.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

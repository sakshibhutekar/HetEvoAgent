"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState, type ReactNode } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SidebarContent } from "./sidebar"
import { Topbar } from "./topbar"

export function DashboardShell({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex min-h-screen bg-background">
                {/* Desktop sidebar */}
                <motion.aside
                    animate={{ width: collapsed ? 76 : 264 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border lg:block"
                >
                    <SidebarContent
                        collapsed={collapsed}
                        onToggleCollapse={() => setCollapsed((c) => !c)}
                    />
                </motion.aside>

                {/* Mobile sidebar */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent
                        side="left"
                        showCloseButton={false}
                        className="w-[264px] p-0"
                    >
                        <SidebarContent
                            variant="mobile"
                            collapsed={false}
                            onToggleCollapse={() => { }}
                        />
                    </SheetContent>
                </Sheet>

                {/* Main column */}
                <div
                    className={cn(
                        "flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]",
                    )}
                >
                    <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
                    <main className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mx-auto w-full max-w-[1600px] space-y-5 p-4 pt-6 md:p-6 md:pt-8"
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}

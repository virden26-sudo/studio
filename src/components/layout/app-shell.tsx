"use client";

import * as React from "react";
import {
  Book,
  Calendar,
  Home,
  Bot,
  Plus,
  Settings,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { mockUser } from "@/lib/mock-data";
import { Logo } from "@/components/icons";
import { AddAssignmentDialog } from "../dashboard/add-assignment-dialog";
import { IntelligentSchedulerDialog } from "../dashboard/intelligent-scheduler-dialog";

export function AppShell({ children, pageTitle }: { children: React.ReactNode, pageTitle: string }) {
  const pathname = usePathname();
  const [addAssignmentOpen, setAddAssignmentOpen] = React.useState(false);
  const [schedulerOpen, setSchedulerOpen] = React.useState(false);

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "#", icon: Book, label: "Assignments" },
    { href: "#", icon: Star, label: "Grades" },
    { href: "#", icon: Calendar, label: "Calendar" },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-headline">Agenda+</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
              <SidebarMenuItem>
                  <Button variant="default" className="w-full justify-start h-10" onClick={() => setAddAssignmentOpen(true)}>
                      <Plus className="mr-2 size-4" />
                      Add Assignment
                  </Button>
              </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className="mt-4">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="size-4 mr-2" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setSchedulerOpen(true)}
                    className="justify-start"
                  >
                    <Bot className="size-4 mr-2" />
                    AI Scheduler
                  </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
          <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton asChild className="justify-start">
                    <Link href="#">
                      <Settings className="size-4 mr-2" />
                      Settings
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto justify-start">
                      <Avatar className="size-8 mr-2"><AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint="person portrait" /><AvatarFallback>{mockUser.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                      <div className="flex flex-col items-start">
                        <span>{mockUser.name}</span>
                        <span className="text-xs text-muted-foreground">View Profile</span>
                      </div>
                  </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sticky top-0 z-30 lg:h-[60px] lg:px-6">
          <SidebarTrigger />
          <h1 className="flex-1 text-lg font-semibold md:text-xl font-headline">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setAddAssignmentOpen(true)}>
              <Plus className="size-4" />
              <span className="sr-only">Add Assignment</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
      <AddAssignmentDialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen} />
      <IntelligentSchedulerDialog open={schedulerOpen} onOpenChange={setSchedulerOpen} />
    </SidebarProvider>
  );
}

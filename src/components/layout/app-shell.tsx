"use client";

import * as React from "react";
import {
  Book,
  Calendar,
  Star,
  Bot,
  Plus,
  Settings,
  User as UserIcon,
  FileUp,
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
  SheetHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { AddAssignmentDialog } from "../dashboard/add-assignment-dialog";
import { IntelligentSchedulerDialog } from "../dashboard/intelligent-scheduler-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImportSyllabusDialog } from "../dashboard/import-syllabus-dialog";

export function AppShell({ children }: { children: React.ReactElement }) {
  const pathname = usePathname();
  const [addAssignmentOpen, setAddAssignmentOpen] = React.useState(false);
  const [schedulerOpen, setSchedulerOpen] = React.useState(false);
  const [importSyllabusOpen, setImportSyllabusOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [namePromptOpen, setNamePromptOpen] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [isUserLoaded, setIsUserLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("agendaUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setNamePromptOpen(true);
      }
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
      setNamePromptOpen(true);
    } finally {
      setIsUserLoaded(true);
    }
  }, []);

  const handleNameSave = () => {
    if (nameInput.trim()) {
      const newUser: User = {
        name: nameInput.trim(),
        avatarUrl: `https://picsum.photos/seed/${nameInput.trim()}/100/100`,
      };
      localStorage.setItem("agendaUser", JSON.stringify(newUser));
      setUser(newUser);
      setNamePromptOpen(false);
      setNameInput('');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(" ").map(n => n[0]).join("");
  }
  
  const handlePortalClick = () => {
    window.open("https://navigate.nu.edu/d2l/home/23776", "_blank");
  };

  const MobileSidebarHeader = (
    <SheetHeader className="border-b p-4">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Logo className="h-6 w-6" />
        <span className="font-headline text-gradient">Agenda+</span>
      </Link>
    </SheetHeader>
  );

  const navItems = [
    { href: "/assignments", icon: Book, label: "Assignments" },
    { href: "/grades", icon: Star, label: "Grades" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
  ];

  const pageTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/assignments': 'Assignments',
    '/grades': 'Grades',
    '/calendar': 'Calendar',
  };
  
  const pageTitle = pageTitles[pathname] || "";

  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar mobileSidebarHeader={MobileSidebarHeader}>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold p-2">
              <Logo className="h-6 w-6" />
              <span className="font-headline group-data-[collapsible=icon]:hidden text-gradient">Agenda+</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
              <SidebarMenuItem>
                  <Button variant="default" className="w-full justify-start h-10" onClick={() => setAddAssignmentOpen(true)}>
                      <Plus className="mr-2 size-4" />
                      <span className="group-data-[collapsible=icon]:hidden">Add Assignment</span>
                  </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <Button variant="secondary" className="w-full justify-start h-10" onClick={() => setImportSyllabusOpen(true)}>
                      <FileUp className="mr-2 size-4" />
                      <span className="group-data-[collapsible=icon]:hidden">Import Syllabus</span>
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
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4 mr-2" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setSchedulerOpen(true)}
                    className="justify-start"
                    tooltip="AI Scheduler"
                  >
                    <Bot className="size-4 mr-2" />
                    <span className="group-data-[collapsible=icon]:hidden">AI Scheduler</span>
                  </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
          <SidebarMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start" tooltip="Settings">
                        <Settings className="size-4 mr-2" />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="top" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setNamePromptOpen(true)}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePortalClick}>
                  University Portal
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <SidebarMenuItem>
                <SidebarMenuButton className="h-auto justify-start" onClick={() => setNamePromptOpen(true)}>
                    <Avatar className="size-8 mr-2">
                      {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || ''} data-ai-hint="person portrait" />}
                      <AvatarFallback>{user ? getInitials(user.name) : <UserIcon/>}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                        {user ? (
                            <>
                                <span className="text-gradient">{user.name}</span>
                                <span className="text-xs text-muted-foreground">View Profile</span>
                            </>
                        ) : (
                            <span className="text-gradient">Set User</span>
                        )}
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-30 lg:h-[60px] lg:px-6">
          <SidebarTrigger />
          <h1 className="flex-1 text-lg font-semibold md:text-xl font-headline text-gradient">{pageTitle}</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="md-hidden" onClick={() => setAddAssignmentOpen(true)}>
              <Plus className="size-4" />
              <span className="sr-only">Add Assignment</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           {React.cloneElement(children, { user, setImportSyllabusOpen })}
        </main>
      </SidebarInset>
      <AddAssignmentDialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen} />
      <IntelligentSchedulerDialog open={schedulerOpen} onOpenChange={setSchedulerOpen} />
      <ImportSyllabusDialog open={importSyllabusOpen} onOpenChange={setImportSyllabusOpen} />
      <Dialog open={namePromptOpen} onOpenChange={(isOpen) => {
        if (user) {
          setNamePromptOpen(isOpen);
        }
      }}>
        <DialogContent onInteractOutside={(e) => {if (!user) e.preventDefault()}}>
            <DialogHeader>
                <DialogTitle>Welcome to Agenda+</DialogTitle>
                <DialogDescription>Please enter your name to personalize your experience.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
                <Label htmlFor="name">Name</Label>
                <Input 
                    id="name" 
                    placeholder="e.g. Alex Doe"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                />
            </div>
            <DialogFooter>
                <Button onClick={handleNameSave} disabled={!nameInput.trim()}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

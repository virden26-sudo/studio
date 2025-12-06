

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
  SheetTitle,
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

  React.useEffect(() => {
    const storedUser = localStorage.getItem("agendaUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setNamePromptOpen(true);
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
    return name.split(" ").map(n => n[0]).join("");
  }
  
  const handlePortalClick = () => {
    window.open("https://navigate.nu.edu/d2l/home/23776", "_blank");
  };

  const MobileSidebarHeader = (
    <SheetHeader className="border-b p-2">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Logo className="h-6 w-6" />
        <SheetTitle>
          <span className="font-headline">Agenda+</span>
        </SheetTitle>
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
  
  const pageTitle = pageTitles[pathname] || "Dashboard";
  const showPageTitle = pathname !== '/';

  return (
    <SidebarProvider>
      <Sidebar mobileSidebarHeader={MobileSidebarHeader}>
        <SidebarHeader className="border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6" />
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
              <SidebarMenuItem>
                  <Button variant="secondary" className="w-full justify-start h-10" onClick={() => setImportSyllabusOpen(true)}>
                      <FileUp className="mr-2 size-4" />
                      Import Syllabus
                  </Button>
              </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className="mt-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                className="justify-start"
              >
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start">
                        <Settings className="size-4 mr-2" />
                        Settings
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
                      {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />}
                      <AvatarFallback>{user ? getInitials(user.name) : <UserIcon/>}</AvatarFallback>
                    </Avatar>
                    {user ? (
                      <div className="flex flex-col items-start">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">View Profile</span>
                      </div>
                    ) : (
                      <span>Set User</span>
                    )}
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sticky top-0 z-30 lg:h-[60px] lg:px-6">
          <SidebarTrigger />
          {showPageTitle && <h1 className="flex-1 text-lg font-semibold md:text-xl font-headline">{pageTitle}</h1>}
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setAddAssignmentOpen(true)}>
              <Plus className="size-4" />
              <span className="sr-only">Add Assignment</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {React.cloneElement(children, { user })}
        </main>
      </SidebarInset>
      <AddAssignmentDialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen} />
      <IntelligentSchedulerDialog open={schedulerOpen} onOpenChange={setSchedulerOpen} />
      <ImportSyllabusDialog open={importSyllabusOpen} onOpenChange={setImportSyllabusOpen} />
      <Dialog open={namePromptOpen} onOpenChange={nameInput ? setAddAssignmentOpen : () => {}}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
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
                <Button onClick={handleNameSave}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

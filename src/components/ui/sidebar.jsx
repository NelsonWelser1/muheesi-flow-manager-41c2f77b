
import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext({});

export function Sidebar({ className, children, ...props }) {
  return (
    <aside
      className={cn("w-64 h-screen border-r bg-background", className)}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("h-14 border-b px-4 flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({ className, children, ...props }) {
  return (
    <div className={cn("h-full py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("h-14 border-t px-4 flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroup({ className, children, ...props }) {
  return (
    <div className={cn("px-2 py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ className, children, ...props }) {
  return (
    <h4
      className={cn("mb-2 px-2 text-sm font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

export function SidebarGroupContent({ className, children, ...props }) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({ className, children, ...props }) {
  return (
    <nav className={cn("space-y-1", className)} {...props}>
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ className, children, ...props }) {
  return (
    <div className={cn("px-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenuButton({ className, children, ...props }) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex h-screen">
        {isOpen && children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext);

  return (
    <button
      className="fixed top-4 left-4 z-50 rounded-full w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? "×" : "☰"}
    </button>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

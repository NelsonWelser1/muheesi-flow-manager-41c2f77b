
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { navItems } from '../nav-items';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate('/auth');
  };
  
  const dashboardNavItems = [
    {
      to: "/manage-inventory",
      label: "Manage Inventory"
    }, 
    {
      to: "/manage-companies",
      label: "Manage Companies"
    }
  ];

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-futuristic">
          Muheesi GKK Integrated System
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          {user && (
            <>
              {dashboardNavItems.map(item => (
                <Button 
                  key={item.to} 
                  asChild 
                  className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white font-bold"
                >
                  <Link to={item.to}>{item.label}</Link>
                </Button>
              ))}
              
              {navItems.map(item => item.to !== "/" && (
                <Button 
                  key={item.to} 
                  asChild 
                  className={`${location.pathname === item.to ? 'bg-[#7a5af8]' : 'bg-[#9b87f5]'} hover:bg-[#7a5af8] text-white font-bold`}
                >
                  <Link to={item.to}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </Link>
                </Button>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        <div className="md:hidden">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Menu /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {dashboardNavItems.map(item => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                {navItems.map(item => item.to !== "/" && (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to}>
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

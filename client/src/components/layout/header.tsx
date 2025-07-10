import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/about", label: "협의회 소개" },
  { href: "/business", label: "사업소개" },
  { href: "/members", label: "회원기관" },
  { href: "/announcements", label: "공지사항" },
  { href: "/donation", label: "후원안내" },
];

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-dark-gray">한국아동청소년그룹홈협의회</h1>
              <p className="text-sm text-medium-gray">인천지부</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`font-medium transition-colors ${
                  location === item.href 
                    ? "text-primary" 
                    : "text-dark-gray hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Login Button (Desktop) */}
          {!isAuthenticated && (
            <Button 
              onClick={handleLogin}
              className="hidden md:flex"
              size="sm"
            >
              로그인
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      location === item.href 
                        ? "text-primary" 
                        : "text-dark-gray hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <Button 
                    onClick={handleLogin}
                    className="mt-6"
                    size="sm"
                  >
                    로그인
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

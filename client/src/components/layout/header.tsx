import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, ChevronDown } from "lucide-react";

const navItems = [
  { href: "/", label: "홈" },
  { 
    href: "/about", 
    label: "협의회 소개",
    submenu: [
      { href: "/about/group-home", label: "그룹홈 소개" },
      { href: "/about/association", label: "협의회 소개" },
      { href: "/about/organization", label: "조직 현황" }
    ]
  },
  { href: "/business", label: "사업소개" },
  { 
    href: "/members", 
    label: "회원기관",
    submenu: [
      { href: "/members/notices", label: "회원공지" },
      { href: "/members/communication", label: "소통공간" },
      { href: "/members/application", label: "사업신청" }
    ]
  },
  { 
    href: "/announcements", 
    label: "공지사항",
    submenu: [
      { href: "/announcements/general", label: "열린공지" },
      { href: "/announcements/jobs", label: "채용공고" }
    ]
  },
  { href: "/donation", label: "후원안내" },
];

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
              <div key={item.href} className="relative group">
                <Link 
                  href={item.href}
                  className={`font-medium transition-colors flex items-center space-x-1 ${
                    location === item.href || (item.submenu && item.submenu.some(sub => location === sub.href))
                      ? "text-primary" 
                      : "text-dark-gray hover:text-primary"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.submenu && <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />}
                </Link>
                
                {/* Dropdown Menu */}
                {item.submenu && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            location === subItem.href
                              ? "text-primary bg-primary/5"
                              : "text-dark-gray hover:text-primary hover:bg-gray-50"
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          

          
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
                  <div key={item.href} className="space-y-2">
                    <Link 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors flex items-center space-x-1 ${
                        location === item.href || (item.submenu && item.submenu.some(sub => location === sub.href))
                          ? "text-primary" 
                          : "text-dark-gray hover:text-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                    
                    {/* Mobile Submenu */}
                    {item.submenu && (
                      <div className="ml-4 space-y-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className={`block text-base transition-colors ${
                              location === subItem.href
                                ? "text-primary"
                                : "text-medium-gray hover:text-primary"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

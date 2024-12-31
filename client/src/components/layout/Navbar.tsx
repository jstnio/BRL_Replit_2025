import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Globe, UserCircle2 } from "lucide-react";

const navItems = [
  { label: "nav.home", href: "/" },
  { label: "nav.services", href: "/services" },
  { label: "nav.about", href: "/about" },
  { label: "nav.contact", href: "/contact" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/BRL_vector.png" 
              alt="BRL Global" 
              className="h-8 w-auto object-contain"
              loading="eager"
              style={{ maxWidth: '200px' }}
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(item.label)}
              </span>
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="cursor-pointer"
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost">{t('nav.login')}</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="ghost">{t('nav.register')}</Button>
            </Link>
            <Button>{t('nav.getQuote')}</Button>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary cursor-pointer ${
                      location === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(item.label)}
                  </span>
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.register')}
                  </Button>
                </Link>
                <Button className="w-full" onClick={() => setIsOpen(false)}>
                  {t('nav.getQuote')}
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Search, ShoppingCart, Menu, User, Store, Heart, Package, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as UserType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { getCartCount } from '@/lib/cart';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial cart count
    setCartCount(getCartCount());

    // Get initial user
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        // Fetch user profile
        supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
          .then(({ data }) => {
            setUser(data);
          });
      }
    });

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };
    window.addEventListener('cart-updated', handleCartUpdate);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser(data);
          });
      } else {
        setUser(null);
      }
    });

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="hidden md:block border-b bg-muted/50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">📍 Serving all PNG Provinces</span>
            <span className="text-muted-foreground">📞 Support: +675 XXX XXXX</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/seller/register" className="hover:text-primary transition-colors">
              Become a Seller
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors">
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/marketplace" className="text-lg hover:text-primary">
                  Marketplace
                </Link>
                <Link href="/categories" className="text-lg hover:text-primary">
                  Categories
                </Link>
                <Link href="/sellers" className="text-lg hover:text-primary">
                  Sellers
                </Link>
                <Link href="/about" className="text-lg hover:text-primary">
                  About
                </Link>
                <div className="pt-4 border-t">
                  <Link href="/seller/register" className="text-lg font-semibold text-primary">
                    Become a Seller
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="PNG SME Market"
              className="h-12 w-auto md:h-14"
            />
            <div className="hidden sm:block">
              <div className="text-xl md:text-2xl font-bold leading-none">SME Marketplace</div>
              <div className="text-xs font-normal text-muted-foreground">Empowering PNG Businesses</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, services, or sellers..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/sellers" className="text-sm font-medium hover:text-primary transition-colors">
              Sellers
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user ? (
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                        {getUserInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <Badge className="w-fit mt-1" variant="secondary">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard" className="cursor-pointer flex items-center gap-2 font-semibold text-primary">
                          <Store className="h-4 w-4" />
                          Seller Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(user.role === 'admin' || user.role === 'council_admin') && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer flex items-center gap-2 font-semibold text-purple-600">
                          <Settings className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="cursor-pointer">
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/seller/register" className="cursor-pointer flex items-center gap-2 font-semibold text-primary">
                        <Store className="h-4 w-4" />
                        Become a Seller
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

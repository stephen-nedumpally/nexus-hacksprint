'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-rise.jpg" alt="Rise Logo" width={32} height={32} className="rounded" />
          <span className="text-lg font-semibold text-white">Rise</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link href="/startups" className="text-sm text-zinc-400 transition hover:text-white">
            Startups
          </Link>
          <Link href="/study-groups" className="text-sm text-zinc-400 transition hover:text-white">
            Study Groups
          </Link>
          <Link href="/forums" className="text-sm text-zinc-400 transition hover:text-white">
            Forums
          </Link>
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{session.user?.name?.[0] || session.user?.email?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => signIn('google')}
                className="text-zinc-400 hover:text-white"
              >
                Sign In
              </Button>
              <Link href="/auth/signin">
                <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden border-t border-white/10 bg-black/50 backdrop-blur-xl`}
      >
        <div className="space-y-1 px-4 py-3">
          <Link
            href="/startups"
            className="block rounded-lg px-3 py-2 text-base text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            Startups
          </Link>
          <Link
            href="/study-groups"
            className="block rounded-lg px-3 py-2 text-base text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            Study Groups
          </Link>
          <Link
            href="/forums"
            className="block rounded-lg px-3 py-2 text-base text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            Forums
          </Link>
        </div>
        <div className="border-t border-white/10 px-4 py-3">
          {session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-lime-400" />
                )}
                <div>
                  <div className="font-medium text-white">{session.user?.name}</div>
                  <div className="text-sm text-zinc-400">{session.user?.email}</div>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => signOut()}
                className="w-full bg-red-950 text-red-50 hover:bg-red-900"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => signIn('google')}
                className="w-full text-zinc-400 hover:text-white"
              >
                Sign In
              </Button>
              <Link href="/auth/signin" className="block">
                <Button className="w-full bg-lime-400 text-black hover:bg-lime-400/90">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

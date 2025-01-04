'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            Community Hub
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/startups" className="text-gray-300 hover:text-white">
              Startups
            </Link>
            <Link href="/study-groups" className="text-gray-300 hover:text-white">
              Study Groups
            </Link>
            {session?.user ? (
              <>
                <Link href="/my-applications" className="text-gray-300 hover:text-white">
                  My Applications
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-lime-400/50">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || ''}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-lime-400/20 flex items-center justify-center text-lime-400">
                          {session.user.name?.[0] || 'U'}
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/90 border border-white/10">
                    <div className="px-2 py-1.5 text-sm text-gray-400">
                      Signed in as {session.user.email}
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="text-red-400 focus:text-red-400 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="default" className="bg-lime-400 text-black hover:bg-lime-400/90">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

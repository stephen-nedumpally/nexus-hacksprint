"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RocketIcon, PersonIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import {
  StatsFloatingCard,
  OpportunityFloatingCard,
  StudyGroupFloatingCard,
  StartupFloatingCard,
  StudentFloatingCard,
  AchievementFloatingCard,
  HackathonFloatingCard,
  InnovationFloatingCard,
} from '@/components/ui/floating-card';
import { FeatureCard } from "@/components/ui/feature-card";
import { FeatureSection } from "@/components/ui/feature-section";
import { StatsCard } from "@/components/ui/stats-card";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/collaborate.jpg"
            alt="Students collaborating"
            fill
            className="object-cover brightness-60 rounded-3xl mt-8 py-3"
            priority
          />
        </div>
        <div className="relative">
          <div className="container mx-auto px-4 py-32">
            <div className="max-w-3xl backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Where College Students
                <span className="text-lime-400"> Rise Together</span>
              </h1>
              <p className="mb-8 text-lg text-zinc-300">
                Join a community of ambitious students going the extra mile. Connect with
                startup founders, join study groups, and create opportunities together.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-lime-400 text-black hover:bg-lime-400/90">
                    Get Started
                  </Button>
                </Link>
                <Link href="/startups">
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 border-t bg-white/4.5 mt-10 py-2 rounded-3xl overflow-hidden">
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-lime-400/20"
                style={{
                  width: `${(i + 1) * 300}px`,
                  height: `${(i + 1) * 300}px`,
                  animation: `pulse ${6 + i * 2}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  opacity: 0.1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Rise, Fast As Lightning</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connect with opportunities at the speed of thought! Elevate your college experience with our lightning-fast community platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <RocketIcon className="w-5 h-5" />,
                title: "Ignite Impact",
                description: "Start your journey by joining innovative projects and study groups that align with your passions."
              },
              {
                icon: <PersonIcon className="w-5 h-5" />,
                title: "Connect & Grow",
                description: "Build meaningful connections with peers and mentors who share your drive for excellence."
              },
              {
                icon: <ChatBubbleIcon className="w-5 h-5" />,
                title: "Learn Together",
                description: "Join study groups and discussions that accelerate your learning and career growth."
              }
            ].map((feature, i) => (
              <div key={i} className="relative p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-lime-400/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative space-y-4">
                  <div className="w-10 h-10 rounded-full bg-lime-400/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="mt-12 flex justify-center gap-4">
            <Link href="/auth/signin">
              <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
                Get Started
              </Button>
            </Link>
            <Link href="/startups">
              <Button variant="outline" className="border-lime-400/20 hover:bg-lime-400/10">
                View All
              </Button>
            </Link>
          </div> */}
        </div>

        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.2;
            }
          }
        `}</style>
      </section>

      {/* Featured Opportunities */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
            <Link href="/startups">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="TechStart: Web3 Project"
              description="Join a team building the next generation of decentralized applications."
              imageUrl="/project1.jpg"
              organization={{ name: "Tech Innovation Club", verified: true }}
              progress={{
                current: 8,
                total: 12,
                daysLeft: 5
              }}
            />
            <FeatureCard
              title="AI Study Group"
              description="Master machine learning concepts with peers through hands-on projects."
              imageUrl="/startup.jpg"
              organization={{ name: "AI Research Society", verified: true }}
              progress={{
                current: 15,
                total: 20,
                daysLeft: 3
              }}
            />
            <FeatureCard
              title="Startup Weekend"
              description="48-hour hackathon to build and pitch your startup idea."
              imageUrl="/startup.jpg"
              organization={{ name: "Entrepreneurship Cell", verified: true }}
              progress={{
                current: 45,
                total: 50,
                daysLeft: 7
              }}
            />
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Join Our Growing Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard number="10,000+" label="Active Students" />
            <StatsCard number="500+" label="Study Groups" />
            <StatsCard number="200+" label="Active Projects" />
            <StatsCard number="50+" label="Partner Universities" />
          </div>
        </div>
      </section>

      {/* Ready to Rise Section with Floating Cards */}
      <section className="relative overflow-hidden bg-black py-24">
        <div className="container relative z-10 mx-auto px-4">
          <div className="relative mx-auto rounded-2xl border border-lime-400/50 bg-black/50 p-8 backdrop-blur-xl">
            <div className="absolute inset-0 overflow-hidden">
              <StatsFloatingCard
                className="left-[5%] top-[15%] -rotate-6 transform opacity-20"
                style={{ animation: 'float 8s ease-in-out infinite' }}
              />
              <OpportunityFloatingCard
                className="right-[8%] top-[25%] rotate-3 transform opacity-20"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              />
              <StudyGroupFloatingCard
                className="bottom-[20%] left-[12%] rotate-6 transform opacity-20"
                style={{ animation: 'float 7s ease-in-out infinite' }}
              />
              <StartupFloatingCard
                className="bottom-[15%] right-[10%] -rotate-12 transform opacity-20"
                style={{ animation: 'float 9s ease-in-out infinite' }}
              />
              <StudentFloatingCard
                className="left-[35%] top-[10%] rotate-3 transform opacity-20"
                style={{ animation: 'float 10s ease-in-out infinite' }}
              />
              <AchievementFloatingCard
                className="right-[25%] top-[20%] -rotate-3 transform opacity-20"
                style={{ animation: 'float 11s ease-in-out infinite' }}
              />
              <HackathonFloatingCard
                className="left-[20%] bottom-[25%] rotate-6 transform opacity-20"
                style={{ animation: 'float 9.5s ease-in-out infinite' }}
              />
              <InnovationFloatingCard
                className="right-[15%] bottom-[30%] -rotate-6 transform opacity-20"
                style={{ animation: 'float 7.5s ease-in-out infinite' }}
              />
            </div>
            <div className="relative">
              <h2 className="mb-4 text-center text-3xl font-bold text-white">
                Ready to Rise?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-center text-zinc-400">
                Join a thriving community of ambitious students, innovative startups, and inspiring mentors. Your next big opportunity is just a click away.
              </p>
              <div className="flex justify-center">
                <Link href="/auth/signin">
                  <Button className="bg-lime-400 text-black hover:bg-lime-400/90">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="Rise Logo" width={40} height={40} />
                <span className="text-xl font-bold">Rise</span>
              </Link>
              <p className="text-sm text-gray-400">
                Elevating Student Experience & Seizing Control of Your Career Journey!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Donate</h3>
              <ul className="space-y-2">
                <li><Link href="/education" className="text-gray-400 hover:text-white">Education</Link></li>
                <li><Link href="/social" className="text-gray-400 hover:text-white">Social</Link></li>
                <li><Link href="/innovation" className="text-gray-400 hover:text-white">Innovation</Link></li>
                <li><Link href="/startups" className="text-gray-400 hover:text-white">Startups</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Help</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/accessibility" className="text-gray-400 hover:text-white">Accessibility</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400"> Rise Inc. {new Date().getFullYear()} All Rights Reserved.</p>
              <div className="flex space-x-4">
                <Link href="https://instagram.com" className="p-2 rounded-full border border-white/10 hover:bg-white/5">
                  <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
                </Link>
                <Link href="https://facebook.com" className="p-2 rounded-full border border-white/10 hover:bg-white/5">
                  <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
                </Link>
                <Link href="https://twitter.com" className="p-2 rounded-full border border-white/10 hover:bg-white/5">
                  <Image src="/twitter.svg" alt="Twitter" width={24} height={24} />
                </Link>
                <Link href="https://linkedin.com" className="p-2 rounded-full border border-white/10 hover:bg-white/5">
                  <Image src="/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

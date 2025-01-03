import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const features = [
  {
    title: "Startup Collaboration",
    description: "Join exciting startup projects or find talented developers for your startup idea.",
    href: "/startups",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Study Groups",
    description: "Learn together with peers in structured study groups across various technologies.",
    href: "/study-groups",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Community Forums",
    description: "Connect with the community through various discussion channels and forums.",
    href: "/forums",
    gradient: "from-orange-500 to-red-500",
  },
];

const stats = [
  { number: "500+", label: "Active Members" },
  { number: "50+", label: "Study Groups" },
  { number: "100+", label: "Projects" },
  { number: "1000+", label: "Discussions" },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-foreground/20 -z-10" />
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              Where Developers Unite
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a thriving community of developers. Collaborate on projects,
              learn together, and grow your skills with like-minded individuals.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signin">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/startups">Browse Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group/button" asChild>
                    <Link href={feature.href}>
                      Explore
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the community?</h2>
          <p className="text-lg mb-8 text-primary-foreground/80">
            Start collaborating with developers from around the world
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signin">Join Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Shield, Clock, Trophy, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About SportsBook</h1>
        <p className="text-lg text-muted-foreground">
          We make it easy for sports enthusiasts to find and book their perfect playing field.
          Whether you're organizing a friendly match or planning regular training sessions,
          we've got you covered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            To connect sports enthusiasts with quality sports facilities, making the booking
            process seamless and efficient. We believe that everyone should have easy access
            to sports facilities to maintain an active and healthy lifestyle.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/fields">Browse Fields</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img
            src="https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg"
            alt="Sports facilities"
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
            <p className="text-muted-foreground">
              We verify all facilities and maintain high standards for quality and safety.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">24/7 Booking</h3>
            <p className="text-muted-foreground">
              Book your preferred sports field anytime, anywhere with our easy-to-use platform.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Wide Coverage</h3>
            <p className="text-muted-foreground">
              Access sports facilities across multiple locations in your city.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-8">Why Choose SportsBook?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary/10 mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Join thousands of sports enthusiasts who book their fields through SportsBook.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Create Account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/fields">Browse Fields</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Users,
    title: "Easy Booking",
    description: "Simple and intuitive booking process for all users"
  },
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description: "Book fields for any duration that suits your needs"
  },
  {
    icon: Trophy,
    title: "Quality Venues",
    description: "Access to premium sports facilities and amenities"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and transparent payment processing"
  }
];
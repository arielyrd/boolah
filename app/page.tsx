import Link from "next/link";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/feature-card";
import { SportTypeFilter } from "@/components/sport-type-filter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Book Your Perfect Sports Field
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Easy booking for football, basketball, tennis, and more. Find and reserve your ideal sports field in minutes.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/fields">Browse Fields</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sport Type Filter */}
      <section className="py-8 md:py-10">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-6">Find Fields by Sport</h2>
          <SportTypeFilter />
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6">Popular Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularFields.map((field) => (
              <Link 
                href={`/fields/${field.id}`} 
                key={field.id}
                className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-colors hover:border-primary"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={field.imageUrl}
                    alt={field.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{field.name}</h3>
                    <div className="rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                      {field.sportType}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {field.location}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg font-semibold">${field.pricePerHour}/hour</div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/fields">View All Fields</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">How SportsBook Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Create an Account"
              description="Sign up in minutes and set up your profile to start booking fields"
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Find Available Fields"
              description="Search and filter fields by sport type, location, and amenities"
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Book Your Slot"
              description="Choose your preferred date and time slot for the selected field"
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Confirm and Play"
              description="Receive booking confirmation and enjoy your sport session"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Ready to Book Your Next Game?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Join thousands of sports enthusiasts who book their fields through SportsBook.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sample data
const popularFields = [
  {
    id: 1,
    name: "Downtown Soccer Field",
    sportType: "Football",
    location: "123 Main St, Downtown",
    pricePerHour: 60,
    imageUrl: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    name: "Elite Basketball Court",
    sportType: "Basketball",
    location: "456 Park Ave, Midtown",
    pricePerHour: 45,
    imageUrl: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    name: "Sunshine Tennis Center",
    sportType: "Tennis",
    location: "789 Oak St, Westside",
    pricePerHour: 35,
    imageUrl: "https://images.pexels.com/photos/2403303/pexels-photo-2403303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-lg font-bold">
            SportsBook
          </Link>
          <p className="text-sm text-muted-foreground">
            Book your favorite sports fields easily
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
          <Link href="/terms" className="hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            Contact Us
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SportsBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
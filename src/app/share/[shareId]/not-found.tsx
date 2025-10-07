import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="text-6xl mb-4">🎨</div>
        <h1 className="text-3xl font-bold text-primary mb-4">Image Not Found</h1>
        <p className="text-muted-foreground mb-8">
          This image might have been removed or the link is invalid.
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
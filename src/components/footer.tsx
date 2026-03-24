import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-tru-navy text-gray-400 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/logo-white.png"
              alt="TruTravels"
              className="h-10"
            />
            <p className="mt-2 text-sm">Leave Ordinary Behind</p>
            <p className="mt-1 text-xs text-gray-500">Life Changing Experiences.<br />Game Changing Travel.</p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-heading">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/destinations" className="block hover:text-tru-pink transition">Destinations</Link>
              <Link href="/stories" className="block hover:text-tru-pink transition">Stories</Link>
              <Link href="/about" className="block hover:text-tru-pink transition">About Us</Link>
            </div>
          </div>

          {/* Members */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-heading">Members</h4>
            <div className="space-y-2 text-sm">
              <Link href="/login" className="block hover:text-tru-pink transition">Log In</Link>
              <Link href="/signup" className="block hover:text-tru-pink transition">Join Free</Link>
              <Link href="/member/dashboard" className="block hover:text-tru-pink transition">Dashboard</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-heading">Follow Us</h4>
            <div className="space-y-2 text-sm">
              <p className="hover:text-tru-pink transition cursor-pointer">Instagram</p>
              <p className="hover:text-tru-pink transition cursor-pointer">TikTok</p>
              <p className="hover:text-tru-pink transition cursor-pointer">YouTube</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} TruTravels. All rights reserved.</p>
          <p className="mt-2 text-gray-600 italic">
            We are awesome. You will have a ridiculous amount of fun if you travel with us.
          </p>
        </div>
      </div>
    </footer>
  );
}

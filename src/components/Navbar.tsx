import ww from "../assets/ww.png";
import { Twitter, Heart } from "lucide-react";

const Navbar = () => {
  return (
    <div className="font-geist-mono py-6 mx-4">
      <div className="px-4 flex items-center justify-between bg-white/10 backdrop-blur-lg p-3 max-w-6xl mx-auto rounded-2xl">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <img src={ww} alt="Logo" className="h-10 w-10" />
          <h1 className="font-medium text-xl">Web Wrapped</h1>
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <a
            href="https://x.com/abi_dzn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm hover:bg-white/10"
          >
            <Twitter className="h-5 w-5" />
            <span className="hidden sm:inline">Message Me</span>
          </a>
          <a
            href="https://www.paypal.com/paypalme/abisheks7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm hover:bg-white/10"
          >
            <Heart className="h-5 w-5" />
            <span className="hidden sm:inline">Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

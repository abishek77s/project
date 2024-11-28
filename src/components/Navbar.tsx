import ww from "../assets/ww.png";
import { TwitterIcon, Heart } from "lucide-react";
const Navbar = () => {
  return (
    <div className="font-geist-mono py-6 mx-4">
      <div className="px-4 flex items-center justify-between bg-white/10 backdrop-blur-lg p-3 max-w-6xl mx-auto rounded-2xl ">
        <div className="flex items-center gap-4  ">
          <img src={ww} className="size-10 " />{" "}
          <h1 className=" font-medium text-xl ">Web Wrapped</h1>
        </div>
        <div className="flex ">
          <a
            href="https://x.com/abi_dzn"
            target="_blank"
            className="flex items-center gap-2 px-4 p-2 rounded-xl hover:bg-white/10"
          >
            <TwitterIcon /> Message Me
          </a>
          <a
            href="https://www.paypal.com/paypalme/abisheks7"
            target="_blank"
            className="flex items-center gap-2 px-4 p-2 rounded-xl hover:bg-white/10"
          >
            <Heart /> Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

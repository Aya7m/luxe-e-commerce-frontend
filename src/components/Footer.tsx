import {

  
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">

        <div>
          <h2 className="mb-4 text-2xl font-bold">
            Luxury Cart
          </h2>

          <p className="text-sm text-gray-400">
            Discover premium fashion and accessories with
            a seamless shopping experience.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/products">Products</Link>
            </li>

            <li>
              <Link to="/cart">Cart</Link>
            </li>

            <li>
              <Link to="/orders">Orders</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">
            Customer Service
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">
            Contact Us
          </h3>

          <div className="space-y-3 text-gray-400">

            <div className="flex items-center gap-2">
              <Mail size={16} />
              support@luxurycart.com
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} />
              +20 155 861 1828
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              Cairo, Egypt
            </div>

            {/* <div className="mt-4 flex gap-4">
              <FaceBook size={20} />
              <Instagram size={20} />
              <Twitter size={20} />
            </div> */}
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Luxury Cart.
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
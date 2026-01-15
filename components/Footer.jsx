"use client";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  ChevronUp,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdesaLogoWithSlogan from "./logo/AdesaLogoWithSlogan";

const quickLinks = [
  { label: "Home", type: "route", path: "/" },
  { label: "About Us", type: "scroll", id: "about" },
  { label: "Solutions", type: "scroll", id: "solutions" },
  { label: "Savings Calculator", type: "scroll", id: "calculator" },
  { label: "Resources", type: "route", path: "/resources" },
  { label: "Blog", type: "route", path: "/blog" },
  { label: "Contact", type: "scroll", id: "contact" },
];

const Footer = ({ onNavClick }) => {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (item) => {
    if (item.type === "scroll") {
      onNavClick(item.id);
    } else {
      router.push(item.path);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo */}
          <div>
            <AdesaLogoWithSlogan />
            <p className="text-gray-400 mb-4 max-w-xs">
              Powering progress, fueling tomorrow.
            </p>
            <div className="flex space-x-4">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#F37621]"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <ChevronRight className="w-4 h-4 mr-2 text-[#59C6E5]" />
              Quick links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => handleLinkClick(item)}
                    className="text-gray-400 hover:text-[#F37621] flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-[#59C6E5]" />
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Wrench className="w-4 h-4 mr-2 text-[#F37621]" />
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Mobile CNG conversion",
                "On-demand refueling",
                "Fleet solutions",
              ].map((service) => (
                <li key={service}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onNavClick("solutions")}
                    className="text-gray-400 hover:text-[#F37621]"
                  >
                    {service}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#59C6E5]" />
              Contact
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#F37621]" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#F37621]" />
                <span>+234 812 345 6789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#F37621]" />
                <span>info@adesaenergy.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-[#F37621]" />
                <span>www.adesaenergy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Adesa Energy. All rights reserved.
        </div>
      </div>

      {showScrollTop && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#22244E] flex items-center justify-center"
        >
          <ChevronUp />
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;

// src/components/ui/Footer.jsx
import Link from "next/link";
import {
  TbBuildingEstate,
  TbBrandX,
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbMail,
  TbPhone,
  TbMapPin,
} from "react-icons/tb";

const footerLinks = {
  Platform: [
    { label: "Browse Properties", href: "/properties" },
    { label: "List Your Property", href: "/register" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <TbBuildingEstate className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                RentEasy
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              The easiest way to find and book your perfect rental property.
              Connecting tenants with trusted property owners since 2024.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <TbMail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>hello@renteasy.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <TbPhone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <TbMapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>San Francisco, CA 94102</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-6">
              <a
                href="https://x.com/renteasy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="p-2 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200"
              >
                <TbBrandX className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/renteasy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200"
              >
                <TbBrandFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/renteasy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200"
              >
                <TbBrandInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/renteasy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200"
              >
                <TbBrandLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 font-heading">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} RentEasy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
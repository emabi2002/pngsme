import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.svg"
                alt="PNG SME Market"
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl">SME Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering Papua New Guinea's small and medium enterprises through digital commerce and business support.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Product Categories
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Sellers
                </Link>
              </li>
              <li>
                <Link href="/how-to-buy" className="text-muted-foreground hover:text-primary transition-colors">
                  How to Buy
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-muted-foreground hover:text-primary transition-colors">
                  Delivery Information
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/seller/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-muted-foreground hover:text-primary transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-muted-foreground hover:text-primary transition-colors">
                  Training & Resources
                </Link>
              </li>
              <li>
                <Link href="/seller/guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Seller Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Port Moresby, NCD<br />Papua New Guinea</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+675 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@pngsme.market</span>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>
              © {currentYear} PNG SME Marketplace. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

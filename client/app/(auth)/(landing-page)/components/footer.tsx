import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1000px] px-4 md:px-14 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
        <div className="max-w-full md:max-w-[280px]">
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm text-[#424242]/60 leading-relaxed">
            Transform Excel files into web apps instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-12 lg:gap-24">
          <div>
            <p className="mb-3 md:mb-4 text-sm font-semibold text-[#424242]">
              Product
            </p>
            <ul className="space-y-2 text-sm text-[#424242]/60">
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 md:mb-4 text-sm font-semibold text-[#424242]">
              Resources
            </p>
            <ul className="space-y-2 text-sm text-[#424242]/60">
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 md:mb-4 text-sm font-semibold text-[#424242]">
              Company
            </p>
            <ul className="space-y-2 text-sm text-[#424242]/60">
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 md:mb-4 text-sm font-semibold text-[#424242]">
              Legal
            </p>
            <ul className="space-y-2 text-sm text-[#424242]/60">
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0d7239]">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}


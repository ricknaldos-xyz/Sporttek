'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, Menu, X } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'

const navLinks = [
  { href: '#features', label: 'Ecosistema', mobile: true },
  { href: '#services', label: 'Servicios', mobile: true },
  { href: '#pricing', label: 'Precios', mobile: true },
  { href: '#faq', label: 'FAQ', mobile: false },
]

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/40">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Target className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">SportTek</span>
          </Link>

          {/* Desktop Navigation — Center Pill */}
          <div className="hidden md:flex items-center gap-1 bg-secondary rounded-full px-2 py-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-1.5 text-muted-foreground hover:text-foreground transition-all text-sm font-medium rounded-full hover:bg-background"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth — Single CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Iniciar sesion
            </Link>
            <GlassButton variant="default" size="sm" asChild>
              <Link href="/register">Comenzar gratis</Link>
            </GlassButton>
          </div>

          {/* Mobile Menu Button */}
          <GlassButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </GlassButton>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border/40 mt-4">
            <div className="flex flex-col gap-2">
              {navLinks.filter((l) => l.mobile).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-muted-foreground hover:text-foreground transition-all py-3 px-4 rounded-full hover:bg-secondary"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-border/40 my-2" />
              <GlassButton variant="ghost" asChild className="justify-start">
                <Link href="/login">Iniciar sesion</Link>
              </GlassButton>
              <GlassButton variant="default" asChild>
                <Link href="/register">Comenzar gratis</Link>
              </GlassButton>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

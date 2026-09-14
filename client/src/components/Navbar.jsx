import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, CloudSun } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/', label: 'Weather' },
  { to: '/history', label: 'Saved Searches' },
  { to: '/map', label: 'Map' },
  { to: '/about', label: 'About' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-amber ${
      isActive ? 'text-ink dark:text-white' : 'text-mist'
    }`

  return (
    <header className="sticky top-0 z-40 bg-sky/90 dark:bg-night/90 backdrop-blur border-b border-slate-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <CloudSun size={22} className="text-amber" />
          Weather Intelligence
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-200 dark:border-white/10 px-4 py-3 flex flex-col gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  )
}

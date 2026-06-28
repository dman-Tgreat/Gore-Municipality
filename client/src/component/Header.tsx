'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, type LocaleCode } from '@/context/LocaleContext';
import { locales } from '@/i18n/messages';
import { departmentsApi, projectsApi, type Department, type Project } from '@/lib/api';

// ── Types ──

interface DropdownItem {
  key: string;
  href: string;
  icon: string;
  section: 'invest' | 'news' | 'services' | 'projects';
}

interface DynamicDropdownItem {
  href: string;
  label: string;
  icon: string;
}

interface NavDropdownProps {
  items: DropdownItem[];
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  pathname: string;
  t: any;
  dynamicItems?: DynamicDropdownItem[];
  dynamicLabel?: string;
}

// ── Static items ──

const dropdownItems: DropdownItem[] = [
  // News
  { key: 'title', href: '/news', icon: '📰', section: 'news' },
  { key: 'announcements', href: '/news?tab=announcements', icon: '📢', section: 'news' },
  // Services (static "view all" entry, dynamic items added separately)
  { key: 'municipalServices', href: '/service', icon: '🏛️', section: 'services' },
  // Investment & Tourism
  { key: 'overview', href: '/investment-tourism', icon: '📋', section: 'invest' },
  { key: 'opportunities', href: '/investment-tourism/opportunities', icon: '💼', section: 'invest' },
  { key: 'incentives', href: '/investment-tourism/incentives', icon: '⭐', section: 'invest' },
  { key: 'attractions', href: '/investment-tourism/attractions', icon: '🌿', section: 'invest' },
  { key: 'accommodation', href: '/investment-tourism/accommodation', icon: '🏨', section: 'invest' },
  // Projects (static "view all" entry, dynamic items added separately)
  { key: 'title', href: '/projects', icon: '📊', section: 'projects' },
];

// ── NavDropdown Component ──

function NavDropdown({ items, label, isActive, isOpen, onToggle, onClose, pathname, t, dynamicItems, dynamicLabel }: NavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const isActiveItem = (href: string) =>
    pathname === href || (href !== '/news' && href !== '/service' && href !== '/projects' && href !== '/investment-tourism' && pathname.startsWith(href));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
        className={`flex items-center gap-1 transition font-medium text-sm whitespace-nowrap ${
          isActive
            ? 'text-red-600 font-bold border-b-2 border-red-600 pb-1'
            : 'text-gray-600 hover:text-red-600'
        }`}
      >
        {label}
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50"
          onMouseLeave={onClose}
        >
          {/* Static items */}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                isActiveItem(item.href)
                  ? 'text-red-600 bg-red-50 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.key === 'title' ? label : item.key === 'announcements' ? t.announcements.title : item.key === 'municipalServices' ? t.services.municipalServices : t.investmentTourism[item.key as keyof typeof t.investmentTourism]}
            </Link>
          ))}

          {/* Dynamic items divider + items */}
          {dynamicItems && dynamicItems.length > 0 && (
            <>
              <div className="border-t border-gray-100 my-1" />
              {dynamicLabel && (
                <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {dynamicLabel}
                </p>
              )}
              {dynamicItems.map((dyn) => (
                <Link
                  key={dyn.href}
                  href={dyn.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition ${
                    pathname === dyn.href
                      ? 'text-red-600 bg-red-50 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                  }`}
                >
                  <span className="text-base">{dyn.icon}</span>
                  <span className="truncate">{dyn.label}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Header ──

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch departments and projects for dynamic dropdowns
  useEffect(() => {
    departmentsApi.getAll().then(setDepartments).catch(() => {});
    projectsApi.getAll().then(setProjects).catch(() => {});
  }, []);

  const handleLanguageChange = (lang: { code: LocaleCode }) => {
    setLocale(lang.code);
    setLangOpen(false);
  };

  const currentLocale = locales.find((l) => l.code === locale)!;

  const linkStyle = (path: string) => {
    const isActive = pathname === path;
    return `transition font-medium text-sm whitespace-nowrap ${
      isActive
        ? 'text-red-600 font-bold border-b-2 border-red-600 pb-1'
        : 'text-gray-600 hover:text-red-600'
    }`;
  };

  const closeAll = useCallback(() => setOpenDropdown(null), []);
  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  const newsItems = dropdownItems.filter(i => i.section === 'news');
  const servicesItems = dropdownItems.filter(i => i.section === 'services');
  const investItems = dropdownItems.filter(i => i.section === 'invest');
  const projectsItems = dropdownItems.filter(i => i.section === 'projects');

  // Build dynamic dropdown items from API data
  const serviceDropdownItems: DynamicDropdownItem[] = departments.map((d) => ({
    href: `/service/${d.id}`,
    label: d.name,
    icon: '🔹',
  }));

  const projectDropdownItems: DynamicDropdownItem[] = projects.map((p) => ({
    href: `/projects/${p.id}`,
    label: p.name,
    icon: '🔸',
  }));

  const isActive = (paths: string[]) => paths.some(p => pathname === p || pathname.startsWith(p + '/'));

  return (
    <header className="bg-white text-gray-800 shadow-sm border-b border-gray-100 relative z-50 sticky top-0">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition shrink-0">
          <img 
            src="https://www.chora.pro.et/assets/logo_1781643314244-B4wJ3hZB.png" 
            alt="Gore Woreda Emblem" 
            className="w-14 h-14 object-contain rounded-full bg-red-600 p-1.5 shadow-md"
          />
          <h1 className="text-2xl font-black tracking-wide text-red-600">Gore Municipality</h1>
        </Link>
        
        {/* Navigation & Language */}
        <nav className="hidden lg:flex items-center space-x-5">
          <Link href="/" className={linkStyle('/')}>{t.header.home}</Link>

          <NavDropdown
            items={newsItems}
            label={t.header.news}
            isActive={isActive(['/news'])}
            isOpen={openDropdown === 'news'}
            onToggle={() => toggleDropdown('news')}
            onClose={closeAll}
            pathname={pathname}
            t={t}
          />

          <NavDropdown
            items={servicesItems}
            label={t.header.services}
            isActive={isActive(['/service'])}
            isOpen={openDropdown === 'services'}
            onToggle={() => toggleDropdown('services')}
            onClose={closeAll}
            pathname={pathname}
            t={t}
            dynamicItems={serviceDropdownItems}
            dynamicLabel={t.services.municipalServices}
          />

          <NavDropdown
            items={investItems}
            label={t.investmentTourism.title}
            isActive={isActive(['/investment-tourism'])}
            isOpen={openDropdown === 'invest'}
            onToggle={() => toggleDropdown('invest')}
            onClose={closeAll}
            pathname={pathname}
            t={t}
          />

          <NavDropdown
            items={projectsItems}
            label="Projects"
            isActive={isActive(['/projects'])}
            isOpen={openDropdown === 'projects'}
            onToggle={() => toggleDropdown('projects')}
            onClose={closeAll}
            pathname={pathname}
            t={t}
            dynamicItems={projectDropdownItems}
            dynamicLabel="Active Projects"
          />

          <Link href="/contact" className={linkStyle('/contact')}>{t.header.contact}</Link>

          <span className="w-px h-5 bg-gray-200" />

          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1.5 text-sm font-semibold text-gray-700 hover:text-red-600 border border-gray-200 rounded-md px-2.5 py-1.5 transition bg-gray-50"
            >
              <span>🌐</span>
              <span>{currentLocale.native}</span>
              <span className={`text-xs transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden z-50">
                {locales.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange({ code: lang.code })}
                    className={`w-full text-left px-4 py-2.5 text-sm transition text-gray-700 hover:bg-red-50 hover:text-red-600 flex justify-between items-center ${
                      locale === lang.code ? 'font-bold text-red-600 bg-red-50/30' : ''
                    }`}
                  >
                    <span>{lang.native} — {lang.label}</span>
                    {locale === lang.code && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-6 py-4 space-y-1">
            <MobileNavLink href="/" label={t.header.home} pathname={pathname} onClick={() => setMobileOpen(false)} />

            {/* News & Announcements */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-3 mb-1 mt-3">{t.header.news}</p>
            <MobileNavLink href="/news" label="📰 Latest News" pathname={pathname} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/news?tab=announcements" label="📢 Announcements" pathname={pathname} onClick={() => setMobileOpen(false)} />

            {/* Services with dynamic departments */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-3 mb-1 mt-3">{t.header.services}</p>
            <MobileNavLink href="/service" label="🏛️ View All Services" pathname={pathname} onClick={() => setMobileOpen(false)} />
            {departments.slice(0, 8).map((dept) => (
              <MobileNavLink
                key={dept.id}
                href={`/service/${dept.id}`}
                label={`  🔹 ${dept.name}`}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
            ))}

            {/* Investment & Tourism */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-3 mb-1 mt-3">{t.investmentTourism.title}</p>
            {investItems.map((item) => (
              <MobileNavLink key={item.href} href={item.href} label={`${item.icon} ${t.investmentTourism[item.key as keyof typeof t.investmentTourism]}`} pathname={pathname} onClick={() => setMobileOpen(false)} />
            ))}

            {/* Projects with dynamic projects */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-3 mb-1 mt-3">Projects</p>
            <MobileNavLink href="/projects" label="📊 View All Projects" pathname={pathname} onClick={() => setMobileOpen(false)} />
            {projects.slice(0, 8).map((proj) => (
              <MobileNavLink
                key={proj.id}
                href={`/projects/${proj.id}`}
                label={`  🔸 ${proj.name}`}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <div className="border-t border-gray-100 pt-2 mt-3">
              <MobileNavLink href="/contact" label={t.header.contact} pathname={pathname} onClick={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNavLink({ href, label, pathname, onClick }: { href: string; label: string; pathname: string; onClick: () => void }) {
  // Handle query params in href (e.g. /news?tab=announcements)
  const hrefPath = href.split('?')[0];
  const isActive = pathname === href || (hrefPath !== '/' && pathname.startsWith(hrefPath));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
      }`}
    >
      {label}
    </Link>
  );
}

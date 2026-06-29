'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, type LocaleCode } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
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
  href: string;
  isActive: boolean;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  pathname: string;
  t: any;
  dynamicItems?: DynamicDropdownItem[];
  dynamicLabel?: string;
}

// ── Static items ──

const dropdownItems: DropdownItem[] = [
  { key: 'title', href: '/news', icon: '📰', section: 'news' },
  { key: 'announcements', href: '/news?tab=announcements', icon: '📢', section: 'news' },
  { key: 'municipalServices', href: '/service', icon: '🏛️', section: 'services' },
  { key: 'overview', href: '/investment-tourism', icon: '📋', section: 'invest' },
  { key: 'opportunities', href: '/investment-tourism/opportunities', icon: '💼', section: 'invest' },
  { key: 'incentives', href: '/investment-tourism/incentives', icon: '⭐', section: 'invest' },
  { key: 'attractions', href: '/investment-tourism/attractions', icon: '🌿', section: 'invest' },
  { key: 'accommodation', href: '/investment-tourism/accommodation', icon: '🏨', section: 'invest' },
  { key: 'title', href: '/projects', icon: '📊', section: 'projects' },
];

// ── NavDropdown Component ──

function NavDropdown({ items, label, href, isActive, isOpen, onMouseEnter, onMouseLeave, pathname, t, dynamicItems, dynamicLabel }: NavDropdownProps) {
  const isActiveItem = (href: string) =>
    pathname === href || (href !== '/news' && href !== '/service' && href !== '/projects' && href !== '/investment-tourism' && pathname.startsWith(href));

  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link
        href={href}
        className={`inline-flex items-center gap-1 transition font-medium text-sm whitespace-nowrap ${
          isActive
            ? 'text-slate-800 dark:text-white font-bold border-b-2 border-slate-800 dark:border-white pb-1'
            : 'text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
        }`}
      >
        {label}
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </Link>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 overflow-hidden z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                isActiveItem(item.href)
                  ? 'text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.key === 'title' ? label : item.key === 'announcements' ? t.announcements.title : item.key === 'municipalServices' ? t.services.municipalServices : t.investmentTourism[item.key as keyof typeof t.investmentTourism]}
            </Link>
          ))}

          {dynamicItems && dynamicItems.length > 0 && (
            <>
              <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
              {dynamicLabel && (
                <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                  {dynamicLabel}
                </p>
              )}
              {dynamicItems.map((dyn) => (
                <Link
                  key={dyn.href}
                  href={dyn.href}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition ${
                    pathname === dyn.href
                      ? 'text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
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
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

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
        ? 'text-slate-800 dark:text-white font-bold border-b-2 border-slate-800 dark:border-white pb-1'
        : 'text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
    }`;
  };

  const openDropdownFn = useCallback((name: string | null) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  const newsItems = dropdownItems.filter(i => i.section === 'news');
  const servicesItems = dropdownItems.filter(i => i.section === 'services');
  const investItems = dropdownItems.filter(i => i.section === 'invest');
  const projectsItems = dropdownItems.filter(i => i.section === 'projects');

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
    <header className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 shadow-sm border-b border-gray-100 dark:border-slate-800 relative z-50 sticky top-0">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition shrink-0">
          <img 
            src="https://www.chora.pro.et/assets/logo_1781643314244-B4wJ3hZB.png" 
            alt="Gore Woreda Emblem" 
            className="w-14 h-14 object-contain rounded-full bg-slate-800 p-1.5 shadow-md"
          />
          <h1 className="text-2xl font-black tracking-wide text-slate-800 dark:text-white">Gore Municipality</h1>
        </Link>
        
        {/* Navigation & Language */}
        <nav className="hidden lg:flex items-center space-x-5">
          <Link href="/" className={linkStyle('/')}>{t.header.home}</Link>
          <Link href="/about" className={linkStyle('/about')}>{t.header.about}</Link>

          <NavDropdown
            items={newsItems}
            label={t.header.news}
            href="/news"
            isActive={isActive(['/news'])}
            isOpen={openDropdown === 'news'}
            onMouseEnter={() => openDropdownFn('news')}
            onMouseLeave={() => setOpenDropdown(null)}
            pathname={pathname}
            t={t}
          />

          <Link href="/documents" className={linkStyle('/documents')}>{t.admin.cmsDocuments}</Link>

          <NavDropdown
            items={servicesItems}
            label={t.header.services}
            href="/service"
            isActive={isActive(['/service'])}
            isOpen={openDropdown === 'services'}
            onMouseEnter={() => openDropdownFn('services')}
            onMouseLeave={() => setOpenDropdown(null)}
            pathname={pathname}
            t={t}
            dynamicItems={serviceDropdownItems}
            dynamicLabel={t.services.municipalServices}
          />

          <NavDropdown
            items={investItems}
            label={t.investmentTourism.title}
            href="/investment-tourism"
            isActive={isActive(['/investment-tourism'])}
            isOpen={openDropdown === 'invest'}
            onMouseEnter={() => openDropdownFn('invest')}
            onMouseLeave={() => setOpenDropdown(null)}
            pathname={pathname}
            t={t}
          />

          <NavDropdown
            items={projectsItems}
            label={t.projects.title}
            href="/projects"
            isActive={isActive(['/projects'])}
            isOpen={openDropdown === 'projects'}
            onMouseEnter={() => openDropdownFn('projects')}
            onMouseLeave={() => setOpenDropdown(null)}
            pathname={pathname}
            t={t}
            dynamicItems={projectDropdownItems}
            dynamicLabel={t.projects.activeProjects}
          />

          <Link href="/contact" className={linkStyle('/contact')}>{t.header.contact}</Link>

          <span className="w-px h-5 bg-gray-200 dark:bg-slate-700" />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600 transition bg-gray-50 dark:bg-slate-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          <span className="w-px h-5 bg-gray-200 dark:bg-slate-700" />

          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-slate-800 dark:hover:text-white border border-gray-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 transition bg-gray-50 dark:bg-slate-800"
            >
              <span>🌐</span>
              <span>{currentLocale.native}</span>
              <span className={`text-xs transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-1 overflow-hidden z-50">
                {locales.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange({ code: lang.code })}
                    className={`w-full text-left px-4 py-2.5 text-sm transition text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white flex justify-between items-center ${
                      locale === lang.code ? 'font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700' : ''
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
        <div className="flex items-center gap-2 lg:hidden">
          {/* Dark Mode Toggle (mobile) */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600 transition"
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
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-6 py-4 space-y-1">
            <MobileNavLink href="/" label={t.header.home} pathname={pathname} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/about" label={t.header.about} pathname={pathname} onClick={() => setMobileOpen(false)} />

            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-3 mb-1 mt-3">{t.header.news}</p>
            <MobileNavLink href="/news" label={`📰 ${t.header.news}`} pathname={pathname} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/news?tab=announcements" label={`📢 ${t.announcements.title}`} pathname={pathname} onClick={() => setMobileOpen(false)} />

            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-3 mb-1 mt-3">{t.header.services}</p>
            <MobileNavLink href="/service" label={`🏛️ ${t.header.services}`} pathname={pathname} onClick={() => setMobileOpen(false)} />
            {departments.slice(0, 8).map((dept) => (
              <MobileNavLink
                key={dept.id}
                href={`/service/${dept.id}`}
                label={`  🔹 ${dept.name}`}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-3 mb-1 mt-3">{t.investmentTourism.title}</p>
            {investItems.map((item) => (
              <MobileNavLink key={item.href} href={item.href} label={`${item.icon} ${t.investmentTourism[item.key as keyof typeof t.investmentTourism]}`} pathname={pathname} onClick={() => setMobileOpen(false)} />
            ))}

            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-3 mb-1 mt-3">{t.projects.title}</p>
            <MobileNavLink href="/projects" label={`📊 ${t.projects.title}`} pathname={pathname} onClick={() => setMobileOpen(false)} />
            {projects.slice(0, 8).map((proj) => (
              <MobileNavLink
                key={proj.id}
                href={`/projects/${proj.id}`}
                label={`  🔸 ${proj.name}`}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <div className="border-t border-gray-100 dark:border-slate-800 pt-2 mt-3">
              <MobileNavLink href="/contact" label={t.header.contact} pathname={pathname} onClick={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNavLink({ href, label, pathname, onClick }: { href: string; label: string; pathname: string; onClick: () => void }) {
  const hrefPath = href.split('?')[0];
  const isActive = pathname === href || (hrefPath !== '/' && pathname.startsWith(hrefPath));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive ? 'text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

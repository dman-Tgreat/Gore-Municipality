'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, type LocaleCode } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { locales, type Messages } from '@/i18n/messages';
import { departmentsApi, projectsApi, type Department, type Project } from '@/lib/api';
import { Newspaper, Megaphone, Landmark, ClipboardList, Briefcase, Star, Leaf, Hotel, BarChart3, ChevronRight } from 'lucide-react';

// ── Types ──

interface DropdownItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  section: 'invest' | 'news' | 'services' | 'projects';
}

interface DynamicDropdownItem {
  href: string;
  label: string;
  icon: React.ReactNode;
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
  t: Messages;
  dynamicItems?: DynamicDropdownItem[];
  dynamicLabel?: string;
}

// ── Static items ──

const dropdownItems: DropdownItem[] = [
  { key: 'title', href: '/news', icon: <Newspaper className="w-4 h-4 " />, section: 'news' },
  { key: 'announcements', href: '/news?tab=announcements', icon: <Megaphone className="w-4 h-4" />, section: 'news' },
  { key: 'municipalServices', href: '/service', icon: <Landmark className="w-4 h-4" />, section: 'services' },
  { key: 'overview', href: '/investment-tourism', icon: <ClipboardList className="w-4 h-4" />, section: 'invest' },
  { key: 'opportunities', href: '/investment-tourism/opportunities', icon: <Briefcase className="w-4 h-4" />, section: 'invest' },
  { key: 'incentives', href: '/investment-tourism/incentives', icon: <Star className="w-4 h-4" />, section: 'invest' },
  { key: 'attractions', href: '/investment-tourism/attractions', icon: <Leaf className="w-4 h-4" />, section: 'invest' },
  { key: 'accommodation', href: '/investment-tourism/accommodation', icon: <Hotel className="w-4 h-4" />, section: 'invest' },
  { key: 'title', href: '/projects', icon: <BarChart3 className="w-4 h-4" />, section: 'projects' },
];

// ── NavDropdown Component ──

function NavDropdown({ items, label, href, isActive, isOpen, onMouseEnter, onMouseLeave, pathname, t, dynamicItems, dynamicLabel }: NavDropdownProps) {
  const isActiveItem = (href: string) =>
    pathname === href || (href !== '/news' && href !== '/service' && href !== '/projects' && href !== '/investment-tourism' && pathname.startsWith(href));

  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 hover:bg-green-300 rounded lg transition font-medium text-[18px] whitespace-nowrap px-1.5 py-1 ${
          isActive
            ? 'text-primary bg-green-500 dark:text-gold-light'
            : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-gold-light'
        }`}
      >
        {label }
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </Link>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 overflow-hidden z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                isActiveItem(item.href)
                  ? 'text-primary dark:text-gold-light bg-cream dark:bg-primary-dark/30 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-cream dark:hover:bg-primary-dark/20 hover:text-primary dark:hover:text-gold-light'
              }`}
            >
              {item.icon}
              {item.key === 'title' ? label : item.key === 'announcements' ? t.announcements.title : item.key === 'municipalServices' ? t.services.municipalServices : t.investmentTourism[item.key as keyof typeof t.investmentTourism]}
            </Link>
          ))}

          {dynamicItems && dynamicItems.length > 0 && (
            <>
              <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
              {dynamicLabel && (
                <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
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
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
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
    const active = pathname === path;
    return `transition font-medium text-[18px] hover:bg-green-300 rounded lg whitespace-nowrap px-1.5 py-1 ${
      active
        ? 'text-slate-800 bg-green-500 dark:bg-slate-700 dark:text-white'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
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
    icon: <ChevronRight className="w-3 h-3 text-slate-400" />,
  }));

  const projectDropdownItems: DynamicDropdownItem[] = projects.map((p) => ({
    href: `/projects/${p.id}`,
    label: p.name,
    icon: <ChevronRight className="w-3 h-3 text-slate-400" />,
  }));

  const isActive = (paths: string[]) => paths.some(p => pathname === p || pathname.startsWith(p + '/'));

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-50">
      {/* === Tri-color decorative bar === */}
      <div className="tri-color-bar">
        <span className="green" />
        <span className="yellow" />
        <span className="red" />
      </div>
      {/* === Top Bar: Official Seal & Identity === */}
      <div className="bg-primary text-white border-b border-primary-dark">          <div className="container mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-white/80 uppercase tracking-wider truncate max-w-[60vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-light shrink-0" />
            <span className="truncate">{t.footer.copyright}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-white/70">
            <span>{t.footer.workingHours}</span>
          </div>
        </div>
      </div>

      {/* === Main Nav Bar === */}
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition shrink-0 min-w-0 max-w-[50vw] sm:max-w-none">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-sm shrink-0">
              <img src="https://www.chora.pro.et/assets/logo_1781643314244-B4wJ3hZB.png" alt="Gore Woreda Seal" className="object-contain w-full h-full" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-[18px] font-bold text-slate-800 dark:text-white leading-tight truncate">
                Gore Woreda
              </span>
              <span className="text-[10px] sm:text-[14px] text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight truncate">
                Official Municipal Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
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

            <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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

            <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span>{currentLocale.native}</span>
                <span className={`text-[10px] transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  {locales.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange({ code: lang.code })}
                      className={`w-full text-left px-3 py-2 text-xs transition flex justify-between items-center ${
                        locale === lang.code
                          ? 'text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      {locale === lang.code && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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

            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {currentLocale.native}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  {locales.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange({ code: lang.code })}
                      className={`w-full text-left px-3 py-2 text-xs transition ${
                        locale === lang.code ? 'font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-6 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            <MobileNavLink href="/" label={t.header.home} pathname={pathname} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/about" label={t.header.about} pathname={pathname} onClick={() => setMobileOpen(false)} />
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">{t.header.news}</p>
              <MobileNavLink href="/news" label={t.header.news} pathname={pathname} onClick={() => setMobileOpen(false)} icon={<Newspaper className="w-4 h-4" />} />
              <MobileNavLink href="/news?tab=announcements" label={t.announcements.title} pathname={pathname} onClick={() => setMobileOpen(false)} icon={<Megaphone className="w-4 h-4" />} />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">{t.header.services}</p>
              <MobileNavLink href="/service" label={t.header.services} pathname={pathname} onClick={() => setMobileOpen(false)} icon={<Landmark className="w-4 h-4" />} />
              {departments.slice(0, 8).map((dept) => (
                <MobileNavLink key={dept.id} href={`/service/${dept.id}`} label={dept.name} pathname={pathname} onClick={() => setMobileOpen(false)} icon={<ChevronRight className="w-3 h-3 text-slate-400" />} />
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">{t.investmentTourism.title}</p>
              {investItems.map((item) => (
                <MobileNavLink key={item.href} href={item.href} label={`${item.icon} ${t.investmentTourism[item.key as keyof typeof t.investmentTourism]}`} pathname={pathname} onClick={() => setMobileOpen(false)} />
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-4">{t.projects.title}</p>
              <MobileNavLink href="/projects" label={t.projects.title} pathname={pathname} onClick={() => setMobileOpen(false)} icon={<BarChart3 className="w-4 h-4" />} />
              {projects.slice(0, 8).map((proj) => (
                <MobileNavLink key={proj.id} href={`/projects/${proj.id}`} label={proj.name} pathname={pathname} onClick={() => setMobileOpen(false)} icon={<ChevronRight className="w-3 h-3 text-slate-400" />} />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNavLink({ href, label, pathname, onClick, icon }: { href: string; label: string; pathname: string; onClick: () => void; icon?: React.ReactNode }) {
  const hrefPath = href.split('?')[0];
  const active = pathname === href || (hrefPath !== '/' && pathname.startsWith(hrefPath));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
        active
          ? 'text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}

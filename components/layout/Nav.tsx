"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CTA, NAV, type NavLink } from "@/lib/site";

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className="transition-transform duration-200 ease-ist group-data-[open=true]/item:-rotate-180"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

type MenuState = { pathname: string; mobile: boolean; dropdown: string | null };

const CLOSED_MENUS = { mobile: false, dropdown: null } as const;

function isActive(pathname: string, item: NavLink): boolean {
  // Dropdown parents light up only for their children — never via a fallback
  // parent href (Products used to share /solutions and looked "active" there).
  const hrefs = item.children?.length
    ? item.children.map((child) => child.href)
    : [item.href];

  return hrefs.some((href) => {
    const path = (href.split("#")[0] ?? href).replace(/\/$/, "") || "/";
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  // Menu state carries the route it belongs to, so navigating — including via
  // browser back/forward — reads as closed without a reset effect that would
  // paint the old menu open for a frame. The desktop dropdown and the mobile
  // overlay live at different breakpoints and are never open together.
  const [menus, setMenus] = useState<MenuState>({ pathname, mobile: false, dropdown: null });
  const current = menus.pathname === pathname ? menus : CLOSED_MENUS;
  const mobileOpen = current.mobile;
  const openMenu = current.dropdown;

  const setDropdown = useCallback(
    (dropdown: string | null) => setMenus({ pathname, mobile: false, dropdown }),
    [pathname],
  );
  const setMobileOpen = useCallback(
    (mobile: boolean) => setMenus({ pathname, mobile, dropdown: null }),
    [pathname],
  );
  const closeAll = useCallback(() => setMenus({ pathname, ...CLOSED_MENUS }), [pathname]);

  // Transparent over the hero, then --ist-surface with backdrop blur after 80px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the full-screen mobile overlay.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  // Close an open dropdown when focus or a click lands outside the nav.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setDropdown(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openMenu, setDropdown]);

  const toggleMenu = useCallback(
    (label: string) => setDropdown(openMenu === label ? null : label),
    [openMenu, setDropdown],
  );

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-[320ms] ease-ist",
          scrolled || mobileOpen
            ? "border-b border-ist-line bg-ist-surface/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-ist flex h-18 items-center justify-between gap-6">
          <Logo className="shrink-0" />

          {/* ---------- Desktop ---------- */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(pathname, item);
                const open = openMenu === item.label;

                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-sm px-3 py-2 text-[0.9375rem] transition-colors duration-[180ms] ease-ist",
                          active ? "text-ist-accent-bright" : "text-ist-muted hover:text-ist-text",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.label}
                    className="group/item relative"
                    data-open={open}
                    onMouseEnter={() => setDropdown(item.label)}
                    onMouseLeave={() => setDropdown(null)}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => toggleMenu(item.label)}
                      className={cn(
                        "flex items-center gap-2 rounded-sm px-3 py-2 text-[0.9375rem] transition-colors duration-[180ms] ease-ist",
                        active || open
                          ? "text-ist-accent-bright"
                          : "text-ist-muted hover:text-ist-text",
                      )}
                    >
                      {item.label}
                      <Chevron />
                    </button>

                    <div
                      className={cn(
                        "absolute left-0 top-full min-w-52 origin-top py-2 backdrop-blur-md transition-[opacity,transform,background-color,border-color] duration-[180ms] ease-ist",
                        scrolled || mobileOpen
                          ? "border border-ist-line bg-ist-surface/90 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
                          : "border border-white/15 bg-black/20 shadow-none",
                        open
                          ? "pointer-events-auto opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0",
                      )}
                    >
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              tabIndex={open ? undefined : -1}
                              className={cn(
                                "block px-4 py-3 text-[0.9375rem] text-ist-muted transition-colors duration-[180ms] ease-ist hover:text-ist-text",
                                scrolled || mobileOpen
                                  ? "hover:bg-white/5"
                                  : "hover:bg-white/10",
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Button href="/contact" variant="secondary" withArrow className="max-w-none">
              {CTA.contact}
            </Button>
          </div>

          {/* ---------- Mobile trigger ---------- */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="-mr-3 flex h-11 w-11 items-center justify-center rounded-sm text-ist-text lg:hidden"
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            >
              {mobileOpen ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </header>

      {/* ---------- Mobile overlay ----------
          --ist-text on --ist-surface-raised. Never dark text on dark grey.

          Deliberately a sibling of <header>, not a child: the header's
          backdrop-filter establishes a containing block, which would resolve this
          fixed overlay against the 72px header instead of the viewport and
          collapse it to zero height. */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto bg-ist-raised lg:hidden"
      >
        <nav aria-label="Primary — mobile" className="container-ist py-8">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.label} className="border-b border-ist-line py-2">
                {item.children ? (
                  <>
                    <p className="t-eyebrow py-3">{item.label}</p>
                    <ul className="flex flex-col pb-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-3 text-lg text-ist-text transition-colors duration-[180ms] ease-ist hover:text-ist-accent-bright"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-4 text-lg text-ist-text transition-colors duration-[180ms] ease-ist hover:text-ist-accent-bright"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/contact" variant="primary" withArrow>
              {CTA.contact}
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

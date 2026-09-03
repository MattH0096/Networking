"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoStream } from "@/components/brand/LogoStream";
import { cn } from "@/lib/cn";

const ROUTE_MS = 1250;
const EXIT_MS = 560;

/**
 * Soft logo light-stream on client navigations (not first paint).
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timers = useRef<number[]>([]);
  const finishing = useRef(false);
  const prevPath = useRef(pathname);
  const skipFirstPath = useRef(true);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function finish() {
    if (finishing.current) return;
    finishing.current = true;
    clearTimers();
    setExiting(true);
    timers.current.push(
      window.setTimeout(() => {
        setActive(false);
        setExiting(false);
        finishing.current = false;
        delete document.documentElement.dataset.loader;
      }, EXIT_MS),
    );
  }

  function run() {
    clearTimers();
    finishing.current = false;
    setExiting(false);
    setCycle((n) => n + 1);
    setActive(true);
    document.documentElement.dataset.loader = "on";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 320 : ROUTE_MS;
    timers.current.push(window.setTimeout(finish, hold));
  }

  useEffect(() => {
    if (skipFirstPath.current) {
      skipFirstPath.current = false;
      return;
    }
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (pathname.startsWith("/admin")) {
      clearTimers();
      setActive(false);
      setExiting(false);
      finishing.current = false;
      delete document.documentElement.dataset.loader;
      return;
    }

    run();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      key={cycle}
      className={cn(
        "logo-loader",
        "logo-loader--route",
        exiting && "logo-loader--exit",
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="logo-loader__veil" />
      <div className="logo-loader__grain" />
      <div className="logo-loader__vignette" />
      <LogoStream mode="route" />
    </div>
  );
}

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LoaderCircle, LogOut, UserRound } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { DURATION, EASE_OUT } from "../lib/motion";
import { displayName, userInitials } from "../lib/initials";

const HOVER_CLOSE_DELAY = 160;

// Signed-in account button for the landing header.
// Opens on mouse hover, and also on click/tap and keyboard (Enter, Space,
// ArrowDown/ArrowUp). Sign out uses the shared AuthProvider flow.
export default function AccountMenu({ onSignedOut }) {
  const { user, signOut } = useAuth();
  const menuId = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const closeTimer = useRef(null);
  const busyRef = useRef(false);
  // "hover" menus close when the pointer leaves; "click" menus stay pinned.
  const [openedBy, setOpenedBy] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const open = openedBy !== null;

  const name = displayName(user);
  const initials = userInitials(user);
  const label = `Account menu for ${name || user?.email || "your account"}`;

  const clearTimer = () => { clearTimeout(closeTimer.current); closeTimer.current = null; };
  const close = useCallback((returnFocus = false) => {
    clearTimer();
    setOpenedBy(null);
    setError("");
    if (returnFocus) buttonRef.current?.focus();
  }, []);
  const focusItem = index => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;
    items[(index + items.length) % items.length].focus();
  };
  const openAndFocus = index => {
    clearTimer();
    setOpenedBy("click");
    // Wait for the menu to mount before moving focus into it.
    window.requestAnimationFrame(() => focusItem(index));
  };

  useEffect(() => {
    if (!open) return undefined;
    const outside = event => { if (!rootRef.current?.contains(event.target)) close(); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, close]);
  useEffect(() => clearTimer, []);

  function onButtonClick(event) {
    clearTimer();
    // Keyboard activation (Enter/Space) reports detail 0: move focus into the menu.
    if (event.detail === 0) { open ? close() : openAndFocus(0); return; }
    if (openedBy === "hover") setOpenedBy("click"); // tap/click pins a hover-opened menu
    else if (open) close();
    else setOpenedBy("click");
  }

  function onButtonKeyDown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); openAndFocus(0); }
    else if (event.key === "ArrowUp") { event.preventDefault(); openAndFocus(-1); }
    else if (event.key === "Escape" && open) { event.preventDefault(); close(true); }
  }

  function onMenuKeyDown(event) {
    const items = itemRefs.current.filter(Boolean);
    const index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown") { event.preventDefault(); focusItem(index + 1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusItem(index - 1); }
    else if (event.key === "Home") { event.preventDefault(); focusItem(0); }
    else if (event.key === "End") { event.preventDefault(); focusItem(-1); }
    else if (event.key === "Escape") { event.preventDefault(); close(true); }
    else if (event.key === "Tab") close(true);
  }

  function onBlur(event) {
    if (pending) return;
    if (!rootRef.current?.contains(event.relatedTarget)) close();
  }

  async function handleSignOut() {
    if (busyRef.current) return;
    busyRef.current = true;
    setPending(true);
    setError("");
    try {
      await signOut();
      onSignedOut?.();
    } catch {
      setError("Could not sign out. Check your connection and try again.");
      setPending(false);
      busyRef.current = false;
    }
  }

  const itemClass = "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-palette-ivory transition-colors hover:bg-palette-graphite focus-visible:bg-palette-graphite focus-visible:outline-none disabled:cursor-wait disabled:opacity-70";

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={onBlur}
      onPointerEnter={event => {
        if (event.pointerType !== "mouse") return;
        clearTimer();
        if (!open) setOpenedBy("hover");
      }}
      onPointerLeave={event => {
        if (event.pointerType !== "mouse" || openedBy !== "hover") return;
        clearTimer();
        closeTimer.current = setTimeout(() => close(), HOVER_CLOSE_DELAY);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={onButtonClick}
        onKeyDown={onButtonKeyDown}
        className={`flex size-10 items-center justify-center rounded-full border text-sm font-semibold tracking-wide transition-all duration-300
                    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot
                    ${open
                      ? "border-palette-apricot bg-palette-apricot text-black shadow-[0_8px_24px_rgba(255,179,71,0.45)]"
                      : "border-palette-apricot/60 bg-palette-graphite text-palette-apricot hover:border-palette-apricot hover:shadow-[0_8px_20px_rgba(255,179,71,0.3)]"}`}
      >
        {initials ? <span aria-hidden="true">{initials}</span> : <UserRound aria-hidden="true" strokeWidth={1.75} className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            // pt-2 (not mt-2) keeps a hoverable bridge between button and panel.
            className="absolute right-0 top-full z-50 origin-top-right pt-2"
          >
            <div className="w-64 overflow-hidden rounded-xl border border-palette-graphite bg-palette-charcoal/95 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <div className="border-b border-palette-graphite px-3 pt-2 pb-3">
                <p className="truncate text-sm font-medium text-palette-ivory">{name || "Signed in"}</p>
                {user?.email && <p className="mt-0.5 truncate text-xs text-palette-stone">{user.email}</p>}
              </div>
              <div id={menuId} role="menu" aria-label="Account" onKeyDown={onMenuKeyDown} className="pt-1.5">
                <Link
                  ref={node => { itemRefs.current[0] = node; }}
                  to="/app"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => close()}
                  className={itemClass}
                >
                  <LayoutDashboard aria-hidden="true" strokeWidth={1.75} className="size-4 text-palette-apricot" />
                  My dashboard
                </Link>
                <button
                  ref={node => { itemRefs.current[1] = node; }}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={pending}
                  aria-busy={pending}
                  onClick={handleSignOut}
                  className={itemClass}
                >
                  {pending
                    ? <LoaderCircle aria-hidden="true" strokeWidth={1.75} className="size-4 text-palette-stone motion-safe:animate-spin" />
                    : <LogOut aria-hidden="true" strokeWidth={1.75} className="size-4 text-palette-stone" />}
                  {pending ? "Signing out…" : "Sign out"}
                </button>
              </div>
              {error && <p role="alert" className="px-3 pt-1 pb-2 text-xs leading-5 text-palette-apricot">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

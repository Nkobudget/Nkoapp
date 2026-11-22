import { useEffect, useRef, useState, useCallback } from 'react';

function findPrimaryScrollable() {
  if (typeof document === 'undefined') return null;
  const docEl = document.scrollingElement || document.documentElement;
  if (docEl && docEl.scrollHeight > docEl.clientHeight + 4) {
    return docEl;
  }
  // Check main workspace scroll pane (e.g. inside /app dashboard)
  const candidates = document.querySelectorAll('main div, .nko-dashboard div');
  let best = null;
  let bestArea = 0;
  for (let i = 0; i < candidates.length; i++) {
    const el = candidates[i];
    if (el.scrollHeight > el.clientHeight + 8 && el.clientWidth > 280) {
      const style = window.getComputedStyle(el);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        const area = el.clientWidth * el.clientHeight;
        if (area > bestArea) {
          bestArea = area;
          best = el;
        }
      }
    }
  }
  return best || docEl;
}

export default function CustomScrollbar() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [metrics, setMetrics] = useState({
    hasScroll: false,
    trackTop: 8,
    trackHeight: 0,
    thumbTop: 0,
    thumbHeight: 48,
  });

  const activeTargetRef = useRef(null);
  const hideTimerRef = useRef(null);
  const dragStartRef = useRef({ y: 0, scrollTop: 0 });

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, 950);
  }, []);

  const updateMetrics = useCallback((targetEl) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const el =
      targetEl &&
      targetEl !== document &&
      targetEl !== window &&
      targetEl.scrollHeight > targetEl.clientHeight + 4 &&
      targetEl.clientWidth > 260
        ? targetEl
        : activeTargetRef.current &&
          document.contains(activeTargetRef.current) &&
          activeTargetRef.current.scrollHeight > activeTargetRef.current.clientHeight + 4
        ? activeTargetRef.current
        : findPrimaryScrollable();

    if (!el) {
      setMetrics((m) => (m.hasScroll ? { ...m, hasScroll: false } : m));
      return;
    }

    activeTargetRef.current = el;
    const isRoot =
      el === document.documentElement ||
      el === document.body ||
      el === document.scrollingElement;

    const scrollHeight = el.scrollHeight;
    const clientHeight = isRoot ? window.innerHeight : el.clientHeight;
    const scrollTop = isRoot ? window.scrollY || el.scrollTop : el.scrollTop;

    if (scrollHeight <= clientHeight + 4) {
      setMetrics((m) => (m.hasScroll ? { ...m, hasScroll: false } : m));
      return;
    }

    const rect = isRoot
      ? { top: 0, height: window.innerHeight }
      : el.getBoundingClientRect();

    const pad = 8;
    const trackTop = Math.max(0, rect.top) + pad;
    const trackHeight = Math.max(60, rect.height - pad * 2);
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(44, Math.min(trackHeight - 8, Math.round(trackHeight * ratio)));
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const thumbTop = Math.min(maxThumbTop, Math.max(0, (scrollTop / maxScroll) * maxThumbTop));

    setMetrics({
      hasScroll: true,
      trackTop,
      trackHeight,
      thumbTop,
      thumbHeight,
    });
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      updateMetrics();
    };

    const onScroll = (e) => {
      const target =
        e.target === document || e.target === window
          ? document.scrollingElement || document.documentElement
          : e.target;
      updateMetrics(target);
      setVisible(true);
      scheduleHide();
    };

    const onWheel = () => {
      updateMetrics();
      setVisible(true);
      scheduleHide();
    };

    const onMouseMove = (e) => {
      if (window.innerWidth - e.clientX <= 28) {
        updateMetrics();
        setVisible(true);
        scheduleHide();
      }
    };

    updateMetrics();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('wheel', onWheel, { capture: true, passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const observer = new window.MutationObserver(() => updateMetrics());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide, updateMetrics]);

  useEffect(() => {
    if (!dragging) return;
    const onPointerMove = (e) => {
      const el = activeTargetRef.current || findPrimaryScrollable();
      if (!el) return;
      const isRoot =
        el === document.documentElement ||
        el === document.body ||
        el === document.scrollingElement;
      const clientHeight = isRoot ? window.innerHeight : el.clientHeight;
      const maxScroll = Math.max(1, el.scrollHeight - clientHeight);
      const maxThumbTop = Math.max(1, metrics.trackHeight - metrics.thumbHeight);
      const deltaY = e.clientY - dragStartRef.current.y;
      const nextScroll = dragStartRef.current.scrollTop + (deltaY / maxThumbTop) * maxScroll;
      if (isRoot) {
        window.scrollTo({ top: nextScroll, behavior: 'auto' });
      } else {
        el.scrollTop = nextScroll;
      }
      setVisible(true);
    };

    const onPointerUp = () => {
      setDragging(false);
      scheduleHide();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragging, metrics.trackHeight, metrics.thumbHeight, scheduleHide]);

  if (!isDesktop || !metrics.hasScroll) return null;

  const isShown = visible || hovered || dragging;
  const isActive = hovered || dragging;

  const handleTrackClick = (e) => {
    if (e.target !== e.currentTarget) return;
    const el = activeTargetRef.current || findPrimaryScrollable();
    if (!el) return;
    const isRoot =
      el === document.documentElement ||
      el === document.body ||
      el === document.scrollingElement;
    const clientHeight = isRoot ? window.innerHeight : el.clientHeight;
    const maxScroll = Math.max(1, el.scrollHeight - clientHeight);
    const clickOffset = e.clientY - metrics.trackTop - metrics.thumbHeight / 2;
    const maxThumbTop = Math.max(1, metrics.trackHeight - metrics.thumbHeight);
    const ratio = Math.min(1, Math.max(0, clickOffset / maxThumbTop));
    const targetScroll = ratio * maxScroll;
    if (isRoot) {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      el.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handleThumbPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = activeTargetRef.current || findPrimaryScrollable();
    if (!el) return;
    const isRoot =
      el === document.documentElement ||
      el === document.body ||
      el === document.scrollingElement;
    dragStartRef.current = {
      y: e.clientY,
      scrollTop: isRoot ? window.scrollY || el.scrollTop : el.scrollTop,
    };
    setDragging(true);
    setVisible(true);
  };

  return (
    <div
      aria-hidden="true"
      onMouseEnter={() => {
        setHovered(true);
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (!dragging) scheduleHide();
      }}
      onClick={handleTrackClick}
      style={{
        position: 'fixed',
        top: metrics.trackTop,
        right: 5,
        height: metrics.trackHeight,
        width: isActive ? 11 : 8,
        borderRadius: 9999,
        background: isActive ? 'rgba(18, 18, 22, 0.58)' : 'rgba(18, 18, 22, 0.25)',
        backdropFilter: isShown ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isShown ? 'blur(10px)' : 'none',
        border: isActive
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid transparent',
        opacity: isShown ? 1 : 0,
        transform: isShown ? 'translateX(0)' : 'translateX(4px)',
        pointerEvents: isShown ? 'auto' : 'none',
        transition:
          'opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1), transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), width 0.18s ease, background-color 0.18s ease',
        zIndex: 9999,
        cursor: 'pointer',
      }}
    >
      <div
        onPointerDown={handleThumbPointerDown}
        style={{
          position: 'absolute',
          top: metrics.thumbTop,
          left: 0,
          right: 0,
          height: metrics.thumbHeight,
          borderRadius: 9999,
          background: dragging
            ? 'linear-gradient(180deg, rgba(255, 186, 82, 0.9) 0%, rgba(212, 175, 55, 0.8) 100%)'
            : hovered
            ? 'linear-gradient(180deg, rgba(255, 179, 71, 0.72) 0%, rgba(212, 175, 55, 0.58) 100%)'
            : 'linear-gradient(180deg, rgba(245, 245, 240, 0.42) 0%, rgba(212, 175, 55, 0.32) 100%)',
          border: isActive
            ? '1px solid rgba(255, 225, 160, 0.45)'
            : '1px solid rgba(255, 255, 255, 0.24)',
          boxShadow: isActive
            ? '0 4px 16px rgba(255, 179, 71, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
            : '0 2px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      />
    </div>
  );
}

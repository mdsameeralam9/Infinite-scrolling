import React, { useState, useEffect, useRef, useCallback, ReactNode, CSSProperties } from 'react';
import { throttle } from 'throttle-debounce';
import { ThresholdUnits, parseThreshold } from './util';


type Fn = () => any;
export interface Props {
  next: Fn;
  hasMore: boolean;
  children: ReactNode;
  loader: ReactNode;
  scrollThreshold?: number | string;
  endMessage?: ReactNode;
  style?: CSSProperties;
  height?: number | string;
  scrollableTarget?: ReactNode;
  hasChildren?: boolean;
  inverse?: boolean;
  pullDownToRefresh?: boolean;
  pullDownToRefreshContent?: ReactNode;
  releaseToRefreshContent?: ReactNode;
  pullDownToRefreshThreshold?: number;
  refreshFunction?: Fn;
  onScroll?: (e: MouseEvent) => any;
  dataLength: number;
  initialScrollY?: number;
  className?: string;
}

export default function InfiniteScroll(props: Props) {
  const [showLoader, setShowLoader] = useState(false);
  const [pullToRefreshThresholdBreached, setPullToRefreshThresholdBreached] = useState(false);
  
  const scrollableNodeRef = useRef<HTMLElement | null>(null);
  const elRef = useRef<HTMLElement | Window | null>(null);
  const infScrollRef = useRef<HTMLDivElement>(null);
  const pullDownRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);
  const actionTriggeredRef = useRef(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const draggingRef = useRef(false);
  const maxPullDownDistanceRef = useRef(0);

  const getScrollableTarget = useCallback(() => {
    if (props.scrollableTarget instanceof HTMLElement)
      return props.scrollableTarget;
    if (typeof props.scrollableTarget === 'string') {
      return document.getElementById(props.scrollableTarget);
    }
    if (props.scrollableTarget === null) {
      console.warn(`You are trying to pass scrollableTarget but it is null. This might
        happen because the element may not have been added to DOM yet.
        See https://github.com/ankeetmaini/react-infinite-scroll-component/issues/59 for more info.
      `);
    }
    return null;
  }, [props.scrollableTarget]);

  const isElementAtTop = useCallback((target: HTMLElement, scrollThreshold: string | number = 0.8) => {
    const clientHeight =
      target === document.body || target === document.documentElement
        ? window.screen.availHeight
        : target.clientHeight;

    const threshold = parseThreshold(scrollThreshold);

    if (threshold.unit === ThresholdUnits.Pixel) {
      return (
        target.scrollTop <=
        threshold.value + clientHeight - target.scrollHeight + 1
      );
    }

    return (
      target.scrollTop <=
      threshold.value / 100 + clientHeight - target.scrollHeight + 1
    );
  }, []);

  const isElementAtBottom = useCallback((
    target: HTMLElement,
    scrollThreshold: string | number = 0.8
  ) => {
    const clientHeight =
      target === document.body || target === document.documentElement
        ? window.screen.availHeight
        : target.clientHeight;

    const threshold = parseThreshold(scrollThreshold);

    if (threshold.unit === ThresholdUnits.Pixel) {
      return (
        target.scrollTop + clientHeight >= target.scrollHeight - threshold.value
      );
    }

    return (
      target.scrollTop + clientHeight >=
      (threshold.value / 100) * target.scrollHeight
    );
  }, []);

  const onScrollListener = useCallback((event: MouseEvent) => {
    if (typeof props.onScroll === 'function') {
      setTimeout(() => props.onScroll && props.onScroll(event), 0);
    }

    const target =
      props.height || scrollableNodeRef.current
        ? (event.target as HTMLElement)
        : document.documentElement.scrollTop
        ? document.documentElement
        : document.body;

    if (actionTriggeredRef.current) return;

    const atBottom = props.inverse
      ? isElementAtTop(target, props.scrollThreshold)
      : isElementAtBottom(target, props.scrollThreshold);

    if (atBottom && props.hasMore) {
      actionTriggeredRef.current = true;
      setShowLoader(true);
      props.next && props.next();
    }

    lastScrollTopRef.current = target.scrollTop;
  }, [props, isElementAtTop, isElementAtBottom]);

  const throttledOnScrollListener = useRef(
    throttle(150, onScrollListener)
  ).current;

  const onStart = useCallback((evt: Event) => {
    if (lastScrollTopRef.current) return;

    draggingRef.current = true;

    if (evt instanceof MouseEvent) {
      startYRef.current = evt.pageY;
    } else if (evt instanceof TouchEvent) {
      startYRef.current = evt.touches[0].pageY;
    }
    currentYRef.current = startYRef.current;

    if (infScrollRef.current) {
      infScrollRef.current.style.willChange = 'transform';
      infScrollRef.current.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`;
    }
  }, []);

  const onMove = useCallback((evt: Event) => {
    if (!draggingRef.current) return;

    if (evt instanceof MouseEvent) {
      currentYRef.current = evt.pageY;
    } else if (evt instanceof TouchEvent) {
      currentYRef.current = evt.touches[0].pageY;
    }

    if (currentYRef.current < startYRef.current) return;

    if (
      currentYRef.current - startYRef.current >=
      Number(props.pullDownToRefreshThreshold)
    ) {
      setPullToRefreshThresholdBreached(true);
    }

    if (currentYRef.current - startYRef.current > maxPullDownDistanceRef.current * 1.5) return;

    if (infScrollRef.current) {
      infScrollRef.current.style.overflow = 'visible';
      infScrollRef.current.style.transform = `translate3d(0px, ${currentYRef.current -
        startYRef.current}px, 0px)`;
    }
  }, [props.pullDownToRefreshThreshold]);

  const onEnd = useCallback(() => {
    startYRef.current = 0;
    currentYRef.current = 0;
    draggingRef.current = false;

    if (pullToRefreshThresholdBreached) {
      props.refreshFunction && props.refreshFunction();
      setPullToRefreshThresholdBreached(false);
    }

    requestAnimationFrame(() => {
      if (infScrollRef.current) {
        infScrollRef.current.style.overflow = 'auto';
        infScrollRef.current.style.transform = 'none';
        infScrollRef.current.style.willChange = 'unset';
      }
    });
  }, [pullToRefreshThresholdBreached, props.refreshFunction]);

  useEffect(() => {
    if (typeof props.dataLength === 'undefined') {
      throw new Error(
        `mandatory prop "dataLength" is missing. The prop is needed` +
          ` when loading more content. Check README.md for usage`
      );
    }

    scrollableNodeRef.current = getScrollableTarget();
    elRef.current = props.height
      ? infScrollRef.current
      : scrollableNodeRef.current || window;

    if (elRef.current) {
      elRef.current.addEventListener('scroll', throttledOnScrollListener as EventListenerOrEventListenerObject);
    }

    if (
      typeof props.initialScrollY === 'number' &&
      elRef.current &&
      elRef.current instanceof HTMLElement &&
      elRef.current.scrollHeight > props.initialScrollY
    ) {
      elRef.current.scrollTo(0, props.initialScrollY);
    }

    if (props.pullDownToRefresh && elRef.current) {
      elRef.current.addEventListener('touchstart', onStart);
      elRef.current.addEventListener('touchmove', onMove);
      elRef.current.addEventListener('touchend', onEnd);

      elRef.current.addEventListener('mousedown', onStart);
      elRef.current.addEventListener('mousemove', onMove);
      elRef.current.addEventListener('mouseup', onEnd);

      maxPullDownDistanceRef.current =
        (pullDownRef.current &&
          pullDownRef.current.firstChild &&
          (pullDownRef.current.firstChild as HTMLDivElement).getBoundingClientRect()
            .height) ||
        0;

      if (typeof props.refreshFunction !== 'function') {
        throw new Error(
          `Mandatory prop "refreshFunction" missing.
          Pull Down To Refresh functionality will not work
          as expected. Check README.md for usage'`
        );
      }
    }

    return () => {
      if (elRef.current) {
        elRef.current.removeEventListener('scroll', throttledOnScrollListener as EventListenerOrEventListenerObject);

        if (props.pullDownToRefresh) {
          elRef.current.removeEventListener('touchstart', onStart);
          elRef.current.removeEventListener('touchmove', onMove);
          elRef.current.removeEventListener('touchend', onEnd);

          elRef.current.removeEventListener('mousedown', onStart);
          elRef.current.removeEventListener('mousemove', onMove);
          elRef.current.removeEventListener('mouseup', onEnd);
        }
      }
    };
  }, [props.dataLength, props.height, props.initialScrollY, props.pullDownToRefresh, props.refreshFunction, getScrollableTarget, throttledOnScrollListener, onStart, onMove, onEnd]);

  useEffect(() => {
    actionTriggeredRef.current = false;
    setShowLoader(false);
  }, [props.dataLength]);

  const style = {
    height: props.height || 'auto',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...props.style,
  } as CSSProperties;
  
  const hasChildren =
    props.hasChildren ||
    !!(
      props.children &&
      props.children instanceof Array &&
      props.children.length
    );

  const outerDivStyle =
    props.pullDownToRefresh && props.height
      ? { overflow: 'auto' }
      : {};
      
  return (
    <div
      style={outerDivStyle}
      className="infinite-scroll-component__outerdiv"
    >
      <div
        className={`infinite-scroll-component ${props.className || ''}`}
        ref={infScrollRef}
        style={style}
      >
        {props.pullDownToRefresh && (
          <div
            style={{ position: 'relative' }}
            ref={pullDownRef}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: -1 * maxPullDownDistanceRef.current,
              }}
            >
              {pullToRefreshThresholdBreached
                ? props.releaseToRefreshContent
                : props.pullDownToRefreshContent}
            </div>
          </div>
        )}
        {props.children}
        {!showLoader &&
          !hasChildren &&
          props.hasMore &&
          props.loader}
        {showLoader && props.hasMore && props.loader}
        {!props.hasMore && props.endMessage}
      </div>
    </div>
  );
}
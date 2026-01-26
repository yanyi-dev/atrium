import { useEffect } from "react";

export function useOutsideScroll(handler: () => void, enable: boolean = true) {
  useEffect(
    function () {
      if (!enable) return;

      function handleScroll() {
        handler();
      }

      //scroll事件只有捕获，没有冒泡
      window.addEventListener("scroll", handleScroll, true);

      return () => window.removeEventListener("scroll", handleScroll, true);
    },
    [handler, enable],
  );
}

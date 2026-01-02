import { useEffect } from "react";

export function useOutsideScroll(enbale = true, handler) {
  useEffect(
    function () {
      if (!enbale) return;

      function handleScroll() {
        handler();
      }

      //scroll事件只有捕获，没有冒泡
      window.addEventListener("scroll", handleScroll, true);

      return () => window.removeEventListener("scroll", handleScroll, true);
    },
    [enbale, handler]
  );
}

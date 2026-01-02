import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef(null);

  useEffect(
    function () {
      function handleClick(e) {
        //方法二
        //如果点击发生在菜单外，且点击的不是任何按钮，才执行关闭操作
        if (
          ref.current &&
          !ref.current.contains(e.target) &&
          !e.target.closest("button")
        ) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}

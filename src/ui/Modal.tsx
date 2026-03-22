import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactElement,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

// StateContext：只携带 openName，供 Window 订阅
interface ModalStateContextProps {
  openName: string;
}

// DispatchContext：只携带操作函数，引用永远稳定，供 Open 订阅
interface ModalDispatchContextProps {
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
}

interface ModalProps {
  children: ReactNode;
}

const ModalStateContext = createContext<ModalStateContextProps | undefined>(
  undefined,
);
const ModalDispatchContext = createContext<
  ModalDispatchContextProps | undefined
>(undefined);

function useModalStateContext() {
  const context = useContext(ModalStateContext);
  if (context === undefined)
    throw new Error("useModalStateContext must be used within a Modal");
  return context;
}

function useModalDispatchContext() {
  const context = useContext(ModalDispatchContext);
  if (context === undefined)
    throw new Error("useModalDispatchContext must be used within a Modal");
  return context;
}

// 父组件：提供两层 Provider
function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState("");

  // useCallback 稳定化 close 的引用，保证 DispatchContext 的 value 对象不变
  const close = useCallback(() => setOpenName(""), []);
  const open = setOpenName;

  // useMemo 确保 DispatchContext value 对象引用保持稳定
  // 只要 close 和 open 不变，这个对象就不会触发订阅者重渲染
  const dispatchValue = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalDispatchContext.Provider value={dispatchValue}>
      <ModalStateContext.Provider value={{ openName }}>
        {children}
      </ModalStateContext.Provider>
    </ModalDispatchContext.Provider>
  );
}

interface OpenProps {
  opens: string;
  children: ReactElement;
}

// Open 只订阅 DispatchContext：openName 变化不会触发它重渲染
function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useModalDispatchContext();

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

interface WindowProps {
  name: string;
  children: ReactElement;
}

// Window 订阅 StateContext 判断是否显示，订阅 DispatchContext 获取 close
function Window({ children, name }: WindowProps) {
  const { openName } = useModalStateContext();

  if (name !== openName) return null;

  return <WindowT>{children}</WindowT>;
}

interface WindowTProps {
  children: ReactElement;
}

function WindowT({ children }: WindowTProps) {
  const { close } = useModalDispatchContext();

  const ref = useOutsideClick<HTMLDivElement>(close, true);

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;

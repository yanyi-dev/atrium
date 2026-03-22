import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useOutsideScroll } from "../hooks/useOutsideScroll";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface Point {
  x: number;
  y: number;
}

interface Position {
  $position: Point;
}

const StyledList = styled.ul<Position>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

// --- 拆分为两个 Context ---

// StateContext：携带会变化的状态，Toggle 和 List 订阅
interface MenusStateContextProps {
  openId: string;
  position: Point | null;
}

// DispatchContext：只携带操作函数，引用永远稳定，Button 订阅
interface MenusDispatchContextProps {
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
  setPosition: Dispatch<SetStateAction<Point | null>>;
  toggle: (id: string) => void;
}

const MenusStateContext = createContext<MenusStateContextProps | undefined>(
  undefined,
);
const MenusDispatchContext = createContext<
  MenusDispatchContextProps | undefined
>(undefined);

function useMenusStateContext() {
  const context = useContext(MenusStateContext);
  if (!context)
    throw new Error(
      "useMenusStateContext must be used within a Menus provider",
    );
  return context;
}

function useMenusDispatchContext() {
  const context = useContext(MenusDispatchContext);
  if (!context)
    throw new Error(
      "useMenusDispatchContext must be used within a Menus provider",
    );
  return context;
}

interface Menus {
  children: ReactNode;
}

function Menus({ children }: Menus) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<Point | null>(null);

  const toggle = useCallback((id: string) => {
    //当前没有打开菜单按钮，或打开的菜单按钮不是当前菜单按钮
    setOpenId((curId) => (curId === "" || curId !== id ? id : ""));
  }, []);
  const close = useCallback(() => setOpenId(""), []);
  const open = setOpenId;

  const dispatchValue = useMemo(
    () => ({ open, close, setPosition, toggle }),
    [open, close, toggle],
  );

  return (
    <MenusDispatchContext.Provider value={dispatchValue}>
      <MenusStateContext.Provider value={{ openId, position }}>
        {children}
      </MenusStateContext.Provider>
    </MenusDispatchContext.Provider>
  );
}

interface ToggleProps {
  id: string;
}

// Toggle 订阅 StateContext（需要 openId 判断开关逻辑）+ DispatchContext（执行操作）
function Toggle({ id }: ToggleProps) {
  const { setPosition, toggle } = useMenusDispatchContext();

  // e.stopPropagation()
  // 配合下面List中的事件冒泡阶段的useOutsideClick保证菜单按钮的正常开关
  // 方法二见useOutsideClick内部实现
  function handleToggle(e: MouseEvent) {
    const rect = (e.target as HTMLElement)
      .closest("button")!
      .getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    toggle(id);
  }

  return (
    <StyledToggle onClick={handleToggle}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  id: string;
  children: ReactNode;
}

function List({ id, children }: ListProps) {
  const { openId, position } = useMenusStateContext();
  if (openId !== id || !position) return null;
  return <ListWindow position={position}>{children}</ListWindow>;
}

interface ListWindowProps {
  position: Point;
  children: ReactNode;
}

function ListWindow({ position, children }: ListWindowProps) {
  const { close } = useMenusDispatchContext();

  useOutsideScroll(close, true);

  const ref = useOutsideClick<HTMLUListElement>(close);

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  );
}

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

// Button 只订阅 DispatchContext：openId/position 变化不会触发它重渲染
function Button({ children, icon, onClick }: ButtonProps) {
  const { close } = useMenusDispatchContext();

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;

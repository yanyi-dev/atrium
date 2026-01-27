import {
  createContext,
  useContext,
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

interface MenusContextProps {
  openId: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
  position: Point | null;
  setPosition: Dispatch<SetStateAction<Point | null>>;
}

const MenusContext = createContext<MenusContextProps | undefined>(undefined);

function useMenusContext() {
  const context = useContext(MenusContext);

  if (!context)
    throw new Error("useMenus must be used within a Menus provider");

  return context;
}

interface Menus {
  children: ReactNode;
}

function Menus({ children }: Menus) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<Point | null>(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

interface ToggleProps {
  id: string;
}

function Toggle({ id }: ToggleProps) {
  const { openId, open, close, setPosition } = useMenusContext();

  function handleToggle(e: MouseEvent) {
    // e.stopPropagation()
    //配合下面List中的事件冒泡阶段的useOutsideClick保证菜单按钮的正常开关
    //方法二见useOutsideClick内部实现

    const rect = (e.target as HTMLElement)
      .closest("button")!
      .getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    //当前没有打开菜单按钮，或打开的菜单按钮不是当前菜单按钮
    // openId === "" || openId !== id ? open(id) : close();
    if (openId === "" || openId !== id) open(id);
    else close();
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
  const { openId, position, close } = useMenusContext();

  //在当前窗口打开的情况下滚动，才关闭
  useOutsideScroll(close, openId === id);
  const ref = useOutsideClick<HTMLUListElement>(close);
  // const ref = useOutsideClick(close,false);

  if (openId !== id || !position) return null;

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

function Button({ children, icon, onClick }: ButtonProps) {
  const { close } = useMenusContext();
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

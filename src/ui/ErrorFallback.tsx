import styled from "styled-components";
import Heading from "./Heading";
import GlobalStyles from "../styles/GlobalStyles";
import Button from "./Button";
import { FallbackProps } from "react-error-boundary";

const StyledErrorFallback = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 1.6rem;
  }

  & p {
    font-family: "Sono";
    margin-bottom: 3.2rem;
    color: var(--color-grey-500);
  }
`;

/*
错误边界（Error Boundary）能处理哪些错误？
错误边界像是一个“安全网”，它专门负责捕获其子组件树在 React 生命周期内发生的运行时错误：

渲染逻辑中 (Render phase)：例如在 JSX 里尝试读取一个 undefined.map()。

生命周期方法中：例如 useEffect 或 componentDidMount 里的同步执行逻辑。

构造函数中：组件类实例化时抛出的错误。
 */

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <>
      <GlobalStyles />
      <StyledErrorFallback>
        <Box>
          <Heading as="h1">Something went wrong 🧐</Heading>
          <p>{error.message}</p>
          <Button $size="large" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}

export default ErrorFallback;

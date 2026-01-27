import styled, { css } from "styled-components";

interface RowProps {
  $type?: string;
}

const Row = styled.div<RowProps>`
  display: flex;

  ${(props) =>
    props.$type === "horizontal" &&
    css`
      align-items: center;
      justify-content: space-between;
    `}

  ${(props) =>
    props.$type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

//设置默认props对象，现在更推荐使用默认参数代替
Row.defaultProps = {
  $type: "vertical",
};

export default Row;

import styled, { css } from "styled-components";

//创建一个组件，并将模板字符串里的样式注入其中
//classname随机命名且唯一，不冲突
//底层为一个h1标签
//能接收props并传递给相应底层元素
// const H1 = styled.h1`
//   font-size: 30px;
//   font-weight: 600;
//   background-color: yellow;
// `;

//对组件本身进行样式化，将样式注入其jsx的最大标签即可
// const StyledApp = styled.main`
//   background-color: orangered;
//   padding: 20px;
// `;

//这里css的作用是获得语法高亮与提示
// const test = css`
//   text-align: center;
// `;

//props即组件接收的属性对象
//as是styled-components提供的特殊props，可动态改变渲染的html标签
//css函数可以创建一个可嵌套的样式对象
const Heading = styled.h1`
  //插值函数，即用模板字符串包裹的函数表达式
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}
      ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
    `}
`;

export default Heading;

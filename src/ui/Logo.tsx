import styled from "styled-components";
// import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
`;

// const Img = styled.img`
//   height: 9.6rem;
//   width: auto;
// `;

function Logo() {
  // const { isDarkMode } = useDarkMode();

  // const src = isDarkMode ? "/(深色logo名).png" : "/(浅色logo名).png";

  return (
    <StyledLogo>
      <h1>Atrium</h1>
      <h3>雅庭旅宿管理系统</h3>
    </StyledLogo>
  );
}

export default Logo;

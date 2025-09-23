import styled from "styled-components";

export const StyledSocialIcons = styled.div`
  svg {
    position: relative;
    top: 5px;
  }
  .google-icon {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding-left: 24px;
    width: 100%;
    border-radius: 44px;
    border: 1px solid #252b61;
    background: #fff;
    font-style: normal;
    font-weight: 500;
    background-color: transparent;
    padding: 15px 24px;
    font-size: 24px;
  }
  @media (max-width: 768px) {
    .google-icon {
      padding: 12px 24px;
    }
  }
`;

import { media, styled } from "@styles";
import { css } from "styled-components";

const textProps = css`
  font-size: ${props => props.theme.typography.baseFontSize};
  margin: 0 0 0.5rem 0;
  text-align: left;
`;

export const Wrapper = styled.div`
  background: ${props => props.theme.colors.light};
  padding: 2rem;
  text-align: center;
  transition: 0.3s;

  :hover {
    background-color: ${props => props.theme.colors.hoverLightBackground};
  }

  ${media.largeScreen`
    padding: 1.8rem;
  `}
`;

export const Title = styled.h4`


  ${textProps}
  text-align:center;
   font-size:1.1em;
`;

export const Price = styled.p`
  ${textProps}
  text-align:center;
`;

export const Image = styled.div`
  width: auto;
  height: auto;
  max-width: 100%;

  > img {
    max-width:255px;

    height: auto;

  }
`;

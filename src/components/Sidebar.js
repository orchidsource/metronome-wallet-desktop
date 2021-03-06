import { ConverterIcon, AuctionIcon, WalletIcon, LogoIcon, Sp } from './common'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import CogIcon from './common/CogIcon'
import styled from 'styled-components'
import Logo from './Logo'

const { shell } = window.require('electron')

const Container = styled.div`
  background: ${p => p.theme.colors.bg.darkGradient};
  width: 64px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 3;
  &:hover {
    width: 200px;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  }
  @media (min-width: 800px) {
    position: static;
    width: 200px;
    &:hover {
      box-shadow: none;
    }
  }
`

const LogoLargeContainer = styled.div`
  padding: 3.2rem 3.2rem 5.6rem;
  height: 125px;
  display: none;
  flex-shrink: 0;
  @media (min-width: 800px) {
    display: block;
  }
`

const LogoSmallContainer = styled.div`
  padding: 2.3rem 1.6rem;
  height: 125px;
  display: block;
  flex-shrink: 0;
  @media (min-width: 800px) {
    display: none;
  }
`

const SecondaryNavIcon = styled.div`
  padding: 3.2rem 0 2.4rem 1.9rem;
  display: block;

  @media (min-height: 650px) {
    padding-top: 6rem;
  }

  @media (min-width: 800px) {
    display: none;
  }

  & svg {
    opacity: 0.5;
    transition: transform 0.3s;
    transform: rotate(0deg);
    transform-origin: center center;
  }

  ${Container}:hover & svg {
    opacity: 1;
    transform: rotate(-90deg);
  }
`

const MainMenu = styled.nav`
  flex-grow: 1;
`

const Button = styled(NavLink)`
  display: flex;
  min-height: 7.1rem;
  align-items: center;
  text-decoration: none;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.light};
  padding: 1.6rem;
  transition: 0.5s;
  opacity: 0.5;
  border-bottom: 2px solid ${p => p.theme.colors.darkShade};
  &:focus {
    outline: none;
  }
  &:first-child {
    border-top: 2px solid ${p => p.theme.colors.darkShade};
  }
  &.active {
    border-bottom-color: ${p => p.theme.colors.primary};
    background-image: linear-gradient(
      250deg,
      rgba(66, 53, 119, 0.4),
      rgba(126, 97, 248, 0.1)
    );
    opacity: 1;
  }
`

const IconWrapper = styled.div`
  margin-right: 1.6rem;
  margin-left: 0.3rem;
`

const BtnText = styled.span`
  opacity: 0;
  ${Container}:hover & {
    opacity: 1;
  }
  @media (min-width: 800px) {
    opacity: 1;
  }
`

// TODO: Reuse SecondaryLink & SecondaryBtn styles
const SecondaryBtn = styled(NavLink)`
  display: block;
  text-decoration: none;
  color: ${p => p.theme.colors.light};
  padding: 0.8rem 1.6rem;
  line-height: 2rem;
  opacity: 0;
  transition: all 600ms, opacity 200ms, transform 800ms;
  position: relative;
  &[disabled] {
    pointer-events: none;
  }
  &:focus {
    outline: none;
  }
  &.active {
    padding-left: 3.2rem;
  }
  &:before {
    transition: 0.4s;
    transition-delay: 0.2s;
    opacity: 0;
    content: '';
    display: block;
    background-color: ${p => p.theme.colors.primary};
    border-radius: 100%;
    position: absolute;
    top: 50%;
    margin-top: -2px;
    left: 1.6rem;
  }
  &.active:before {
    opacity: 1;
    width: 8px;
    height: 8px;
  }

  &:nth-child(1) {
    transform: translateY(9.6rem);
  }

  &:nth-child(2) {
    transform: translateY(6rem);
  }

  ${Container}:hover & {
    transform: translateY(0);
    opacity: 0.5;
    transition: all 600ms, opacity 400ms, transform 400ms;
    transition-delay: 0s, 100ms, 0s;

    &.active {
      opacity: 1;
    }
  }

  @media (min-width: 800px) {
    ${Container} & {
      transform: translateY(0);
    }
    opacity: 0.5;
    &.active {
      opacity: 1;
    }
  }
`

const SecondaryLink = styled.a`
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: ${p => p.theme.colors.light};
  padding: 0.8rem 1.6rem;
  line-height: 2rem;
  opacity: 0;
  transition: all 600ms, opacity 200ms, transform 800ms;
  position: relative;
  &[disabled] {
    pointer-events: none;
  }
  &:focus {
    outline: none;
  }
  &.active {
    padding-left: 3.2rem;
  }
  &:before {
    transition: 0.4s;
    transition-delay: 0.2s;
    opacity: 0;
    content: '';
    display: block;
    background-color: ${p => p.theme.colors.primary};
    border-radius: 100%;
    position: absolute;
    top: 50%;
    margin-top: -2px;
    left: 1.6rem;
  }
  &.active:before {
    opacity: 1;
    width: 8px;
    height: 8px;
  }

  &:nth-child(1) {
    transform: translateY(9.6rem);
  }

  &:nth-child(2) {
    transform: translateY(6rem);
  }

  ${Container}:hover & {
    transform: translateY(0);
    opacity: 0.5;
    transition: all 600ms, opacity 400ms, transform 400ms;
    transition-delay: 0s, 100ms, 0s;

    &.active {
      opacity: 1;
    }
  }

  @media (min-width: 800px) {
    ${Container} & {
      transform: translateY(0);
    }
    opacity: 0.5;
    &.active {
      opacity: 1;
    }
  }
`

const Footer = styled.div`
  padding: 4.8rem 1.6rem 2.4rem;
  height: 108px;
  display: none;

  @media (min-width: 800px) {
    display: block;
  }
`

class Sidebar extends Component {
  render() {
    return (
      <Container>
        <LogoLargeContainer>
          <Logo />
        </LogoLargeContainer>
        <LogoSmallContainer>
          <LogoIcon negative />
        </LogoSmallContainer>

        <MainMenu>
          <Button
            activeClassName="active"
            data-testid="wallets-nav-btn"
            to="/wallets"
          >
            <IconWrapper>
              <WalletIcon />
            </IconWrapper>
            <BtnText>Wallet</BtnText>
          </Button>
          <Button
            activeClassName="active"
            data-testid="auction-nav-btn"
            to="/auction"
          >
            <IconWrapper>
              <AuctionIcon />
            </IconWrapper>
            <BtnText>Auction</BtnText>
          </Button>
          <Button
            activeClassName="active"
            data-testid="converter-nav-btn"
            to="/converter"
          >
            <IconWrapper>
              <ConverterIcon />
            </IconWrapper>
            <BtnText>Converter</BtnText>
          </Button>
        </MainMenu>
        <Sp mt={2}>
          <SecondaryBtn
            activeClassName="active"
            to="/tools"
            data-testid="tools-nav-btn"
          >
            Tools
          </SecondaryBtn>
          <SecondaryLink
            activeClassName="active"
            onClick={() => shell.openExternal('https://github.com/autonomoussoftware/documentation/blob/master/FAQ.md#metronome-faq')}
            data-testid="help-nav-btn"
          >
            Help
          </SecondaryLink>
          <SecondaryNavIcon>
            <CogIcon size="2.4rem" />
          </SecondaryNavIcon>
        </Sp>
        <Footer>
          <LogoIcon negative />
        </Footer>
      </Container>
    )
  }
}

export default Sidebar

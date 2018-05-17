import { TextInput, BaseBtn, Checkbox, Btn, Sp } from './common'
import { sanitizeMnemonic } from '../utils'
import * as validators from '../validator'
import EntropyMeter from './EntropyMeter'
import AltLayout from './AltLayout'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import React from 'react'
import bip39 from 'bip39'

const { shell } = window.require('electron')

const Message = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;

  & span {
    text-decoration: underline;
    cursor: pointer;
    color: ${p => p.theme.colors.success};
  }
`

const Green = styled.div`
  display: inline-block;
  color: ${p => p.theme.colors.success};
`

const Mnemonic = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 2;
  text-align: center;
  color: ${p => p.theme.colors.primary};
  word-spacing: 1.6rem;
`

const RecoverBtn = styled(BaseBtn)`
  font-size: 1.2rem;
  :hover {
    opacity: 0.75;
  }
`

const ErrorMsg = styled.div`
  color: ${p => p.theme.colors.danger};
  margin-top: 1.6rem;
  text-align: center;
`

export default class Onboarding extends React.Component {
  static propTypes = {
    onOnboardingCompleted: PropTypes.func.isRequired
  }

  state = {
    isDataCollectionAllowed: true,
    passwordWasDefined: false,
    termsWereAccepted: false,
    mnemonicWasCopied: false,
    useOwnMnemonic: false,
    passwordAgain: null,
    mnemonicAgain: null,
    userMnemonic: null,
    password: null,
    mnemonic: bip39.generateMnemonic(),
    errors: {},
    error: null
  }

  onDataCollectionToggled = e => {
    this.setState({ isDataCollectionAllowed: e.target.checked })
  }

  onTermsAccepted = () => this.setState({ termsWereAccepted: true })

  onInputChanged = e => {
    const { id, value } = e.target
    this.setState(state => ({
      ...state,
      [id]: value,
      errors: { ...state.errors, [id]: null },
      error: null
    }))
  }

  onUseOwnMnemonicToggled = () => {
    this.setState(state => ({
      ...state,
      useOwnMnemonic: !state.useOwnMnemonic,
      userMnemonic: null,
      errors: {
        ...state.errors,
        userMnemonic: null
      }
    }))
  }

  onMnemonicWasCopiedToggled = () => {
    this.setState(state => ({
      ...state,
      mnemonicWasCopied: !state.mnemonicWasCopied,
      mnemonicAgain: null,
      errors: {
        ...state.errors,
        mnemonicAgain: null
      }
    }))
  }

  onPasswordSubmitted = e => {
    e.preventDefault()

    const errors = this.validatePass()
    if (Object.keys(errors).length > 0) return this.setState({ errors })

    this.setState({ passwordWasDefined: true })
  }

  // Perform validations and return an object of type { fieldId: [String] }
  validatePass = () => {
    const { password, passwordAgain } = this.state
    const errors = validators.validatePasswordCreation(password)

    if (!errors.password && !passwordAgain) {
      errors.passwordAgain = 'Repeat the password'
    } else if (!errors.password && passwordAgain !== password) {
      errors.passwordAgain = "Passwords don't match"
    }

    return errors
  }

  onMnemonicAccepted = ev => {
    ev.preventDefault()

    const {
      isDataCollectionAllowed,
      useOwnMnemonic,
      mnemonicAgain,
      userMnemonic,
      mnemonic,
      password
    } = this.state

    if (useOwnMnemonic) {
      const errors = validators.validateMnemonic(
        sanitizeMnemonic(userMnemonic),
        'userMnemonic'
      )
      if (Object.keys(errors).length > 0) return this.setState({ errors })
    } else {
      if (mnemonic !== sanitizeMnemonic(mnemonicAgain)) {
        return this.setState({
          errors: {
            mnemonicAgain:
              'The text provided does not match your recovery passphrase.'
          }
        })
      }
    }

    this.props
      .onOnboardingCompleted({
        dataCollection: isDataCollectionAllowed,
        password,
        mnemonic: useOwnMnemonic ? sanitizeMnemonic(userMnemonic) : mnemonic
      })
      .catch(({ message }) =>
        this.setState({ status: 'failure', error: message || 'Unknown error' })
      )
  }

  render() {
    const {
      isDataCollectionAllowed,
      passwordWasDefined,
      termsWereAccepted,
      mnemonicWasCopied,
      useOwnMnemonic,
      passwordAgain,
      mnemonicAgain,
      userMnemonic,
      password,
      mnemonic,
      errors,
      error
    } = this.state

    const title = !termsWereAccepted
      ? 'Accept to Continue'
      : !passwordWasDefined ? 'Define a Password' : 'Recovery Passphrase'

    const getWordsAmount = phrase =>
      sanitizeMnemonic(phrase || '').split(' ').length

    const shouldSubmit = phrase => getWordsAmount(phrase) === 12

    const getTooltip = phrase =>
      shouldSubmit(phrase)
        ? null
        : 'A recovery phrase must have exactly 12 words'

    return (
      <AltLayout title={title} data-testid="onboarding-container">
        {!termsWereAccepted && (
          <React.Fragment>
            <Message>
              By clicking “Accept”, you confirm you have read and agreed to our{' '}
              <span onClick={() => shell.openExternal('http://metronome.io')}>
                software license
              </span>.
            </Message>

            <Sp mt={3}>
              <Checkbox
                data-testid="allow-data-collection"
                onChange={this.onDataCollectionToggled}
                checked={isDataCollectionAllowed}
                label="Allow anonymous data collection"
              >
                This only includes your platform type, app version and
                geolocation. No wallet information or keys will be collected.{' '}
                <b>You will be able to change this setting at any time</b>.
              </Checkbox>
            </Sp>

            <Sp mt={5}>
              <Btn
                data-testid="accept-terms-btn"
                autoFocus
                onClick={this.onTermsAccepted}
                block
              >
                Accept
              </Btn>
            </Sp>
          </React.Fragment>
        )}
        {termsWereAccepted &&
          !passwordWasDefined && (
            <form onSubmit={this.onPasswordSubmitted} data-testid="pass-form">
              <Message>
                Enter a strong password until the meter turns{' '}
                <Green>green</Green>.
              </Message>
              <Sp mt={2}>
                <TextInput
                  data-testid="pass-field"
                  autoFocus
                  onChange={this.onInputChanged}
                  error={errors.password}
                  label="Password"
                  value={password}
                  type="password"
                  id="password"
                  noFocus
                />
                {!errors.password && (
                  <EntropyMeter targetEntropy={72} password={password} />
                )}
              </Sp>
              <Sp mt={3}>
                <TextInput
                  data-testid="pass-again-field"
                  onChange={this.onInputChanged}
                  error={errors.passwordAgain}
                  label="Repeat password"
                  value={passwordAgain}
                  type="password"
                  id="passwordAgain"
                />
              </Sp>
              <Sp mt={6}>
                <Btn block submit>
                  Continue
                </Btn>
              </Sp>
            </form>
          )}
        {termsWereAccepted &&
          passwordWasDefined && (
            <form
              data-testid="mnemonic-form"
              onSubmit={this.onMnemonicAccepted}
            >
              {useOwnMnemonic ? (
                <Message>
                  Enter a valid 12 word passphrase to recover a previously
                  created wallet.
                </Message>
              ) : mnemonicWasCopied ? (
                <Message>
                  To verify you have copied the recovery passphrase correctly,
                  enter the 12 words provided before in the field below.
                </Message>
              ) : (
                <Message>
                  Copy the following word list and keep it in a safe place. You
                  will need these to recover your wallet in the future —don’t
                  lose it.
                </Message>
              )}
              <Sp mt={3} mx={-8}>
                {useOwnMnemonic || mnemonicWasCopied ? (
                  <TextInput
                    data-testid="mnemonic-field"
                    autoFocus
                    onChange={this.onInputChanged}
                    label="Recovery passphrase"
                    error={
                      useOwnMnemonic
                        ? errors.userMnemonic
                        : errors.mnemonicAgain
                    }
                    value={
                      (useOwnMnemonic ? userMnemonic : mnemonicAgain) || ''
                    }
                    rows={3}
                    id={useOwnMnemonic ? 'userMnemonic' : 'mnemonicAgain'}
                  />
                ) : (
                  <Mnemonic data-testid="mnemonic-label">{mnemonic}</Mnemonic>
                )}
                {error && <ErrorMsg data-testid="error-msg">{error}</ErrorMsg>}
              </Sp>

              <Sp mt={5}>
                {useOwnMnemonic ? (
                  <Btn
                    data-rh-negative
                    data-disabled={!shouldSubmit(userMnemonic)}
                    data-rh={getTooltip(userMnemonic)}
                    submit={shouldSubmit(userMnemonic)}
                    block
                  >
                    Recover
                  </Btn>
                ) : mnemonicWasCopied ? (
                  <Btn
                    data-rh-negative
                    data-disabled={!shouldSubmit(mnemonicAgain)}
                    data-rh={getTooltip(mnemonicAgain)}
                    submit={shouldSubmit(mnemonicAgain)}
                    block
                    key="sendMnemonic"
                  >
                    Done
                  </Btn>
                ) : (
                  <Btn
                    data-testid="copied-mnemonic-btn"
                    autoFocus
                    onClick={this.onMnemonicWasCopiedToggled}
                    block
                    key="confirmMnemonic"
                  >
                    {"I've copied it"}
                  </Btn>
                )}
              </Sp>
              <Sp mt={2}>
                {useOwnMnemonic ? (
                  <RecoverBtn
                    data-testid="cancel-btn"
                    onClick={this.onUseOwnMnemonicToggled}
                    block
                  >
                    Cancel
                  </RecoverBtn>
                ) : mnemonicWasCopied ? (
                  <RecoverBtn
                    data-testid="goback-btn"
                    onClick={this.onMnemonicWasCopiedToggled}
                    block
                  >
                    Go back
                  </RecoverBtn>
                ) : (
                  <RecoverBtn
                    data-testid="recover-btn"
                    onClick={this.onUseOwnMnemonicToggled}
                    block
                  >
                    Or recover a wallet from a saved passphrase
                  </RecoverBtn>
                )}
              </Sp>
            </form>
          )}
      </AltLayout>
    )
  }
}

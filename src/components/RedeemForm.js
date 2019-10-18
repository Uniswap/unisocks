import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styled from 'styled-components'

import { useWeb3Context } from 'web3-react'
import ReCAPTCHA from 'react-google-recaptcha'

import Suggest from './Suggest'

// we need to capture the full address into netlify...
// https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/
function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

// variables for the netlify names of each form field
const bot = 'beep-boop'
const name = 'name'
const line1 = 'line1'
const line2 = 'line2'
const city = 'city'
const state = 'state'
const zip = 'zip'
const country = 'country'
const email = 'email'
const address = 'address'
const timestamp = 'timestamp'
const numberBurned = 'number-burned'
const signature = 'signature'

// map from variables to display text for each field
const nameMap = {
  [name]: 'Name',
  [line1]: 'Street Address',
  [line2]: 'Unit',
  [city]: 'City',
  [state]: 'State',
  [zip]: 'ZIP',
  [country]: 'Country',
  [email]: 'Email',
  [address]: 'Ethereum Address',
  [timestamp]: 'Time',
  [numberBurned]: 'SOCKS Redeemed'
}

// the order for fields that will be submitted
const nameOrder = [name, line1, line2, city, state, zip, country, email]

// default for each form field
const defaultState = {
  [bot]: '',
  [name]: '',
  [line1]: '',
  [line2]: '',
  [city]: '',
  [state]: '',
  [zip]: '',
  [country]: '',
  [email]: ''
}

// mapping from field to google maps return value
const addressMapping = [
  { [line1]: 'street_address' },
  { [city]: 'sublocality' },
  { [state]: 'administrative_area_level_1' },
  { [zip]: 'postal_code' },
  { [country]: 'country' }
]

const recaptchaEnabled = false

export default function RedeemForm({ setHasConfirmedAddress, setUserAddress, numberBurned: actualNumberBurned }) {
  const { library, account } = useWeb3Context()
  const [recaptcha, setRecaptcha] = useState()
  const [autoAddress, setAutoAddress] = useState([])
  const [inputY, setInputY] = useState(0)
  const suggestEl = useRef()

  const [formState, setFormState] = useState(defaultState)

  function handleChange(event) {
    const { name, value } = event.target
    setFormState(state => ({ ...state, [name]: value }))
  }

  function updateAutoFields(address) {
    let constructedStreetAddress = ''
    function getTypes(addressItem, addressVal, item) {
      addressItem.forEach(type => {
        if (Object.keys(item)[0] === line1) {
          if (type === 'street_number') {
            constructedStreetAddress += addressVal
          } else if (type === 'route') {
            constructedStreetAddress += ' ' + addressVal
          }
          setFormState(state => ({ ...state, [Object.keys(item)[0]]: constructedStreetAddress }))
        } else if (Object.keys(item)[0] === city) {
          if (type === 'sublocality' || type === 'locality') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        } else if (Object.keys(item)[0] === state) {
          if (type === 'administrative_area_level_1') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        } else if (Object.keys(item)[0] === country) {
          if (type === 'country') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        } else if (Object.keys(item)[0] === zip) {
          if (type === 'postal_code') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        }
      })
    }

    addressMapping.forEach(item => {
      address.forEach(addressItem => {
        getTypes(addressItem.types, addressItem.long_name, item)
      })
    })
  }

  // keep acount in sync
  useEffect(() => {
    setUserAddress(autoAddress['formatted_address'])
    updateAutoFields(autoAddress['address_components'] ? autoAddress['address_components'] : [])
    handleChange({ target: { name: [address], value: account } })
  }, [account, autoAddress, setUserAddress])

  useLayoutEffect(() => {
    if (suggestEl.current) {
      setInputY(suggestEl.current.getBoundingClientRect().bottom)
    }
  }, [suggestEl])

  const canSign =
    formState[name] &&
    formState[line1] &&
    formState[city] &&
    formState[state] &&
    formState[zip] &&
    formState[country] &&
    formState[email]

  function onRecaptcha(value) {
    if (value) {
      setRecaptcha(value)
    }
  }

  return (
    <FormFrame autocomplete="off">
      <input hidden type="text" name="beep-boop" value={formState[bot]} onChange={handleChange} />
      <input
        required
        type="text"
        name={name}
        value={formState[name]}
        onChange={handleChange}
        placeholder={nameMap[name]}
        autoComplete="name"
      />
      <Compressed>
        <Suggest
          required
          myRef={suggestEl}
          inputY={inputY}
          setAutoAddress={setAutoAddress}
          type="text"
          name={line1}
          value={formState[line1]}
          onChange={handleChange}
          placeholder={nameMap[line1]}
          autoComplete="off"
        />

        <input
          type="text"
          name={line2}
          value={formState[line2]}
          onChange={handleChange}
          placeholder={nameMap[line2]}
          autoComplete="off"
        />
      </Compressed>
      <input
        required
        type="text"
        name={city}
        value={formState[city]}
        onChange={handleChange}
        placeholder={nameMap[city]}
        autoComplete="address-level2"
      />

      <Compressed>
        <input
          style={{ marginRight: '8px' }}
          required
          type="text"
          name={state}
          value={formState[state]}
          onChange={handleChange}
          placeholder={nameMap[state]}
          autoComplete="address-level1"
        />
        <input
          required
          type="text"
          name={zip}
          value={formState[zip]}
          onChange={handleChange}
          placeholder={nameMap[zip]}
          autoComplete="postal-code"
        />
      </Compressed>

      <input
        required
        type="text"
        name={country}
        value={formState[country]}
        onChange={handleChange}
        placeholder={nameMap[country]}
        autoComplete="country-name"
      />

      <input
        required
        type="email"
        name={email}
        value={formState[email]}
        onChange={handleChange}
        placeholder={nameMap[email]}
        autoComplete="email"
      />

      {recaptchaEnabled && <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_RECAPTCHA_KEY} onChange={onRecaptcha} />}
      <ButtonFrame
        type="submit"
        disabled={!canSign || (recaptchaEnabled && !!!recaptcha)}
        onClick={event => {
          const signer = library.getSigner()
          const timestampToSign = Math.round(Date.now() / 1000)

          const header = `PLEASE VERIFY YOUR ADDRESS.\nYour data will never be shared publicly.`
          const formDataMessage = nameOrder.map(o => `${nameMap[o]}: ${formState[o]}`).join('\n')
          const autoMessage = `${nameMap[address]}: ${account}\n${nameMap[timestamp]}: ${timestampToSign}\n${nameMap[numberBurned]}: ${actualNumberBurned}`

          signer.signMessage(`${header}\n\n${formDataMessage}\n${autoMessage}`).then(returnedSignature => {
            fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: encode({
                'form-name': 'redeem',
                ...{
                  ...formState,
                  [address]: account,
                  [timestamp]: timestampToSign,
                  [numberBurned]: actualNumberBurned,
                  [signature]: returnedSignature,
                  ...(recaptchaEnabled ? { 'g-recaptcha-response': recaptcha } : {})
                }
              })
            })
              .then(() => {
                setHasConfirmedAddress(true)
              })
              .catch(console.error)
          })

          event.preventDefault()
        }}
      >
        {canSign ? 'Next' : 'Complete the form to continue'}
      </ButtonFrame>
      <br />
    </FormFrame>
  )
}

const FormFrame = styled.form`
  width: 100%;
  color: #fff;
  font-weight: 600;
  margin: 16px;
  /* margin-bottom: 0px; */
  font-size: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  input {
    border: none;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    color: #000;
    background-color: #f1f2f6;
    padding: 8px;
    margin: 4px 0 4px 0;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
  }
  input:required {
    box-shadow: inset 0 0 0 1px rgba(254, 109, 222, 0.5);
  }
  input:valid {
    border: nne;
    box-shadow: none;
  }
`

const Compressed = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const ButtonFrame = styled.button`
  padding: 0;
  text-align: center;
  border-radius: 8px;
  box-sizing: border-box;
  height: 48px;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border: none;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};

  background: linear-gradient(97.28deg, #fe6dde 2.08%, #ff9dea 106.51%);
  box-shadow: 0px 4px 20px rgba(239, 162, 250, 0.7);
  background: ${props => (props.disabled ? '#f1f2f6' : 'linear-gradient(97.28deg, #fe6dde 2.08%, #ff9dea 106.51%)')};
  box-shadow: ${props => (props.disabled ? 'none' : '0px 4px 20px rgba(239, 162, 250, 0.7)')};
  color: ${props => (props.disabled ? '#aeaeae' : props.theme.white)};
  transform: scale(1);
  transition: transform 0.3s ease;
  text-align: center;
  margin-top: 4px;

  :hover {
    transform: scale(0.99);
  }
`

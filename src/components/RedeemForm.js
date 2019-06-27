import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import ReCAPTCHA from 'react-google-recaptcha'

// https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/
function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

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
const signature = 'signature'

const nameMap = {
  [name]: 'Name',
  [line1]: 'Line1',
  [line2]: 'Line2',
  [city]: 'City',
  [state]: 'State',
  [zip]: 'Postal Code',
  [country]: 'Country',
  [email]: 'Email',
  [address]: 'Ethereum Address'
}

const nameOrder = [name, line1, line2, city, state, zip, country, email, address]

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

const recaptchaEnabled = false

export default function RedeemForm({ setHasConfirmedAddress }) {
  const { library, account } = useWeb3Context()
  const [recaptcha, setRecaptcha] = useState()
  const [formState, setFormState] = useState({ ...defaultState, [address]: account })

  function handleChange(event) {
    const { name, value } = event.target
    setFormState(state => ({ ...state, [name]: value }))
  }

  // keep acount in sync
  useEffect(() => {
    handleChange({ target: { name: [address], value: account } })
  }, [account])

  const canSign =
    true ||
    (formState.name && formState.line1 && formState.city && formState.state && formState.zip && formState.country)

  function onRecaptcha(value) {
    if (value) {
      setRecaptcha(value)
    }
  }

  return (
    <form>
      <input hidden type="text" name="beep-boop" value={formState.bot} onChange={handleChange} />
      <input required type="text" name={name} value={formState.name} onChange={handleChange} placeholder={name} />
      <br />
      <input required type="text" name={line1} value={formState.line1} onChange={handleChange} placeholder={line1} />
      <br />
      <input type="text" name={line2} value={formState.line2} onChange={handleChange} placeholder={line2} />
      <br />
      <input required type="text" name={city} value={formState.city} onChange={handleChange} placeholder={city} />
      <br />
      <input required type="text" name={state} value={formState.state} onChange={handleChange} placeholder={state} />
      <br />
      <input required type="text" name={zip} value={formState.zip} onChange={handleChange} placeholder={zip} />
      <br />
      <input
        required
        type="text"
        name={country}
        value={formState.country}
        onChange={handleChange}
        placeholder={country}
      />
      <br />
      <input type="email" name={email} value={formState.email} onChange={handleChange} placeholder={email} />
      <br />
      {recaptchaEnabled && <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_RECAPTCHA_KEY} onChange={onRecaptcha} />}
      <button
        type="submit"
        disabled={!canSign || (recaptchaEnabled && !!!recaptcha)}
        onClick={event => {
          const signer = library.getSigner()
          const header = `Your data will never be shared publicly. Please verify the information below. :)`
          const message = nameOrder.map(o => `${nameMap[o]}: ${formState[o]}`).join('\n')
          signer.signMessage(`${header}\n\n${message}`).then(returnedSignature => {
            fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: encode({
                'form-name': 'redeem',
                ...{
                  ...formState,
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
        Confirm Address
      </button>
      <br />
    </form>
  )
}

import { ethers } from 'ethers'
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

function returnError(message, statusCode = 400) {
  return {
    statusCode,
    body: JSON.stringify({ error: message })
  }
}

function returnSuccess(data, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(data)
  }
}

export async function handler(event) {
  const { payload } = JSON.parse(event.body)
  const { data } = payload

  const {
    name,
    line1,
    line2,
    city,
    state,
    zip,
    country,
    email,
    address: _address,
    timestamp,
    'number-burned': numberBurned,
    signature
  } = data

  const address = isAddress(_address)

  if (!address || !signature || !timestamp) {
    console.log(data)
    return returnError('Invalid Arguments')
  }

  const m1 = `PLEASE VERIFY YOUR ADDRESS.\nYour data will never be shared publicly.`
  const m2 = `Name: ${name}\nStreet Address: ${line1}\nUnit: ${line2}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nCountry: ${country}\nEmail: ${email}`
  const m3 = `Ethereum Address: ${address}\nTime: ${timestamp}\nSOCKS Redeemed: ${numberBurned}`

  const addressOfSigner = ethers.utils.verifyMessage(`${m1}\n\n${m2}\n${m3}`, signature)
  const isInvalid = addressOfSigner !== address

  if (isInvalid) {
    console.log('Unauthorized!', `${m1}\n\n${m2}\n${m3}`, signature, address)
  }

  try {
    await client.query(
      q.Create(q.Collection('addresses'), {
        data: {
          numberOfSocks: Number(numberBurned),
          timestamp: Number(timestamp),
          addressPhysical: {
            name,
            line1,
            line2,
            city,
            state,
            zip,
            country,
            email
          },
          addressEthereum: address,
          signature,
          invalid: isInvalid,
          matched: false
        }
      })
    )
    return returnSuccess({ message: 'Success' })
  } catch (error) {
    console.error(error)
    return returnError('Unknown Error')
  }
}

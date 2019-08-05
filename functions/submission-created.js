// import { ethers, utils } from 'ethers'
// const faunadb = require('faunadb')

// const q = faunadb.query
// const client = new faunadb.Client({
//   secret: process.env.FAUNADB_SERVER_SECRET
// })

// function isAddress(value) {
//   try {
//     return ethers.utils.getAddress(value.toLowerCase())
//   } catch {
//     return false
//   }
// }

// function returnError(message, statusCode = 400) {
//   return {
//     statusCode,
//     body: JSON.stringify({ error: message })
//   }
// }

// function returnSuccess(data, statusCode = 200) {
//   return {
//     statusCode,
//     body: JSON.stringify(data)
//   }
// }

export async function handler(event) {
  const { payload } = JSON.parse(event.body)

  console.log(payload)
  console.log(payload.data)

  // const address = isAddress(_address)

  // if (!address || !signature || !timestamp) {
  //   return returnError('Invalid Arguments')
  // }

  // const addressOfSigner = utils.verifyMessage(
  //   `This signature is proof that I control the private key of ${address} as of the timestamp ${timestamp}.\n\n It will be used to access my Unisocks order history.`,
  //   signature
  // )
  // if (addressOfSigner !== address || Math.round(Date.now() / 1000) - timestamp >= 60) {
  //   return returnError('Unauthorized', 401)
  // }

  // const allRefs = await client.query(q.Paginate(q.Match(q.Index('get_by_address'), address)))

  // if (allRefs.data.length === 0) {
  //   return returnError('No Results')
  // }

  // const query = await client.query(allRefs.data.map(ref => q.Get(ref)))
  // return returnSuccess(query.map(res => res.data))
}

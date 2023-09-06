/**
 * @flow
 */

import app from './src'

const port = process.env.PORT || 4000
const server = app.listen(port)

server.on('listening', () => {
  console.log('Listening in port: ', port)
})

server.on('error', (err: Error) => {
  console.error(err)
})

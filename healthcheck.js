const http = require('http')

const request = http.get('http://localhost:3000', (response) => {
  process.exit(response.statusCode === 200 ? 0 : 1)
})

request.on('error', () => {
  process.exit(1)
})

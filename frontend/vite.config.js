import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GAS_URL =
  'https://script.google.com/macros/s/AKfycbznh7pq5RRl83Yn8qAwGOXLNPR5ZQEFxzl_Rye8JqFXFW04SlZ4GpeJNQtiG8mCqXoYJg/exec'

function gasMiddlewarePlugin() {
  return {
    name: 'gas-middleware',

    configureServer(server) {
      server.middlewares.use('/gas', async (req, res) => {
        try {
          // Ambil query string dari request localhost
          const originalUrl = req.originalUrl || req.url || ''
          const queryIndex = originalUrl.indexOf('?')

          const queryString =
            queryIndex >= 0
              ? originalUrl.substring(queryIndex)
              : ''

          const targetUrl = GAS_URL + queryString

          console.log(
            '[GAS MIDDLEWARE]',
            req.method,
            targetUrl
          )

          const options = {
            method: req.method,
            redirect: 'follow',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
          }

          // Ambil body untuk POST
          if (req.method === 'POST') {
            const chunks = []

            for await (const chunk of req) {
              chunks.push(chunk)
            }

            const body = Buffer.concat(chunks).toString('utf8')

            options.body = body

            console.log(
              '[GAS POST BODY]',
              body
            )
          }

          const response = await fetch(
            targetUrl,
            options
          )

          const responseText =
            await response.text()

          console.log(
            '[GAS RESPONSE]',
            response.status,
            response.url
          )

          res.statusCode =
            response.status

          res.setHeader(
            'Content-Type',
            response.headers.get('content-type') ||
              'application/json; charset=utf-8'
          )

          res.setHeader(
            'Cache-Control',
            'no-store'
          )

          res.end(responseText)

        } catch (error) {
          console.error(
            '[GAS MIDDLEWARE ERROR]',
            error
          )

          res.statusCode = 500

          res.setHeader(
            'Content-Type',
            'application/json; charset=utf-8'
          )

          res.end(
            JSON.stringify({
              status: 'error',
              message:
                'Gagal menghubungi Google Apps Script: ' +
                error.message,
            })
          )
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    gasMiddlewarePlugin(),
  ],
})
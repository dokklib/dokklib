import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import mime from 'mime-types'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

async function handleEvent(event) {
  const isHtml = isHtmlRequest(event.request)
  let options = {}

  if (DEBUG) {
    // Don't cache anything in debug mode
    options.cacheControl = {
      bypassCache: true,
    }
  } else if (!isHtml) {
    // Cache non-html assets for a day in the browser
    options.cacheControl = {
      browserTTL: 24 * 60 * 60
    }
  }

  try {
    return await getAssetFromKV(event, options)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (DEBUG) {
      return handleError(e)
    } else {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {
        return new Response('Internal Error', { status: 500 })
      }
    }
  }
}


function handleError(error) {
  if (DEBUG) {
    return new Response(error.stack, {
      status: 500,
    })
  } else {
    return new Response('Internal Error', { status: 500 })
  }
}

function isHtmlRequest(request) {
  const url = new URL(request.url)
  const mimeType = mime.lookup(url.pathname)
  // If there is no mime type, assume it's html
  // (eg. example.com/foo will be considered html).
  return !mimeType || mimeType === 'text/html'
}


addEventListener('fetch', event => {
  try {
    const res = handleEvent(event).catch(handleError)
    event.respondWith(res)
  } catch (e) {
    event.respondWith(handleError(e))
  }
})


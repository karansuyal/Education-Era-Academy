import { useEffect, useRef } from 'react'

// Keeps a WebSocket open at `url`, calling onMessage(parsedJson) for every
// message that arrives. Auto-reconnects with backoff if the connection
// drops (Render backend sleeping/restarting, wifi blip, etc.), so the page
// stays "live" without the user having to reload.
//
// Usage:
//   useLiveSocket(wsUrl('/doubts/ws'), (msg) => { ...handle msg... })
//
// Pass `enabled = false` to skip connecting (e.g. while an auth token
// isn't ready yet).
export default function useLiveSocket(url, onMessage, enabled = true) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    if (!enabled || !url) return undefined

    let socket
    let retryTimer
    let closedByUs = false
    let retryDelay = 1000

    function connect() {
      socket = new WebSocket(url)

      socket.onmessage = (event) => {
        try {
          onMessageRef.current(JSON.parse(event.data))
        } catch {
          // ignore malformed/non-JSON messages
        }
      }

      socket.onopen = () => { retryDelay = 1000 }

      socket.onclose = () => {
        if (closedByUs) return
        retryTimer = setTimeout(connect, retryDelay)
        retryDelay = Math.min(retryDelay * 1.5, 15000)
      }

      socket.onerror = () => socket.close()
    }

    connect()

    return () => {
      closedByUs = true
      clearTimeout(retryTimer)
      socket?.close()
    }
  }, [url, enabled])
}

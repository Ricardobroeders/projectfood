self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Project Food', body: event.data.text() }
  }

  const { title, body, icon, badge, data } = payload

  event.waitUntil(
    self.registration.showNotification(title ?? 'Project Food', {
      body: body ?? '',
      icon: icon ?? '/icons/icon-192.png',
      badge: badge ?? '/icons/icon-192.png',
      data: data ?? {},
      vibrate: [100, 50, 100],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        const clientUrl = new URL(client.url)
        if (clientUrl.pathname === url && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

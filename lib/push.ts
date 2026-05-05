import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export type PushPayload = {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: { url?: string }
}

export type Subscription = {
  endpoint: string
  p256dh: string
  auth: string
}

export async function sendPush(sub: Subscription, payload: PushPayload): Promise<'ok' | 'gone'> {
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload),
    )
    return 'ok'
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) return 'gone'
    throw err
  }
}

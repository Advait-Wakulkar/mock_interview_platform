import Vapi from '@vapi-ai/web'

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN

if (!token) {
  throw new Error('NEXT_PUBLIC_VAPI_WEB_TOKEN is not set. Please add your Vapi token to the environment.')
}

export const vapi = new Vapi(token)


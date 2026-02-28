import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nmfm8fl3',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

export default client

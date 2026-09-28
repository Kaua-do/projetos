const api_URL = 'https://selzxngigbwqlmtipjpv.supabase.co'

const api_KEY = 'sb_publishable_SDEFu4cGFj1JjClbwhfyLA_biFZoFLK'

const supabaseClient = window.supabase.createClient(api_URL, api_KEY)

export {supabaseClient}
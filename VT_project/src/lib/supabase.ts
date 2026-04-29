import { createClient } from "@supabase/supabase-js"
import "react-native-url-polyfill/auto"

const supabaseUrl = "https://qjzwvgjtdmxbmigzedbq.supabase.co"
const supabaseAnonKey = "sb_publishable_UXHlAfMpfDKF84NgryzljQ_a09YQtr_"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
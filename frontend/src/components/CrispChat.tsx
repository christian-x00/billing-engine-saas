'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function CrispChat() {
  useEffect(() => {
    // 1. Load the Crisp Script
    // @ts-ignore
    window.$crisp = []; 
    // @ts-ignore
    window.CRISP_WEBSITE_ID = "6b4a0d14-0b4a-4e6f-95f8-8fb607fc0419"; // <--- PASTE ID HERE

    (function() {
      var d = document;
      var s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
     s.async = true; 
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    // 2. Identify the User (So you know who is chatting)
    const identifyUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && user.email) {
        // @ts-ignore
        window.$crisp.push(["set", "user:email", [user.email]]);
        // @ts-ignore
        window.$crisp.push(["set", "user:nickname", [user.email.split('@')[0]]]);
      }
    }

    identifyUser()

  }, [])

  return null // This component is invisible, it just loads the script
}
// hooks/use-vdocipher.js
import { useEffect, useState } from "react";

export default function useVdocipher() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  useEffect(() => {
    if (isScriptLoaded) return;
    console.log("Loading VdoCipher script");
    
    // Check if script already exists
    if (document.querySelector('script[src="https://player.vdocipher.com/v2/api.js"]')) {
      setIsScriptLoaded(true);
      return;
    }
    
    const script = document.createElement("script");
    script.onload = () => setIsScriptLoaded(true);
    script.src = "https://player.vdocipher.com/v2/api.js";
    document.body.append(script);
  }, [isScriptLoaded]);

  return {
    loadVideo: function ({ otp, playbackInfo, container, configuration = {} }) {
      const params = new URLSearchParams("");
      const parametersToAdd = { otp, playbackInfo, ...configuration };
      for (const item in parametersToAdd) {
        params.append(item, parametersToAdd[item]);
      }
      const iframe = document.createElement("iframe");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("allow", "autoplay; encrypted-media");
      iframe.setAttribute("frameborder", "0");
      iframe.style = "height: 100%; width: 100%;overflow: auto;";
      iframe.src = "https://player.vdocipher.com/v2/?" + params;
      container.append(iframe);
      return iframe;
    },
    isAPIReady: isScriptLoaded
  };
}
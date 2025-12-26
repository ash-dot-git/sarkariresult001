// "use client";
// import { useEffect } from 'react';

// export default function GoogleAutoAds() {
//   useEffect(() => {
//     const loadAds = () => {
//       const script = document.createElement('script');
//       script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9894115634285043";
//       script.async = true;
//       script.crossOrigin = "anonymous";
//       script.id = "google-adsense-script";

//       if (!document.getElementById(script.id)) {
//         document.head.appendChild(script);
//       }
//     };

//     const timer = setTimeout(loadAds, 3000); // Delay ad loading by 3 seconds

//     return () => {
//       clearTimeout(timer);
//       const existingScript = document.getElementById("google-adsense-script");
//       if (existingScript) {
//         document.head.removeChild(existingScript);
//       }
//     };
//   }, []);

//   return null;
// }
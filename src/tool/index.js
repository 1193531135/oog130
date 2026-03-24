import queryString from 'querystring';
export function readLanguage() {
  const lang = queryString.parse(window.location.search).lang || "en"
  console.log("Language: " + lang)
  return new Promise((resolve) => {
    fetch(`${import.meta.env.VITE_BASE}lang/${lang}.json`).then(res => res.json()).then(data => resolve(data))
  })
}

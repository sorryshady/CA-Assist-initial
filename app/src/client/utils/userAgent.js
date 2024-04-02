export const fetchUserAgent = () => {
  const userAgent = navigator.userAgent
  // console.log(userAgent)
  const platform = /Win/i.test(userAgent)
    ? 'Windows'
    : /Mac/i.test(userAgent)
    ? 'MacOS'
    : /Linux/i.test(userAgent)
    ? 'Linux'
    : 'Unknown'
  const regex = /(Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/i
  const match = userAgent.match(regex)
  const browser = match ? match[1] : 'Unknown Browser'
  const version = match ? match[2] : 'Unknown Version'
  return { platform, browser, version }
}

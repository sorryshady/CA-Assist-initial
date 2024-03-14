export const setWithExpiry = (key, value, socketId = '') => {
  const now = new Date()
  let item
  if (socketId) {
    item = {
      value: value,
      socketId: socketId,
      expiry:
        now.getTime() +
        import.meta.env.REACT_APP_LOCAL_EXPIRY_MINUTES * 60 * 1000,
    }
  } else {
    item = {
      value: value,
      expiry:
        now.getTime() +
        import.meta.env.REACT_APP_LOCAL_EXPIRY_MINUTES * 60 * 1000,
    }
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }
  return item
}

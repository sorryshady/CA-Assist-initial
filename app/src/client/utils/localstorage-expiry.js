export const setWithExpiry = (key, value, connectionId = '') => {
  const now = new Date()
  let item
  if (key === 'aiChat') {
    item = {
      value: value,
      socketId: connectionId,
      expiry:
        now.getTime() +
        import.meta.env.REACT_APP_LOCAL_EXPIRY_MINUTES * 60 * 1000,
    }
  } else if (key === 'caChat') {
    item = {
      value: value,
      sessionId: connectionId,
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

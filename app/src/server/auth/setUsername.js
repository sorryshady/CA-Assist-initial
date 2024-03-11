export const usernamePasswordSignupFields = {
  username: (data) => data.username,
}

export const getGoogleUserFields = {
  email: (data) => data.profile._json.email,
  username: (data) => data.profile.displayName,
}

export function getGoogleAuthConfig() {
  const clientID = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  return {
    clientID,
    clientSecret,
    scope: ['profile', 'email'],
  }
}

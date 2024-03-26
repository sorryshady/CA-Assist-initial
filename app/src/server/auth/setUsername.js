export const usernamePasswordSignupFields = {
  username: (data) => data.username,
}

export const emailPasswordSignupFields = {
  email: (data) => data.email,
}
export const getGoogleUserFields = {
  email: (data) => data.profile._json.email,
  username: (data) => data.profile.displayName,
  firstName: (data) => data.profile._json.given_name,
  lastName: (data) => data.profile._json.family_name,
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

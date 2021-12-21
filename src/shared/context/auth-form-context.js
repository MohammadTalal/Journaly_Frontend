import { createContext } from "react";

// The AuthContext will be used to share the authentication status between 
// the pages of the website to check if a user is signed in or not.
export const AuthContext = createContext({
  isSignedIn: false,
  userId: null,
  token: null,
  signIn: () => {},
  signOut: () => {},
});

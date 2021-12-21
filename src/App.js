import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import UserPosts from "./posts/pages/UserPosts";
import Navigation from "./shared/components/Navbar/Navigation";
import NewPost from "./posts/pages/NewPost";
import AuthForms from "./user/pages/AuthForms";
import { AuthContext } from "./shared/context/auth-form-context";
import AllPosts from "./posts/pages/AllPosts";
import UpdatePost from "./posts/pages/UpdatePost";
import Admin from "./admin/pages/Admin";
import Profile from "./Profile/component/Profile";
import Favourites from "./Favourite/components/Favourites";
let signoutTimer; // initialize the token timer

// This is the main app that's load all the app components
const App = () => {
  // initialize the Signed In state. This will be used to determine which component will be displayed.
  // (Some links and pages will not be displayed if a user is not signed in)
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  // Handle the sign in for a user by setting up a new session token for that user
  // And also set up the exiration date for the session.
  const signIn = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // Handle the sign out for a use by deleting the session data from the browser
  const signOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("role");
    localStorage.removeItem("status");
  }, []);

  // The following useEffect is used to handle the sign out function
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remaininTime = tokenExpirationDate.getTime() - new Date().getTime();
      signoutTimer = setTimeout(signOut, remaininTime);
    } else {
      clearTimeout(signoutTimer);
    }
  }, [token, signOut, tokenExpirationDate]);

  // The following useEffect is used to handle the sign in function
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      signIn(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [signIn]);

  // Set up the routes based on a user state (signed in or not)
  let routes;
  if (token) {
    // The following routes is for a signed-in user
    routes = (
      <Switch>
        <Route path="/" exact>
          <AllPosts />
        </Route>
        <Route path="/:userId/journal" exact>
          <UserPosts />
        </Route>
        <Route path="/journals/new" exact>
          <NewPost />
        </Route>
        <Route path="/journals/:journalId">
          <UpdatePost />
        </Route>

        <Route path="/profile" exact>
          <Profile />
        </Route>
        <Route path="/favourite" exact>
          <Favourites />
        </Route>

        {localStorage.getItem("role") === "admin" ? (
          <Route path="/admin" exact>
            <Admin />
          </Route>
        ) : (
          <Redirect to="/" />
        )}

        {/* this check if role is admin then it redirect to /admin page otherwise redircet to / */}
        {localStorage.getItem("role") === "admin" ? (
          <Redirect to="/admin" />
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    );
  } else {
    // The following routes is for a guest (Not signed-in)
    routes = (
      <Switch>
        <Route path="/" exact>
          <AllPosts />
        </Route>
        <Route path="/:userId/journal" exact>
          <UserPosts />
        </Route>
        <Route path="/auth">
          <AuthForms />
        </Route>
        <Route path="*">
          <AuthForms />
        </Route>
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isSignedIn: !!token,
        token: token,
        userId: userId,
        signIn: signIn,
        signOut: signOut,
      }}
    >
      <Router>
        <Navigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

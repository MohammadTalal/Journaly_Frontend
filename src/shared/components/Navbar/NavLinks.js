import React, { useContext, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-form-context";
import { useHttpClient } from "../../hooks/http-hook";
import "./NavLinks.css";

const NavLinks = ({ id }) => {
  // auth will be used to determine which NavLinks will be displayed.
  // All Journals - All users
  // My Journals - registered users
  // Add New Jounal - registered users
  // Authnitcate - not registered users
  // Admin - only for admin
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const signoutHandler = () => {
    auth.signOut(true);
    history.push("/auth");
  };
  // check role of the user
  useEffect(() => {
    async function checkRole() {
      try {
        const res = await sendRequest(
          `/api/users/${auth.userId}`
        );
        // this check if the the current user has been deactivated then he is signedout automatically
        //  from the website when user referesh the page or try to access any route
        if (res.username[0].status === "deactivate") {
          auth.signOut(true);
          history.push("/auth");
        }
      } catch (error) {}
    }
    checkRole();
  }, [sendRequest, auth.userId, auth.signOut, auth, history]);
  // this get role of the then decide which navigations routes shows or which navigations routes not
  const role = localStorage.getItem("role");

  return (
    <ul className="nav-links">
      <li>
        {role === "admin" ? null : (
          <NavLink to="/" exact>
            ALL JOURNALS
          </NavLink>
        )}
      </li>
      {auth.isSignedIn && (
        <li>
          {role === "admin" ? null : (
            <NavLink to={`/${auth.userId}/journal`}>MY JOURNALS</NavLink>
          )}
        </li>
      )}
      {auth.isSignedIn && (
        <li>
          {role === "admin" ? null : (
            <NavLink to="/journals/new">ADD NEW JOURNAL</NavLink>
          )}
        </li>
      )}
      {auth.isSignedIn && (
        <li>
          {role === "admin" ? null : (
            <NavLink to="/favourite">FAVOURITES</NavLink>
          )}
        </li>
      )}
      {!auth.isSignedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isSignedIn && (
        <li>
          <NavLink to="/profile">PROFILE</NavLink>
        </li>
      )}

      {auth.isSignedIn && (
        <li>
          {/* if role admin then display this route */}
          {role === "admin" ? <NavLink to="/admin">ADMIN</NavLink> : null}
        </li>
      )}

      {auth.isSignedIn && (
        <li>
          <button onClick={signoutHandler}>SIGN OUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;

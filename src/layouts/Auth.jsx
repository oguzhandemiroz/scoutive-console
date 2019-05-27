import React from "react";
import PropTypes from "prop-types";

export const Auth = ({ children }) => <div>Auth{children}</div>;

Auth.propTypes = {
    children: PropTypes.node
};

export default Auth;
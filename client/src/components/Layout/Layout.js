import React, { Fragment } from "react";
import Footer from "../Footer/Footer";
import Nav from "../navigation";

const Layout = (props) => {
  return (
    <Fragment>
      <Nav />
      {props.children}
      <Footer />
    </Fragment>
  );
};

export default Layout;

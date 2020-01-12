import Navbar from './components/layout/Navbar';
import React from 'react'
import { withRouter } from "react-router";
function NAVBAR(props) {

    if (props.location.pathname==="/login") {
        return false;
    }
    return (
      <div>
          <Navbar />
          </div>
  
    );
}
export default withRouter(NAVBAR);
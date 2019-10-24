import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const Alert = (props) => {
  return  props.alerts !==null && 
  props.alerts.length > 0 && 
  props.alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
        </div>
    ));
}
    // with destructuring you can write above class as below:
   /* const Alert = ({alerts}) => {
        return  alerts !==null && 
                alerts.length > 0 && 
                alerts.map(alert => (
              <div key={alert.id} className={`alert alert-${alert.alertType}`}>
              {alert.msg}
              </div>
          ));
      }*/


Alert.propTypes = {
    alerts: PropTypes.array.isRequired
  };
  
  const StateToProps = (state123) => {
      return {alerts: state123.alert}
   } 
  
  
  export default connect(StateToProps)(Alert);
  




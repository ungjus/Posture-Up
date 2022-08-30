import React, { Dispatch } from 'react';
import Form from 'react-bootstrap/Form';
import './switch.css'

const Switch = (props: {
    setSwitchOff: Dispatch<React.SetStateAction<boolean>>;
    
    switchOff: boolean; }) => {


    return (
      <div className="container">
        <Form>
          <Form.Check
            type="switch"
            label="Off/On"
            id="disabled-custom-switch"
            onChange={() => { props.setSwitchOff(!props.switchOff) }}
            checked={!props.switchOff}

          />
        </Form>

      </div>
    )
}



export default Switch;
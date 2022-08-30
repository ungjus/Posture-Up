import { Dispatch, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './numberForm.css'


const NumberForm = (props: {
    setSwitchOff: Dispatch<React.SetStateAction<boolean>>;
    setMinutes: Dispatch<React.SetStateAction<number>>;
    setInputNumber: Dispatch<React.SetStateAction<number>>;
    inputNumber: number;
    switchOff: boolean;
    bounds: Array<number>;
}) => {
    const [showUpdated, setShowUpdated] = useState(false);
    const [MIN_MINUTES, MAX_MINUTES] = props.bounds;


    /**
     * Handles Form Submit when "Update" button is clicked
     * 
     * @param event - Event Information containing the use inputed number
     * 
     */
    const handleSubmit = (event: any) => {
        event.preventDefault();
        props.setMinutes(parseInt(event.target[0].value));
        handleUpdateLabel();
    }

    /**
     * Shows "Updated" label (under button) after button is clicked for 1 second
     * 
     */
    const handleUpdateLabel = () => {
        setShowUpdated(true);
        setTimeout(() => { setShowUpdated(false) }, 800);
    }

    /**
     * Updates the number text box to relect the user inputted number
     * 
     * @param event - The user typed number
     * 
     */
    const handleChange = (event: any) => {
        props.setInputNumber(event.target.value)
    }


    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Posture Reminder Every:</Form.Label>
                    <Form.Control type="number" min={MIN_MINUTES} max={MAX_MINUTES} value={props.inputNumber} onChange={handleChange} disabled={props.switchOff} />
                    <Form.Text className="formText">
                        minutes
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={props.switchOff}>Update</Button>
                <Form.Label className={showUpdated ? 'updateLabel show' : 'updateLabel'}>Updated</Form.Label>
            </Form>
        </div>
    )
}



export default NumberForm;
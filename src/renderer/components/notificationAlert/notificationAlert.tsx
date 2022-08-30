import React, { Dispatch } from "react";
import { Button, Modal } from "react-bootstrap";
import './notificationAlert.css'

const NotifcationAlert = (props: {
    setShowAlert: Dispatch<React.SetStateAction<boolean>>;
    showAlert: boolean,
    msg: string,
    handleNotificationClick: (isYes: boolean) => void;
}) => {
    const setShowAlert = props.setShowAlert;
    const showAlert = props.showAlert;
    const msg = props.msg.split("\n\n");
    const [msgBeginning, msgEnd] = msg;

    /**
     * Handles user button click
     * 
     * @param isYes What the user clicked. Yes or No
     */
    const handleClick = (isYes: boolean) => {
        setShowAlert(false);
        props.handleNotificationClick(isYes);
        window.electron.ipcRenderer.closeNotification();
    }

    return (
        <div>
            <Modal
                show={showAlert}
                onHide={() => setShowAlert(false)}
                backdrop="static"
                keyboard={false}
                dialogClassName="box-size"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Posture Up!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {msgBeginning}
                    <br /><br />
                    {msgEnd}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleClick(true)} variant="outline-primary">
                        Yes
                    </Button>
                    <Button onClick={() => handleClick(false)} variant="outline-primary">
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default NotifcationAlert;
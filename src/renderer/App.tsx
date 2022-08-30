import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import Analytics from './components/analytics/analytics';
import Switch from './components/switch/switch';
import NumberForm from './components/numberForm/numberForm';
import Header from './components/header/header';
import NotifcationAlert from './components/notificationAlert/notificationAlert';

const Main = () => {
  const MIN_MINUTES: number = 2;
  const MAX_MINUTES: number = 60;
  const TO_MINUTES: number = 60 * 1000;
  const ALPHA: number = .5;

  const [switchOff, setSwitchOff] = useState<boolean>(window.electron.ipcRenderer.store.get('switchOff'));
  const [minutes, setMinutes] = useState<number>(window.electron.ipcRenderer.store.get('minutes'));
  const [postureCounter, setPostureCounter] = useState(window.electron.ipcRenderer.store.get('postureCounter'));
  const [streakCounter, setStreakCounter] = useState(window.electron.ipcRenderer.store.get('streakCounter'));
  const [inputNumber, setInputNumber] = useState<number>(window.electron.ipcRenderer.store.get('minutes'));
  const [msg, setMsg] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const isInitialMount = useRef(true);

  /**
   * Handles switch button and notification
   * 
   * Starts notification alarm when switch turned on and closes notification when off
   * If no number is provided a default 30 minutes is used.
   */
  useEffect(() => {
    window.electron.ipcRenderer.store.set('switchOff', switchOff)
    let intervalID: number;
    if (!switchOff) {
      console.log('switch on');

      intervalID = createNotificationTimer();
      checkAlertIgnored()
    }

    return () => {
      console.log('interval cleared');
      clearInterval(intervalID)
    }
  }, [switchOff, minutes])

  /**
   * Handles changes to minutes of alarm
   */
  useEffect(() => {
    if (!isInitialMount.current) {
      console.log('New Minutes: ', minutes)
      window.electron.ipcRenderer.store.set('minutes', minutes);
      setInputNumber(minutes);
    }
  }, [minutes])


  /**
  * Saves posture counter data
  */
  useEffect(() => {
    if (!isInitialMount.current) {
      window.electron.ipcRenderer.store.set('postureCounter', postureCounter);
    }
  }, [postureCounter])


  /**
   * Handles Notification response streaks
   * 
   * If yes streak, increase notification time by streakNumber * ALPHA (.5)
   * 
   * If no, decrease notification time by streakNumber * ALPHA (.5) 
   * 
   * Notification time must be between 5 - 60 minutes
   */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // must be in the last useEffect
    } else {
      window.electron.ipcRenderer.store.set('streakCounter', streakCounter);
      if (streakCounter.no !== 0) {
        console.log('applying penalty')
        const penalty = Math.floor(streakCounter.no * ALPHA)
        const newMinutes = Math.max(minutes - penalty, MIN_MINUTES)
        setMinutes(newMinutes)
      } else {
        console.log('applying reward')
        const reward = Math.floor(streakCounter.yes * ALPHA)
        const newMinutes = Math.min(minutes + reward, MAX_MINUTES)
        setMinutes(newMinutes)
      }
    }
  }, [streakCounter])


  /**
   * Event Listener for notificaitions
   * 
   * If yes, increases yes percentage and streak count
   * 
   * If no, decreases yes percentages and resets streak count
   * 
   * @param _event - ignored not used
   * @param data - Yes or No
   * @param msg - The random message from notification
   */
  window.electron.ipcRenderer.notiResponse((_event: any, data: boolean) => {
    setShowAlert(false);
    handleNotificationClick(data);
  });

  /**
   * Handles notitifcation click response and updates analytic trackers accordingly.
   * 
   * @param choiceYes Yes or no to notification
   */
  const handleNotificationClick = (choiceYes: boolean) => {
    if (choiceYes) {
      setPostureCounter((prevState: any) => ({ ...prevState, yes: postureCounter.yes + 1, total: postureCounter.total + 1 }));
      setStreakCounter((prevState: any) => ({ ...prevState, yes: streakCounter.yes + 1, no: 0 }));
    } else {
      setPostureCounter((prevState: any) => ({ ...prevState, total: postureCounter.total + 1 }));
      setStreakCounter((prevState: any) => ({ ...prevState, yes: 0, no: streakCounter.no += 1 }));
    }
  }

  /**
   * Creates a new notification timer based on user input or streaks
   * 
   * @returns notifcation Timer ID
   */
  const createNotificationTimer = () => {
    return Number(setInterval(async () => {
      const msg: string = await window.electron.ipcRenderer.notify();
      if (msg.length > 0) {
        setMsg(msg);
        setShowAlert(true);
      }
    },
      minutes * TO_MINUTES
    ));
  }

  /**
   * Close Alert if no response after 2 minutes
   */
  const checkAlertIgnored = () => {
    setTimeout(() => {
      if (showAlert) {
        setShowAlert(false);
      }
    }, 2 * 60)
  }

  return (
    <div>
      <Header />
      <Analytics switchOff={switchOff} streakCounter={streakCounter} postureCounter={postureCounter} setPostureCounter={setPostureCounter} />
      <Switch setSwitchOff={setSwitchOff} switchOff={switchOff} />
      <NumberForm setSwitchOff={setSwitchOff} switchOff={switchOff} inputNumber={inputNumber} setInputNumber={setInputNumber}
        setMinutes={setMinutes} bounds={[MIN_MINUTES, MAX_MINUTES]} />
      <NotifcationAlert showAlert={showAlert} setShowAlert={setShowAlert} msg={msg} handleNotificationClick={handleNotificationClick} />
    </div>
  );
};


export default function App() {
  return (
    <Main />
  );
}

/*
TODO:
- electron notification state (for do no disturb toggle?)
- sound on/off (does not work :( )
- keep track of maxStreak, put streak on notification
*/

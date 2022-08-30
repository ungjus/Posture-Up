import { Dispatch } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './analytics.css'

const Analytics = (props: {
  postureCounter: any;
  streakCounter: any;
  switchOff: boolean;
  setPostureCounter: Dispatch<React.SetStateAction<any>>
}) => {

  const switchOff = props.switchOff;
  const streakCounter = props.streakCounter;
  const postureCounter = props.postureCounter;

  /**
   * Resets the yes percentage
   */
  const handleReset = () => {
    props.setPostureCounter({yes: 0, total: 0}); 
  }

  return (
    <div className="row" hidden={switchOff}>
      <div className='trackerWidth' hidden={streakCounter.yes > 1 ? false : true}>
        <p className='number'>{streakCounter.yes + "🔥 "}</p>
        <p className='label'>Streak Counter</p>
      </div>

      <div className='trackerWidth' hidden={postureCounter.total != 0 ? false : true}>
        <p className='number'>{Math.round(postureCounter.yes / postureCounter.total * 100) + "%"}</p>
        <OverlayTrigger
          placement={'bottom'}
          overlay={
            <Tooltip id={`tooltip`}>
              Click me to reset percentage
            </Tooltip>
          }
        >
          <button className='label' onClick={handleReset}> Percent Yes</button>
        </OverlayTrigger>
        
      </div>
    </div>
  )
}

export default Analytics;

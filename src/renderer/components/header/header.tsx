import icon from '../../../../assets/SpineCircleIcon.svg';
import './header.css'
const Header = () => {

    return (
        <div>
             <div className="container">
                <img width="200" alt="icon" src={icon} />
            </div>
            <h1>Posture Up!</h1>
        </div>
    )
}



export default Header;
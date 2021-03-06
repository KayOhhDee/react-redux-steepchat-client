import React, {Component} from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import DefaultUserImg from '../images/user.png';
import DeleteMessage from './DeleteMessage';
import MessageModal from './MessageModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEllipsisH,
  faHeart as faHeartSolid
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faHeart, faEye } from "@fortawesome/free-regular-svg-icons";
import Fade from 'react-reveal/Fade';


class MessageItem extends Component {
  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.toggle = this.toggle.bind(this);

    this.myRef = React.createRef();

    this.state = {
      popupVisible: false,
      modal: false,
      oldPath: '',
      newPath: ''
    };
  }

  componentDidMount() {
    if(this.props.openModal) {
      this.toggle();
    }
  }

  toggle() {
    let oldPath = window.location.pathname;

    const {userId, messageId} = this.props;
    const newPath = `/users/${userId}/message/${messageId}`;

    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    
    if(this.state.modal !== true) {
      if(oldPath === newPath) oldPath = `/users/${userId}`;
      window.history.pushState(null, null, newPath);
      this.setState({oldPath, newPath})
    } else {
      window.history.pushState(null, null, this.state.oldPath);
    }
  }

  handleDeleteClick() {
    if (!this.state.popupVisible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      popupVisible: !prevState.popupVisible
    }));
  }

  handleOutsideClick(e) {
    const node = this.myRef.current;
    if (node.contains(e.target)) {
      return;
    }

    this.handleDeleteClick();
  }

  render() {
    const {
      date,
      profileImage,
      text,
      username,
      likeCount,
      commentCount,
      removeMessage,
      isCorrectUser,
      likeMessage,
      unlikeMessage,
      likedMessage,
      authenticated,
      messageId,
      userId
    } = this.props;

    return (
      <Fade>
        <li style={{wordBreak:"break-word"}} className="list-group-item">
          <div className="list-item-info">
            <img
              src={profileImage || DefaultUserImg}
              alt={username}
              height="100"
              width="100"
              className="timeline-image"
            />
            <div className="message-area">
              <Link to={`/users/${userId}`}>@{username}</Link>
              <p className="text-muted">
                <Moment className="text-muted" fromNow>
                  {date}
                </Moment>
              </p>
            </div>
            {isCorrectUser && (
              <div ref={this.myRef} className="option-btn">
                <span onClick={this.handleDeleteClick}>
                  <FontAwesomeIcon icon={faEllipsisH} />
                </span>
                {this.state.popupVisible && (
                  <div style={{wordBreak:"normal"}} className="option-content">
                    <DeleteMessage removeMessage={removeMessage} />
                  </div>
                )}
              </div>
            )}
            <span title="view" className="view-btn tooltipper">
              <FontAwesomeIcon onClick={this.toggle} icon={faEye} />
            </span>
          </div>
          <div>
            <p className="post">{text}</p>
          </div>
          <div className="reactions">
            <span>
              {!authenticated ? (
                <Link to="/signin">
                  <span title="Like" className="tooltipper">
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                </Link>
              ) : likedMessage() ? (
                <span title="Unlike" className="tooltipper">
                  <FontAwesomeIcon
                    data-heartsolid
                    onClick={unlikeMessage}
                    icon={faHeartSolid}
                  />
                </span>
              ) : (
                <span title="Like" className="tooltipper">
                  <FontAwesomeIcon onClick={likeMessage} icon={faHeart} />
                </span>
              )}
              {`${likeCount} likes`}
            </span>
            <span>
              <span title="Comment" className="tooltipper">
                <FontAwesomeIcon onClick={this.toggle} icon={faComment} />
              </span>
              {`${commentCount} comments`}
            </span>
          </div>
          {this.state.modal && (
            <MessageModal
              toggle={this.toggle}
              modalState={this.state.modal}
              messageId={messageId}
              userId={userId}
              authenticated={authenticated}
              likedMessage={likedMessage}
              likeMessage={likeMessage}
              unlikeMessage={unlikeMessage}
              profileImage={profileImage}
              username={username}
            />
          )}
        </li>
      </Fade>
    );
  }
}

export default MessageItem;
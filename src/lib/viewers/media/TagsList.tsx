import React, { useEffect } from 'react';
import './TagsList.scss';
import { getUserById, getCurrentUser } from '../../db/user';
import { addComment } from '../../db/comments';
/**
 * Q:why not use real user name from the getUserById api?
 * A: difficult to set up demo data.
 */
interface User {
    name: string;
    id: string;
}

// timestamp in seconds
function getTimeFromTimeStamp(timestamp) {
    const minutes = timestamp > 60 ? Math.round(timestamp / 60) : '0';
    const seconds = timestamp > 10 ? timestamp : `0${timestamp}`;
    return `${minutes}:${seconds}`;
}
export default function TagsList({ comments, mediaEl, onTimeUpdate }) {
    const activeTagId = 2;
    const _tags = comments
        ? comments.map(c => {
              return { ...c, ...getUserById(1) };
          })
        : [];
    const [tagsList, _] = React.useState(_tags);
    const textareaRef = React.useRef(null);
    const [user, setUser] = React.useState<User>();

    React.useEffect(async () => {
        const me = await getCurrentUser();
        setUser(me);
    }, []);

    return (
        <div className="container">
            <div className="tags-container">
                <h2 className="tags-list-header">All tags</h2>
                {comments &&
                    tagsList.map(tag => {
                        const { initials, text, createdAt, name, id, timestamp } = tag;
                        return (
                            <div key={id} className={`tag-container ${id === activeTagId && 'active'}`}>
                                <div className="tag-container-left" onClick={() => onTimeUpdate(timestamp)}>
                                    {getTimeFromTimeStamp(timestamp)}
                                </div>
                                <div className="tag-container-right">
                                    <div className="user-icon" data-initials={initials} title={name.substring(0, 8)} />
                                    <div className="tag-comment">{text}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="new-comment-container">
                <div className="input-title" />
                <textarea ref={textareaRef} className="input-box" />
                <button
                    onClick={() => {
                        const videoID = '977307283157';
                        const userId = '1123';
                        const timestamp = Math.floor(mediaEl.currentTime);
                        addComment(videoID, user ? user.id : '123', timestamp, textareaRef.current.value, 5).then(
                            result => {
                                console.log(result);
                                textareaRef.current.value = '';
                                // TODO: refresh video timeline to show the comment indicators
                            },
                        );
                    }}
                    type="button"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

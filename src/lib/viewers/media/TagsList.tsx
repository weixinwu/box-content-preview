import React, { useEffect, useState, useRef } from 'react';
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
    const [tagsList, _] = useState(_tags);
    const textareaRef = useRef(null);
    const fileInputRef = useRef<any>(null);
    const [user, setUser] = useState<User>();
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

    useEffect(async () => {
        const me = await getCurrentUser();
        setUser(me);
    }, []);

    function selectFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = [...(e.target.files as any)];
        setSelectedFiles(files => [...files, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function removeSelectedFile(file: any) {
        setSelectedFiles(files => files.filter(f => f !== file));
    }

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
                <div className="new-comment-top">
                    <div className="input-title" />
                    <textarea ref={textareaRef} className="input-box" placeholder="Add tag..." />
                </div>
                <div className="new-comment-bottom">
                    <button
                        onClick={() => {
                            const videoID = '977307283157';
                            const userId = '1123';
                            const timestamp = Math.floor(mediaEl.currentTime);
                            addComment(
                                videoID,
                                user ? user.id : '123',
                                timestamp,
                                textareaRef.current.value,
                                selectedFiles as any,
                            ).then(result => {
                                console.log(result);
                                textareaRef.current.value = '';
                                setSelectedFiles([]);
                                // TODO: refresh video timeline to show the comment indicators
                            });
                        }}
                        type="button"
                    >
                        Done
                    </button>
                    <div className="new-comment-attachments">
                        {selectedFiles.map(file => (
                            <div key={file.name}>
                                {file.name}{' '}
                                <button
                                    className="tag-input-button"
                                    onClick={() => removeSelectedFile(file)}
                                    type="button"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <input ref={fileInputRef} className="tag-input-button" multiple onChange={selectFiles} type="file" />
            </div>
        </div>
    );
}

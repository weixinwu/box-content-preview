import React, { useEffect, useState, useRef } from 'react';
import './TagsList.scss';
import { getUserById, getCurrentUser } from '../../db/user';
import { addComment, removeComment } from '../../db/comments';
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
    const seconds = timestamp > 9 ? timestamp : `0${timestamp}`;
    return `${minutes}:${seconds}`;
}

function parseComment(text) {
    const linkNameStart = (text && text.indexOf('[')) || -1;
    if (linkNameStart < 0) {
        return text;
    }
    const linkNameEnd = text.indexOf('|');
    const linkStart = linkNameEnd + 1;
    const linkEnd = text.indexOf(']');

    const linkName = text.slice(linkNameStart + 1, linkNameEnd);
    const link = text.slice(linkStart, linkEnd);

    const linkPattern = text.slice(linkNameStart, linkEnd + 1);

    const linkMarkup = `<a href="${link}" target="_blank">${linkName}</a>`;

    console.log(linkPattern);

    return text.replace(linkPattern, linkMarkup);
}

export default function TagsList({ comments, mediaEl, onTimeUpdate, onShowAll }) {
    const videoID = '977307283157';
    const activeTagId = 2;
    const _tags = comments
        ? comments.map(c => {
              return { ...c, ...getUserById(1) };
          })
        : [];
    const [tagsList, setTagsList] = useState(_tags);
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

    async function removeTag(id: string) {
        setTagsList(tags => tags.filter(t => t.id !== id));
        await removeComment(videoID, id);
    }

    return (
        <div className="container">
            <div className="tags-container">
                <h2 className="tags-list-header">Tags</h2>
                <span className="show-all" onClick={onShowAll}>
                    Show all
                </span>
                <div className="list-container">
                    {comments &&
                        tagsList.map(tag => {
                            const { initials, text, createdAt, name, id, timestamp } = tag;
                            return (
                                <div key={id} className={`tag-container ${id === activeTagId && 'active'}`}>
                                    <div className="tag-container-left" onClick={() => onTimeUpdate(timestamp)}>
                                        {getTimeFromTimeStamp(timestamp)}
                                    </div>
                                    <div className="tag-container-right">
                                        <div
                                            className="user-icon"
                                            data-initials={initials}
                                            title={name.substring(0, 8)}
                                        />
                                        <div
                                            className="tag-comment"
                                            dangerouslySetInnerHTML={{ __html: parseComment(text) }}
                                        />
                                        <button
                                            className="tag-remove-btn"
                                            onClick={() => removeTag(id)}
                                            title="Remove tag"
                                        >
                                            <svg
                                                fill="#f9f8f8"
                                                height="12px"
                                                viewBox="0 0 24 24"
                                                width="21px"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className="new-comment-container">
                <div className="new-comment-top">
                    <div className="input-title" />
                    <textarea ref={textareaRef} className="input-box" placeholder="Add tag..." />
                </div>
                <div className="new-comment-bottom">
                    <button
                        onClick={() => {
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
                                setTagsList(tags => [...tags, { ...result, ...getUserById(1) }]);
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
                                <button onClick={() => removeSelectedFile(file)} type="button">
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <input ref={fileInputRef} multiple onChange={selectFiles} type="file" />
            </div>
        </div>
    );
}

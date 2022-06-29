import React, { useEffect, useState, useRef } from 'react';
import './TagsList.scss';
import { getUserById, getCurrentUser } from '../../db/user';
import { addComment, removeComment } from '../../db/comments';
import pdfIcon from './pdf-file.png';
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

    return text.replace(linkPattern, linkMarkup);
}

function parseMentions(text: string): string {
    const match = text.match(/_@(\w+)/);
    if (!match) return text;

    const [mention, username] = [...match];
<<<<<<< HEAD
    console.log('mention, username', mention, username);
=======
>>>>>>> c93946f72429a230918193784432307cb25f081b
    text = text.replace(mention, `<span class="tag-mention">@${username}</span>`);
    return parseMentions(text);
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
                                <div className="tag-section">
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
                                                dangerouslySetInnerHTML={{
                                                    __html: parseMentions(parseComment(text)),
                                                }}
                                            />
                                            <button
                                                className="tag-remove-btn"
                                                onClick={() => removeTag(id)}
                                                title="Remove tag"
                                            >
                                                <svg
                                                    fill="#f9f8f8"
                                                    height="21px"
                                                    viewBox="0 0 24 24"
                                                    width="21px"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {tag.attachments.length > 0 && (
                                        <div className="tag-attachments">
                                            {tag.attachments.map(attachment => (
                                                <div className="tag-attachment">
                                                    <div className="attachment-img">
                                                        <a href={attachment.downloadUrl} target="_blank">
                                                            {attachment.contentType.startsWith('image/') && (
                                                                <img src={attachment.downloadUrl} />
                                                            )}
                                                            {!attachment.contentType.startsWith('image/') && (
                                                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDM3MC4zMiAzNzAuMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDM3MC4zMiAzNzAuMzI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNmZmY7IiBkPSJNMTQ4Ljg3OSw4NS45OTNIOTUuMTM1Yy04LjI4NCwwLTE1LDYuNzE2LTE1LDE1YzAsOC4yODQsNi43MTYsMTUsMTUsMTVoNTMuNzQ0DQoJCWM4LjI4NCwwLDE1LTYuNzE2LDE1LTE1QzE2My44NzksOTIuNzA5LDE1Ny4xNjMsODUuOTkzLDE0OC44NzksODUuOTkzeiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNmZmY7IiBkPSJNMTQ4Ljg3OSwxNDguMzI3SDk1LjEzNWMtOC4yODQsMC0xNSw2LjcxNi0xNSwxNWMwLDguMjg0LDYuNzE2LDE1LDE1LDE1aDUzLjc0NA0KCQljOC4yODQsMCwxNS02LjcxNiwxNS0xNUMxNjMuODc5LDE1NS4wNDMsMTU3LjE2MywxNDguMzI3LDE0OC44NzksMTQ4LjMyN3oiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojZmZmOyIgZD0iTTIxMS45NDQsMjUzLjM1NHYxNC42MDhoNy43MTdjOS4zNTksMCw5LjM1OS01LjU5OSw5LjM1OS03LjQzOWMwLTEuNzc1LDAtNy4xNy05LjM1OS03LjE3SDIxMS45NDR6DQoJCSIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNmZmY7IiBkPSJNMzI1Ljg3OSwyMjUuNzUyaC0yNC40MVY3My43MDNjMC0zLjkzNC0xLjU2LTcuNzA1LTQuMzQ0LTEwLjQ4NGwtNTguODc2LTU4Ljg4DQoJCUMyMzUuNDY1LDEuNTYxLDIzMS42OTksMCwyMjcuNzY1LDBINTAuNThDMzQuNTI3LDAsMjEuNDY5LDEzLjA1OSwyMS40NjksMjkuMTEydjMxMi4wOTVjMCwxNi4wNTQsMTMuMDU5LDI5LjExMywyOS4xMTEsMjkuMTEzDQoJCWgyMjEuNzc3YzE2LjA1MiwwLDI5LjExMS0xMy4wNiwyOS4xMTEtMjkuMTEzdi0zMC4wNDhoMjQuNDFjMTIuNjg3LDAsMjIuOTczLTEwLjI4NSwyMi45NzMtMjIuOTczdi0zOS40NjINCgkJQzM0OC44NTIsMjM2LjAzOCwzMzguNTY2LDIyNS43NTIsMzI1Ljg3OSwyMjUuNzUyeiBNMjY5Ljg1NSwzMzcuOTA2SDUzLjA4MlYzMi40MTRIMjA3LjE3Vjc1Ljk5DQoJCWMwLDEwLjU1NSw4LjU1NCwxOS4xMDcsMTkuMTA1LDE5LjEwN2g0My41OHYxMzAuNjU1aC03NC4xNzhjLTEyLjY4OCwwLTIyLjk3MywxMC4yODYtMjIuOTczLDIyLjk3M3YzOS40NjINCgkJYzAsMTIuNjg4LDEwLjI4NSwyMi45NzMsMjIuOTczLDIyLjk3M2g3NC4xNzhWMzM3LjkwNnogTTIzOC41MSwyNjAuNTIzYzAsMTAuNDQxLTcuMjI0LDE2LjkyOC0xOC44NSwxNi45MjhoLTcuNzE3djguOTc3DQoJCWMwLDIuMzE2LTEuODc3LDQuMTk3LTQuMTk1LDQuMTk3aC0xLjA5N2MtMi4zMTksMC00LjE5Ny0xLjg4MS00LjE5Ny00LjE5N3YtMzguMzY2YzAtMi4zMTYsMS44NzgtNC4xOTcsNC4xOTctNC4xOTdoMTMuMDA5DQoJCUMyMzEuMjg3LDI0My44NjQsMjM4LjUxLDI1MC4yNDYsMjM4LjUxLDI2MC41MjN6IE0yNjIuMzA1LDI5MC42MjVIMjQ3LjIxYy0yLjMxOSwwLTQuMTk3LTEuODgxLTQuMTk3LTQuMTk3di0zOC4zNjYNCgkJYzAtMi4zMTYsMS44NzctNC4xOTcsNC4xOTctNC4xOTdoMTUuMDk1YzEzLjE0OCwwLDIzLjg0NSwxMC41LDIzLjg0NSwyMy40MDlDMjg2LjE1LDI4MC4xNSwyNzUuNDU0LDI5MC42MjUsMjYyLjMwNSwyOTAuNjI1eg0KCQkgTTMyMi40NTUsMjQ5LjE1NmMwLDIuMzItMS44NzgsNC4xOTctNC4xOTcsNC4xOTdoLTE3LjA0NXYxMC4wNTNoMTQuNTIxYzIuMzE3LDAsNC4xOTcsMS44NzUsNC4xOTcsNC4xOTV2MS4wOTkNCgkJYzAsMi4zMTYtMS44OCw0LjE5Ny00LjE5Nyw0LjE5N2gtMTQuNTIxdjEzLjUzYzAsMi4zMTYtMS44NzcsNC4xOTctNC4xOTYsNC4xOTdoLTEuMDk2Yy0yLjMyLDAtNC4xOTctMS44ODEtNC4xOTctNC4xOTd2LTM4LjM2Ng0KCQljMC0yLjMxNiwxLjg3Ny00LjE5Nyw0LjE5Ny00LjE5N2gyMi4zMzdjMi4zMTksMCw0LjE5NywxLjg4MSw0LjE5Nyw0LjE5N1YyNDkuMTU2eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNmZmY7IiBkPSJNMjYyLjMwNSwyNTMuMzU0aC05LjgwM3YyNy43ODJoOS44MDNjNy45MTUsMCwxNC4zNTUtNi4yMjIsMTQuMzU1LTEzLjg2Mg0KCQlDMjc2LjY2MSwyNTkuNTk4LDI3MC4yMjEsMjUzLjM1NCwyNjIuMzA1LDI1My4zNTR6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==" />
                                                            )}
                                                        </a>
                                                    </div>
                                                    <div className="attachment-name">{attachment.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                    <input
                        ref={fileInputRef}
                        className="hidden"
                        id="files"
                        multiple
                        onChange={selectFiles}
                        type="file"
                    />
                    <label className="button button-secondary" htmlFor="files">
                        Select files
                    </label>
                    <button
                        className="button button-primary"
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
                </div>
                <div className="new-comment-attachments">
                    {selectedFiles.map(file => (
                        <div key={file.name} className="selected-file-container">
                            <div className="new-attachment-name">{file.name}</div>{' '}
                            <button
                                className="button button-primary button-primary-sm remove-attachment"
                                onClick={() => removeSelectedFile(file)}
                                title="Remove attachment"
                                type="button"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

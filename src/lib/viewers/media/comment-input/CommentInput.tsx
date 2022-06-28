import React, { useState } from 'react';

export default function CommentInput(): JSX.Element | null {
    return (
        <div className="comment-input-container">
            <div className="comment-input-inner">
                <form name="commentInputForm">
                    <div className="comment-input-text">
                        <input className="comment-input-text" type="text" />
                    </div>
                    <div className="comment-input-controls">
                        <button type="button" value="Cancel" />
                        <button type="submit" value="Send" />
                    </div>
                </form>
            </div>
        </div>
    );
}

import React from 'react';
import './TagInput.scss';

type Props = {
    timestamp?: string;
    name?: string;
    initials?: string;
    onSubmit?: () => void;
    onCancel?: () => void;
};

export default function TagInput(props: Props): JSX.Element | null {
    return (
        <div className="tag-input-container">
            <div className="user-icon" data-initials={sampleData.initials} title={sampleData.name} />
            <form className="tag-input-inner" name="tagInputForm">
                <div className="tag-input-text">
                    <input
                        className="tag-input-textBox"
                        placeholder={`Add tag at ${sampleData.timestamp}`}
                        type="text"
                    />
                </div>
                <div className="tag-input-controls">
                    <button type="submit" value="Send" />
                    <button type="button" value="Cancel" />
                </div>
            </form>
        </div>
    );
}

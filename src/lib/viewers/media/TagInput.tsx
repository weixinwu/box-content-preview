import React, { useState } from 'react';
import './TagInput.scss';

export default function TagInput(): JSX.Element | null {
    const [sampleData, setSampleData] = useState({
        timestamp: '12:00',
        name: 'John Doe',
        initials: 'JD',
    });
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

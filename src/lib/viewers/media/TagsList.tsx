import React from 'react';
import './TagsList.scss';

export default function TagsList() {
    const activeTagId = 2;
    const [tagsList, setTagsList] = React.useState([
        {
            id: 1,
            name: 'Anna A',
            initials: 'AA',
            comment: 'How much salt should we add here?',
            timecode: '00:10',
        },
        {
            id: 2,
            name: 'Doo Joo',
            initials: 'DJ',
            comment: 'It looks amazing!! It looks amazing!! It looks amazing!! It looks amazing!!',
            timecode: '01:50',
        },
        {
            id: 3,
            name: 'Cat Gabe',
            initials: 'CG',
            comment: 'Look what I have!',
            timecode: '01:59',
        },
    ]);

    return (
        <div className="tags-container">
            <h2 className="tags-list-header">All tags</h2>
            {tagsList.map(tag => {
                const { initials, comment, timecode, name, id } = tag;
                return (
                    <div key={id} className={`tag-container ${id === activeTagId && 'active'}`}>
                        <div className="tag-container-left">{timecode}</div>
                        <div className="tag-container-right">
                            <div className="user-icon" data-initials={initials} title={name} />
                            <div className="tag-comment">{comment}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

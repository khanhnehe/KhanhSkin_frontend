import React from 'react';
import "./Loading.scss"

const Loading = () => {
    return (
        <>
            <div className='wrapper'>
                <div className='loader-container'>
                    <div className='loader'>
                    </div>
                    <p className="loading-text">Loading...</p>
                </div>
            </div>
        </>

    );
};

export default Loading;
import React from 'react';

const SingleBird = () => {
    return (
        <div className="min-h-screen flex">
            {/* Container for both columns */}
            <div className="flex w-full">
                {/* First column with margin */}
                <div className="ml-20 w-2/3">  {/* Adjust ml-48 as needed for your margin */}
                    hello
                </div>
                {/* Second column - position won't be affected by first column's margin */}
                <div className="w-1/3">
                    hello``
                </div>
            </div>
        </div>
    );
};

export default SingleBird;
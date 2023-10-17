import React from 'react';
import { FidgetSpinner } from  'react-loader-spinner';

const Spinner = () => {
    return (
        <div className="absolute inset-1/2 z-10">
            <div className="spinner-wrapper">
            <FidgetSpinner
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
                ballColors={["#374151", "#fa3462", "#f9fafb"]}
                backgroundColor="#374151"
            />
            </div>
        </div>
    )
}

export default Spinner;

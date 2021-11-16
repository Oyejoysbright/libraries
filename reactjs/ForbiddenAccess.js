import React from 'react'

function ForbiddenAccess({message}) {
    return (
        <div className="jpc">
            <div className="content-center-middle cover-bg">
                {message || "You do not have access to this file"}
            </div>
        </div>
    )
}

export default ForbiddenAccess

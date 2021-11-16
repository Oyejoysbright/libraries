import React from 'react'
import BgBalls from './BgBalls';

function RightContainer({header, children}) {
    return (
        <div style={{position: "relative"}}>
            <div>{header}</div>
            <div>
                {children}
            </div>
            <BgBalls />
        </div>
    )
}

export default RightContainer

export function Header({children}) {
    return(
        <div className={Array.isArray(children)? "content-flex-center auth-header" : "content-right"}>
            {children}
        </div>
    )
}
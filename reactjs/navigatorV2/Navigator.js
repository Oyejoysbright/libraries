import React from 'react'
import { connect } from 'react-redux';
import { getCurrentNavigation, mapReducerDispatchToProps, mapReducerStateToProps, Navigate } from './NavigatorReducer';

let currentNavigation;
function Navigator({children, name, useNavigationButtons, showButtons, active, style, className = ""}) {
    
    currentNavigation = getCurrentNavigation(name);

    let childrenNames = [];
    if (Array.isArray(children)) {
        children.forEach(each => {
            childrenNames.push(each.props.name);
        });
    } else {
        childrenNames = [children.props.name];
    }

    const handleClick = (value) => {
        Navigate(name, value)
    }

    const getObject = (active) => {
        let res;
        if (Array.isArray(children)) {
            children.forEach(each => {
                if (each.props.name === active) {
                    return res  = each;
                }
            });
        } else {
            res = children;
        }
        return res;
    }

    const handlePrev = () => {
        Navigate(name, childrenNames[childrenNames.indexOf(currentNavigation)-1]);
    }
    
    const handleNext = () => {
        Navigate(name, childrenNames[childrenNames.indexOf(currentNavigation)+1]);
    }

    return (
        <div className={className} style={style}>
            <div>
                { showButtons &&
                    childrenNames.map((name, index) => (
                        <span style={styles.buttons} key={index} onClick={handleClick.bind(null, name)} >{name}</span>
                    ))
                }
            </div>
            <div>
                {
                    getObject(currentNavigation || active || childrenNames[0])
                }
            </div>
            {
                useNavigationButtons && 
                <div>
                    { childrenNames.indexOf(currentNavigation) > 0 && <div onClick={handlePrev}>Prev</div>}
                    { childrenNames.indexOf(currentNavigation) < (childrenNames.length - 1) && <div onClick={handleNext}>Next</div>}
                </div>
            }
        </div>
    )
}

export default connect(mapReducerStateToProps, mapReducerDispatchToProps)(Navigator)

export function Route({children, component, name}) {
    if (name === "" || name === undefined) {
        throw new Error("Name prop is compulsory");
    }
    return children || component;
}

const styles = {
    buttons: {
        padding: '10px 20px',
        backgroundColor: 'blue',
        color: 'white',
        margin: '0px 10px',
        cursor: 'pointer',
    }
}
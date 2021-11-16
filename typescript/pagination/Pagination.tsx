import React, { useEffect, useRef, useState } from "react";
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import {FaAngleDoubleLeft, FaAngleDoubleRight} from "react-icons/fa";
import "./pagination.scss";

type Props = {
    total: number,
    perPage: number,
    page: number,
    onChange: Function
}

// var current = 0;
var otherPages:Array<number> = [];

/**
 * @prop {number} total - Total number of data
 * @prop {number} perPage - number of data per page
 * @prop {number} page - Current page, you're expected to update on change
 * @prop {Function} onChange - Function to fire when page is about to change
 * 
 * 
 * @returns {JSX} JSX
 */
function Pagination(props: Props) {

    var numPages = Math.ceil(props.total / props.perPage);
    const pageTogo = useRef<HTMLInputElement>(null);

    const [current, setCurrent] = useState<number>(0);

    
    useEffect(() => {
        setCurrent(props.page);
        for (let i = 1; i < numPages; i++) {
            otherPages.push(i);
        }

        return () => {otherPages = []};

    }, [props.page, current, numPages]);

    const isLastPage = otherPages.slice(-1)[0] === current? true : false;

    const renderOtherPages = () => {
        let firstTwo:Array<number> = [], lastTwo:Array<number> = [];
        otherPages.forEach((val:number, index:number, arr:Array<number>) => {
            if(index === 0 || index === 1) firstTwo.push(val);
            else if(index === arr.length-2 || index === arr.length-1) lastTwo.push(val);
        });

        return (
            <>
            {
                firstTwo.map((val:number, i:number) => (
                    <span title={"Page " + (val+1)} className={(current === val)?"active disabled":""} key={i} onClick={props.onChange.bind(null,val)} >{val+1}</span>
                ))
            }
            {
                otherPages.length > 4 && 
                <div className="pageTogo" title="Enter page to go" >
                    <input ref={pageTogo} type="text" />
                    <span title="Click to goto the specified value" onClick={() => handleChange(pageTogo.current?.value || 0)}>GO</span>
                </div>
            }
            {
                lastTwo.map((val:number, i:number) => (
                    <span title={"Page " + (val+1)} className={(current === val)?"active disabled":""} key={i} onClick={props.onChange.bind(null,val)} >{val+1}</span>
                ))
            }
            </>
        )
    }

    const handleChange = (val: number | string) => {
        if(typeof val === "string") {
            val = parseInt(val);
        }
        setCurrent(val);
        props.onChange(val);
    }

    return(
        <div className="pagination-wrapper">
            <div className="pagination">
            {
                otherPages.length > 0 &&
                <>
                    <span className={(current === 0)? "disabled active": ""} onClick={() => handleChange(0)}><FaAngleDoubleLeft /></span>
                    <span title={"Page " + (current+1)} className={(current === 0)? "disabled": ""} onClick={() => handleChange(current-1)}><GoChevronLeft /></span>
                    { renderOtherPages() }
                    <span title={"Page " + (current+2)}  className={isLastPage? "disabled" : ""} onClick={() => handleChange(current+1)}><GoChevronRight /></span>
                    <span title="Last Page" className={isLastPage?"active disabled":""} onClick={() => handleChange(numPages-1)} ><FaAngleDoubleRight  /></span>
                </>
            }
            </div>
        </div>
    )
}
export default Pagination;

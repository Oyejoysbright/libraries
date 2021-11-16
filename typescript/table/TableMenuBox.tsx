import React from"react";
import { ITableMenuBoxProps } from '../interfaces/table/index';

export default function TableMenuBox(props: ITableMenuBoxProps) {
    return (
        <div className={props.show? "t-menu-box show" : "t-menu-box"}>
            <div className="c-two tmb-header" style={{borderBottom: "1px solid black"}}><span className="bold">Menus</span><span className="close-menu-box" title="Close Menu" onClick={props.onClose}>x</span></div>
            <div>{props.children}</div>
        </div>
    )
}
import React, { useState } from 'react';
import { BiSlider } from 'react-icons/bi';
import { GoSearch } from 'react-icons/go';
import { ITableToolBoxProps } from '../interfaces/table';
import { FaRegEdit } from 'react-icons/fa';
import { ImCloudCheck } from 'react-icons/im';
import { AiOutlineCloudSync, AiOutlineGroup } from 'react-icons/ai';
import { HiMenu } from 'react-icons/hi';
import TableMenuBox from './TableMenuBox';
import { IoIosTrash } from 'react-icons/io';

export default function TableToolBox(props: ITableToolBoxProps) {

    const [state, setState] = useState({
        edit: "Edit", showMenu: false
    });

    const onBtn =  (props.buttonLabel && props.buttonLabel[0])? props.buttonLabel[0] :  "Add";
    const offBtn = (props.buttonLabel && props.buttonLabel[1])? props.buttonLabel[1] : "Close";

    return (
        <div className="header">
            {
                props.useSearch !== false &&
                <div className="search">
                    <span className="icon"> <GoSearch /></span>
                    <input placeholder="Search" />
                </div>
            }
            {props.useTools !== false && <>
                <span className="icon" title="Filter"><BiSlider /></span>
                <span className="icon" title="Group"><AiOutlineGroup/> </span>
                {
                    state.edit === "Edit"?
                        <span className="icon" title="Edit" onClick={() => {props.onEdit() && setState({...state, edit: "Save"})}}><FaRegEdit /></span>
                    :
                        <span className="icon" title="Save Edited" onClick={() => {setState({...state, edit: "Edit"}); props.onSave()}}><ImCloudCheck /></span>
                }
                <span className="icon" title="Delete" onClick={props.onDelete}><IoIosTrash /></span>
                <span className="icon" title="Other menus" onClick={() => setState({...state, showMenu: true})}><HiMenu /></span>
                <TableMenuBox show={state.showMenu} onClose={() => setState({...state, showMenu: false})}>
                    <div>
                        {
                            props.menus?.map((obj, index) => (
                                <div key={index} className="menu-box-item" title={obj.title} onClick={props.onClick.bind(null, obj.value || obj.label)}>{obj.label}</div>
                            ))
                        }
                    </div>
                </TableMenuBox>
                <span className="icon" title="Refresh" onClick={props.onRefresh}><AiOutlineCloudSync /></span>
                <span className={!props.showComponent? "table-button add-button" : "table-button close-button"} onClick={props.onClick.bind(null, "add")}>{props.showComponent? offBtn : onBtn}</span>
            </>}
        </div>
    )
}
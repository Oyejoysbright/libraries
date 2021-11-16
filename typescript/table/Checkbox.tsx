import React from 'react';
import {HiCheck} from 'react-icons/hi'

interface Props {
    name?: string,
    value?: any,
    checked: boolean,
    onChange: Function
}
export default function Checkbox(props: Props) {

    return(
        <div className="table-checkbox-container">
            <span className={props.checked? "table-checkbox checked" : "table-checkbox"} onClick={() => {props.onChange({target: {name: props.name, checked: !props.checked, value: props.value}})}}>{props.checked && <HiCheck />}</span>
        </div>
    )
}
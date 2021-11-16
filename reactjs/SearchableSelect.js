import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';
import { JArrayObject } from '../utils/Jpc';
import Dropdown, { DropStatus, DropType } from './layout/Dropdown';

function SearchableSelect({ name = String, value = String, dataKey = "name", data = TEST_DATA, onChange = Function, className = String, showingKeys = [], separator = " " }) {

    const [state, setState] = useState({
        dataList: data, focusClassName: "unfocused", [name]: "", dropStatus: DropStatus.close
    });

    if(typeof value !== "string") value = "";
    const handleChange = (e) => {
        onChange(e)
    }

    const handleClick = (obj = Object) => {
        const value = obj[dataKey];
        const e = {
            target: {
                name: name,
                value: value,
                objectValue: obj
            }
        }
        setState({ ...state, [name]: value });
        onChange(e);
    }

    useEffect(() => {
        if (state[name] === "" && data !== state.dataList) {
            setState({ ...state, dataList: data });
        }
        if (value !== state[name]) {
            setState(prev => { return { ...prev, [name]: value, dataList: JArrayObject.search(data, value) } });
        }

    });

    const getText = (obj = Object) => {
        let res = "";
        for (let i = 0; i < showingKeys.length; i++) {
            res += (i < showingKeys.length-1)? obj[showingKeys[i]] + separator : obj[showingKeys[i]];
        }
        return res === "" ? obj[dataKey] : res;
    }

    return (
        <Dropdown status={state.dropStatus} type={DropType.focus} className={className + " array-select"} dropdownClassName="options" title={<input type="text" name={name} value={state[name]} placeholder="search" onChange={handleChange} style={{ maxWidth: '95%' }} />} onChange={(status) => setState({ ...state, dropStatus: status })} src={<MdClose title="Close" className="btn-like" onClick={() => setState({ ...state, dropStatus: DropStatus.close })} />} >
            {
                state.dataList.map((obj, index) => (<div className="btn-like" title={obj[dataKey]} key={index} onClick={handleClick.bind(null, obj)}>{getText(obj)}</div>))
            }
        </Dropdown>
    );
}

export default SearchableSelect

const TEST_DATA = [
    { id: 1, name: "Test 1", age: 5 },
    { id: 2, name: "Test 2", age: 9 },
    { id: 3, name: "Test 3", age: 15 },
]
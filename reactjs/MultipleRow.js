import React, { forwardRef, useEffect } from 'react'
import { useImperativeHandle } from 'react';
import { useState } from 'react'
import { MdCancel } from 'react-icons/md';
import { JArray } from '../utils/Jpc';
import { confirm } from './dialog/Dialog';


function MultipleRow( {name="multipleRow", usingID, defaultValue, readOnly, title = [], keys, showTitle = true, serialize, row, className, style, initialize, getter, setter, buttonLabel = "Add", columnType = ColumnType.MultipleColumn, exportType = ExportType.Direct} , ref) {

  const [state, setState] = useState({
    extraFields: initialize ? [name + 0] : [], bin: [], keys: [], staged: false
  });

  const arrayToState = (data = []) => {
    let tempState = {}, extraFields = [];
    data.forEach(each => {
      const field = name + extraFields.length;
      extraFields.push(field);
      keys.forEach(key => {
        tempState[field + key] = each[key];
      });
      if (usingID) {
        tempState[field+"id"] = each["id"];
      }
    });
    setState(prev => ({...prev, ...tempState, extraFields: extraFields, staged: true }));
  }

  if (Array.isArray(defaultValue) && !state.staged) {
    arrayToState(defaultValue);
  }
  else {
    if (state.staged === false) {
      setState({ ...state, staged: true });
    }
  };

  const stateToArray = () => {
    let res = [];
    const data = Object.assign({}, getter());
    JArray.subtract(state.extraFields, state.bin).forEach(each => {
      if (columnType === ColumnType.SingleColumn) {
        res.push(data[each]);
      } else {
        let obj = {};
        keys.forEach(key => {
          obj[key] = data[each + key] || "";
        });
        if (usingID) {
          obj["id"] = data[each+"id"] || 0;
        }
        res.push(obj);
      }
    });
    return res;
  }

  useEffect(() => {
    if (Array.isArray(defaultValue) && defaultValue.length > 0) {
      arrayToState(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (state.staged) {
      setter(state);
    }
    return () => {
      
    }
  }, [state.staged]);

  useImperativeHandle(ref, () => {
    const res = {
      prev: ref,
      data: stateToArray(),
      rawData: getter(),
      fields: JArray.subtract(state.extraFields, state.bin)
    };

    if (exportType === ExportType.Indirect) {
      return { ...ref.current, [name]: res }
    } else {
      return res;
    }
  });

  const createRow = (field, index) => {
    if (columnType === ColumnType.SingleColumn) {
      return(
        <span style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{width: '100%'}}>{row(field, index)}</span>          
          <span key={index} title="Remove this entry" className="btn-like" onClick={handleRemove} style={{color: 'red', padding: '0px 10px'}}> X </span>
        </span>
      );
    }
    else if (columnType === ColumnType.MultipleColumn) {
      return (
        <tr key={index}>
          {serialize ? <td>{index + 1}</td> : null}
          {
            row(field, index).data.map((each, i) => (<td key={i}>{each}</td>))
          }
          <td>
            <MdCancel color="red" onClick={handleRemove.bind(null, field)} className="btn-like" />
          </td>
        </tr>
      )
    }

  }

  const handleAdd = () => {
    //Check if filled before adding new role
    setState(prev => {
      const field = name + prev.extraFields.length;
      return { ...prev, [field]: "", extraFields: prev.extraFields.concat(field) }
    });

  }

  const handleRemove = (field) => {
    confirm("Are you sure you want to remove?", () => {
      setState(prev => { return { ...prev, bin: prev.bin.concat(field) } });
    });
  }

  const multipleColumnRender = () => {
    return (
      <div style={readOnly? {pointerEvents: 'none', cursor: 'not-allowed', ...style} : null} className={className + " jpc"}>
        <table className="w-100">
          {
            !showTitle ? null :
              <thead>
                <tr>
                  {
                    title.map((str, i) => (<th key={i}>{str}</th>))
                  }
                  <th>Delete</th>
                </tr>
              </thead>
          }
          <tbody>
            {
              !state.staged ? null :
                JArray.subtract(state.extraFields, state.bin).map((field, index) => (createRow(field, index)))
            }
          </tbody>
        </table>
        <div className="t-right">
          <span className="btn-like" onClick={handleAdd}>+ {buttonLabel}</span>
        </div>
      </div>
    )
  }

  const singleColumnRender = () => {
    return (
      <div style={readOnly? {pointerEvents: 'none', cursor: 'not-allowed', ...style} : null} className={className + " jpc"}>
        <div>
          {
            !state.staged ? null :
              JArray.subtract(state.extraFields, state.bin).map((field, index) => (createRow(field, index)))
          }
        </div>
        <div className="t-right">
          <span className="btn-like" onClick={handleAdd}>+ {buttonLabel}</span>
        </div>
      </div>
    )
  }

  switch (columnType) {
    case ColumnType.SingleColumn:
      return singleColumnRender();
    case ColumnType.MultipleColumn:
      return multipleColumnRender();
    default:
      return null;
  }

}

export default forwardRef(MultipleRow);

export const ColumnType = {
  SingleColumn: "single",
  MultipleColumn: "multiple"
}

export const ExportType = {
  Direct: "direct",
  Indirect: "indirect"
}
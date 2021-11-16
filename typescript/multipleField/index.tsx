import { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react";
import { IMultipleFieldProps, IMultipleFieldRefDirect, IMultipleFieldState } from "../interfaces/forms/multiple";
import { confirm } from './../dialog/dialog.reducer';
import { arrays } from '../../tyroid/array/index';
import { IObjectMap } from '../Interfaces';
import "./index.scss";

const defaultName = "multipleRow";

function MultipleField (props: IMultipleFieldProps, ref: Ref<IMultipleFieldRefDirect | Record<string, object>>) {
    const [state, setState] = useState<IMultipleFieldState>({
        staged: false, bin: [], extraFields: props.initialize ? [(props.name ?? defaultName) + 0] : []
    });
        
    const arrayToState = (data: any[] = []) => {
        let tempState: IObjectMap = {}, extraFields: string[] = [];
        data.forEach(each => {
        const field = (props.name ?? defaultName) + extraFields.length;
        extraFields.push(field);
        Array.isArray(props.keys) && props.keys.forEach(key => {
            tempState[field + key] = each[key];
        });
        if (props.usingID) {
            tempState[field+"id"] = each["id"];
        }
        });
        setState({...state, ...tempState, extraFields: extraFields, staged: true });
    }

    if (Array.isArray(props.defaultValue) && !state.staged) {
        arrayToState(props.defaultValue);
    }
    else {
        !state.staged && setState({ ...state, staged: true });
    };
    
    const stateToArray = () => {
        let res: IObjectMap[] = [];
        const data = Object.assign({}, props.getter());
        arrays.subtract(state.extraFields, state.bin).forEach(each => {
        if (props.columnType === "single") {
            if (Array.isArray(props.keys)) {
                res.push(data[each+props.keys[0]])
            } else {
                res.push(data[each]);                
            }
        }
        else {
            let obj: IObjectMap = {};
            Array.isArray(props.keys) && props.keys.forEach(key => {
            obj[key] = data[each + key] || "";
            });
            if (props.usingID) {
            obj["id"] = data[each+"id"] || 0;
            }
            res.push(obj);
        }
        });
        return res;
    }
    
    useEffect(() => {
        if (Array.isArray(props.defaultValue) && props.defaultValue.length > 0) {
            arrayToState(props.defaultValue);
        }
    }, [props.defaultValue]);
        
    useEffect(() => {
        if (state.staged) {
        props.setter(state);
        }
    }, [state.staged]);
    
    useImperativeHandle(ref, () => {
        const res: IMultipleFieldRefDirect = {
            "prev": ref,
            "data": stateToArray(),
            "rawData": props.getter(),
            "fields": arrays.subtract(state.extraFields, state.bin)
        };

        if (props.exportType === "indirect") {
            return { ...ref, [props.name ?? defaultName]: res } as Record<string, Object>;
        } else {
            return res as IMultipleFieldRefDirect;
        }
    });

    const handleRemove = (field: string) => {
        confirm("Are you sure you want to remove?", () => {
            setState(prev => { return { ...prev, bin: prev.bin.concat(field) } });
        });
    }

    const handleAdd = () => {
      //Check if filled before adding new role
      setState(prev => {
        const field = (props.name ?? defaultName) + prev.extraFields.length;
        return { ...prev, [field]: "", extraFields: prev.extraFields.concat(field) }
      });
  
    }

    const createRow = (field: string, index: number) => {
      if (props.columnType === "multiple") {
        return (
            <>
                <tr key={index}>
                    {props.serialize ? <td>{index + 1}</td> : null}
                    {
                    props.row(field, index).data.map((each, i) => (<td key={i}>{each}</td>))
                    }
                </tr>
                <tr className="content-right">      
                    <td >
                        <span key={index} title="Remove this entry" className="remove-btn" onClick={handleRemove.bind(null, field)}> delete </span>                
                    </td> 
                </tr>
            </>
        );
      }
      else {
        return(
          <div className="row">
            <span style={{width: '100%'}}>{props.row(field, index).data}</span>       
            <div className="content-right">
                <span key={index} title="Remove this entry" className="remove-btn" onClick={handleRemove.bind(null, field)}> delete </span>                
            </div>   
          </div>
        );
      }
  
    }

    const singleColumnRender = () => {
        return (
          <div style={props.readonly? {pointerEvents: 'none', cursor: 'not-allowed', ...props.style} : undefined} className={(props.className ?? "") + "multiple-field"}>
            <div>
              {
                !state.staged ? null :
                  arrays.subtract(state.extraFields, state.bin).map((field, index) => (createRow(field, index)))
              }
            </div>
            <div className="content-right">
              <span className="add-btn" onClick={handleAdd}>+ {props.buttonLabel ?? "Add"}</span>
            </div>
          </div>
        )
    }

    const multipleColumnRender = () => {
        return (
            <div style={props.readonly? {pointerEvents: 'none', cursor: 'not-allowed', ...props.style} : undefined} className={(props.className ?? "") + "multiple-field"}>
                <table className="">
                {
                    Array.isArray(props.title) &&
                    <thead>
                        <tr>
                        {
                            props.title.map((str, i) => (<th key={i}>{str}</th>))
                        }
                        <th>Delete</th>
                        </tr>
                    </thead>
                }
                <tbody>
                    {
                    !state.staged ? null :
                        arrays.subtract(state.extraFields, state.bin).map((field, index) => (createRow(field, index)))
                    }
                </tbody>
                </table>
                <div className="content-right">
                <span className="add-btn" onClick={handleAdd}>+ {props.buttonLabel ?? "Add"}</span>
                </div>
            </div>
        )}

    switch (props.columnType) {
        case "multiple": return multipleColumnRender();
        default: return singleColumnRender();
    }
}

export default forwardRef(MultipleField);
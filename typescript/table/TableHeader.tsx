import React from 'react';
import Checkbox from './Checkbox';
import { ITableHeaderProps } from './../interfaces/table/index';
import { JContent } from './table.service';
import { BiSort } from 'react-icons/bi';
import { strings } from '../../tyroid/strings/index';


export default function TableHeader (props: ITableHeaderProps) {
    const formatTH = (th: string) => {        
        return strings.destructureCamelCase(th, " ").replace("_", " ");
    }

    return (
        <thead>
            <tr className="bold">
                {(props.useCheckboxSelect !== false) &&
                    <th className="checkbox-col">
                        <Checkbox checked={props.checkedAll} onChange={props.onCheckBoxChange} />
                    </th>
                }
                {
                    (props.title !== undefined || "" || [])?
                        props.title.map((th, i) => (
                            <React.Fragment key={i}> 
                            {
                                (JContent.equalsIgnoreCase(th, "id") || JContent.equalsIgnoreCase(th, "s/n") || JContent.equalsIgnoreCase(th, "sn"))?
                                    (props.ul === undefined)?
                                        <th data-order="default" onClick={props.sorter.bind(null, "props", th, i)} ref={props.refSetter.bind(null, "thead"+i)} > <div className="thead-child"><span className="label">{formatTH(th).toUpperCase()}</span> <BiSort className="icon" /></div>  </th>
                                        : null
                                :
                                th.includes("audit")? null :
                                    <th data-order="default" onClick={props.sorter.bind(null, "props", th, i)} ref={props.refSetter.bind(null, "thead"+i)} > <div className="thead-child"><span className="label">{formatTH(th)}</span> <BiSort className="icon" /></div> </th>

                            }
                            </React.Fragment>
                        ))
                    :
                        props.dataKeys.map((th, i) => (
                            <React.Fragment key={i}> 
                            {
                                (JContent.equalsIgnoreCase(th, "id") || JContent.equalsIgnoreCase(th, "s/n") || JContent.equalsIgnoreCase(th, "sn"))?
                                    (props.ul === undefined)?
                                        <th data-order="default" onClick={props.sorter.bind(null, "props", th, i)} ref={props.refSetter.bind(null, "thead"+i)} > <div className="thead-child"><span className="label">{formatTH(th)}</span> <BiSort className="icon" /></div></th>
                                        : null
                                :
                                    <th data-order="default" onClick={props.sorter.bind(null, "props", th, i)} ref={props.refSetter.bind(null, "thead"+i)} >  <div className="thead-child"><span className="label">{formatTH(th)}</span> <BiSort className="icon" /></div> </th>

                            }
                            </React.Fragment>
                        ))
                }
                {
                    (props.actionOptions !== undefined) && <th className="action"> ACTION </th>
                }
            </tr>
        </thead>
    )
}
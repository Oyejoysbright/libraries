import React from 'react';
import { IObjectMap } from '../../Interfaces';
import { Services } from '../../table/table.service';

export const useRenderByType = (props: IObjectMap, item: IObjectMap, key: string) => {
    return (
        (key.includes("picture") || key.includes("photo") || key.includes("image")) ?
            <img src={item[key]} width="40px" height="40px" className="picture" alt="" />
            :
            (key.includes("link")) ?
                <a href={item[key]} target="_blank" rel="noopener noreferrer" >Open Link </a>
                :
                (key.includes("Date") || key.includes("date")) ?
                    Services.formatDate(props.dateFormat, item[key])
                    :
                    (item[key] !== undefined) ?
                        (item[key] === true) ? "True" :
                            (item[key] === false) ? "False" :
                                (item[key] === null) ? "Null" :

                                    <p title={item[key]}>
                                        {item[key]}
                                    </p>
                        : ""
    )
}
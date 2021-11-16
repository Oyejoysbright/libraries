import { IObjectMap } from '../../Interfaces';
import React from 'react';

export interface IOptionalMultipleFieldProps {
    name?: string;
    usingId?: boolean;
    readonly?: boolean;
    title?: string [];
    serialize?: boolean;
    initialize?: boolean;
    defaultValue?: any;
    buttonLabel?: string;
    style?: IObjectMap;
    className?: string;
    columnType?: "single" | "multiple";
    exportType?: "direct" | "indirect";
    usingID?: boolean;
    keys?: string [];
}

type Row = {
    data: React.ReactNode [];
}

export interface IMultipleFieldProps extends IOptionalMultipleFieldProps {
    getter: () => IObjectMap;
    setter: (state: IObjectMap) => void;
    row: (field: string, index: number) => Row;
}

export interface IMultipleFieldState {
    staged: boolean, bin: string [], extraFields: string []
}

export interface IMultipleFieldRefDirect {
    prev: any;
    data: IObjectMap[];
    rawData: IObjectMap;
    fields: string[];
}
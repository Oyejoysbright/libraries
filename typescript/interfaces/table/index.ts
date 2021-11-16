import { ChangeEvent } from 'react';
import { IAxiosHTTPError } from '../../utils/AxiosHTTP';
import { TCallback, IObjectMap } from '../../Interfaces';

export type TTableURL = {
    baseUrl?: string;
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
    params?: string
}

export type TTableCRUDResponse<DATA> = {
    data: DATA | IAxiosHTTPError,
    status: boolean,
    message: string,
    code: number
}

export type TTableCRUDType = "add" | "edit" | "delete";

export type TTableActionOption = {
    label: string;
    value: string;
    title: string;
}

export interface ITableOptionalProps<D> {
    ul?: boolean,
    checkbox?: boolean,
    inlineEdit?: boolean,
    staticData?: boolean
    onRowDoubleClick?: Function,
    useToolTip?: boolean,
    checked?: Function,
    rowSelection?: boolean,
    restrictChange?: Function,
    onRowClick?: Function,
    useCheckboxSelect?: boolean,
    customRendering?: Function,
    inlineEditData?: Array<string>,
    onContentChange?: Function,
    renderColumns?: Array<string>,
    unRenderedColumns?: Array<string>,
    onActionOptionClick?(row: IObjectMap, e: ChangeEvent<HTMLSelectElement>): void,
    actionOptions?: Array<TTableActionOption> | ((item: IObjectMap) => Array<TTableActionOption>),
    groupedActionOptions?: Array<TTableActionOption>,
    form?: Function,
    useToolBox?: boolean,
    useTools?: boolean,
    useSearch?: boolean,
    dateFormat?: string,
    URL?: TTableURL,
    onCreate?(data: TTableCRUDResponse<D> | null): void,
    onCreated?(data: TTableCRUDResponse<D> | null): void,
    onUpdate?(data: TTableCRUDResponse<D> | null): Array<string>,
    onUpdated?(data: TTableCRUDResponse<D> | null): void,
    onDelete?(data: TTableCRUDResponse<D> | null): void,
    onDeleted?(data: TTableCRUDResponse<D> | null): void,
    onRefresh?: TCallback,
    onFetched?(data: any): Array<IObjectMap>,
    buttonLabel?: string[],
    customRowClassName?: (row: IObjectMap) => string
    useID?: Boolean
    title?: Array<string>,
    perPage?: number,
}

export interface ITableProps<D> extends ITableOptionalProps<D> {
    data: Array<IObjectMap>,
    total: number
    onComponentChange: (type: TTableCRUDType | any, rowSelected: Array<IObjectMap>) => JSX.Element | null,
    onChange: (offset: number, perPage: number, pageNumber: number) => void
}

export interface ITableState {
    dataList: Array<IObjectMap>,
    checkAll: boolean,
    rowsSelected: IObjectMap,
    showComponent: boolean,
    currentPage: number,
    componentShowing: any,
    loading: boolean,
    total: number,
    title: string[]
}

export interface ITableHeaderProps {
    onCheckBoxChange: Function,
    useCheckboxSelect: boolean | undefined,
    checkedAll: boolean,
    title: Array<string>,
    ul: boolean | undefined,
    sorter: Function,
    refSetter: Function,
    actionOptions?: Array<TTableActionOption> | ((item: IObjectMap) => Array<TTableActionOption>),
    dataKeys: Array<string>
}

export interface ITableToolBoxProps {
    useSearch: boolean | undefined;
    useTools: boolean | undefined;
    showComponent: boolean | undefined;
    onClick: Function;
    onEdit: () => boolean;
    onSave: Function;
    onDelete: TCallback;
    onRefresh: TCallback;
    menus?: Array<TTableActionOption>;
    buttonLabel?: string[];
}

export interface ITableMenuBoxProps {
    show: boolean;
    onClose: TCallback;
    children: JSX.Element;
}

export interface ITableFetchResponse<DATA> {
    list: DATA[];
    total: number;
}
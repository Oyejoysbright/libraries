import React, { Component } from "react";
import "./table.scss";
import { JArray, JArrayObject, JContent, Services } from './table.service';
import Checkbox from "./Checkbox";
import {rowsPerPage, ToolTipFunc} from './table.config'
import { IObjectMap } from '../Interfaces';
import Pagination from './../pagination/Pagination';
import { ITableFetchResponse, ITableProps, ITableState } from './../interfaces/table/index';
import TableHeader from "./TableHeader";
import TableToolBox from "./TableToolBox";
import {useRenderByType} from "../hooks/table";
import {axiosHttp, IAxiosHTTPError, IAxiosHTTPResponse} from "./../utils/AxiosHTTP";
import { TTableCRUDResponse } from '../interfaces/table/index';
import { confirm, alert } from '../dialog/dialog.reducer';

let currentOffset: number = 0, currentPage: number = 0;

export class Table<DATA> extends Component<ITableProps<DATA>, ITableState> {
    private tableRef: any; private setRef: any;
    
    constructor(prop: any) {
        super(prop);

        this.state = {
            dataList: prop.data || [], checkAll: false, rowsSelected:{}, showComponent: false, currentPage: 0, componentShowing: <div></div>,
            loading: true, total: (this.props.data && this.props.data.length) || 0, title: this.props.title || []
        }

        this.tableRef = {};
        this.setRef = (name: string, element: any) => {
            this.tableRef[name] = element;
        }
    }    

    componentDidMount() {
        if(this.props.data){
            if(this.props.perPage && this.props.data.length > this.props.perPage) {
               this.setState({dataList: JArrayObject.pageRequest(this.props.data, 0, this.props.perPage)});
            }
        }
        this.fetchData(0, 0, this.props.perPage || rowsPerPage);
    }

    componentWillUnmount() {
        currentOffset = 0;
        currentPage = 0;
    }

    fetchData = (offset: number, page: number, size: number) => {
        const baseUrl = this.props.URL?.baseUrl? this.props.URL?.baseUrl : "";
        const params = (this.props.URL?.params? (`?${this.props.URL?.params}&`) : "?") + (`offset=${offset}&page=${page}&size=${size}&perPage=${size}`);
        this.props.URL?.read && axiosHttp({
            url: baseUrl + this.props.URL.read + params,
            method: "GET",
            onSuccess: (data: IAxiosHTTPResponse<ITableFetchResponse<DATA>>) => {
                if(this.props.onFetched) {
                    this.setState({dataList: this.props.onFetched(data.data), total: data.data.total});
                }
                else {
                    this.setState({dataList: data.data.list, total: data.data.total});
                }
                if(!this.props.title) {
                    let arg = {};
                    if(!this.props.useID) {
                        arg = {"id": "sn"};
                    }
                    this.setState({title: Services.buildTitle(data.data.list[0], arg, (this.props.unRenderedColumns || []))})
                }
            },
            onFailure: (error: IAxiosHTTPError) => {
                alert(error.reason || "Unable to fetch");
            }
        })
    }
    

    componentDidUpdate({}, state: ITableState) {
        if (JSON.stringify(state.dataList) !== JSON.stringify(this.props.data)) {
            if(this.props.data) {
                if(this.props.perPage && this.props.data.length > this.props.perPage) {
                    const trimmedData = JArrayObject.pageRequest(this.props.data, currentPage, this.props.perPage);
                    if(JSON.stringify(state.dataList) !== JSON.stringify(trimmedData)) {
                        // this.setState({dataList: trimmedData});
                    }
                }
                else {
                    this.setState({dataList: this.props.data, loading: false, total: this.props.total || 0});
                }
                
            }
        }

        if (state.total !== this.props.total) {
            this.props.total && this.setState({total: this.props.total || 0});
        }

        if (state.title !== this.props.title) {
            this.props.title && this.setState({title: this.props.title || []});
        }

        if(state.loading) {
            setTimeout(() => {
                this.setState({loading: false});
            }, 100000);
        }
    }
    
    handleSorting = (referral = "", property = "", index = 0) => {
        let ref = this.tableRef["thead"+index];
        let currentOrder = ref.dataset.order;

        if (referral === "props") {
            const index:number = JArray.find.getIndex(this.props.title, property);
            property = JArrayObject.getKeys(this.state.dataList)[index];
        }

        const reset = (order = "") => {
            this.setState(state => {
                return {dataList: state.dataList.sort(JArrayObject.customSort(JArrayObject.getKeys(state.dataList)[0], order))}
            });
            ref.dataset.order = "default";
            ref.className = ref.className.replace( " sorting", "");
        }

        const sorter = (order = "") => {
            this.setState(state => {
                return {dataList: state.dataList.sort(JArrayObject.customSort(property, order))}
            });
            ref.dataset.order = order;
            ref.className += " sorting";
        }

        switch (currentOrder) {
            case "asc":
                sorter("desc");
                break;
            case "desc":
                reset();
                break;        
            default:
                sorter("asc");
                break;
        }
    }

    handleCheckAll = (e: any) => {
        let selected: IObjectMap = {};
        JArrayObject.getValues(this.state.dataList, "id").forEach(item => {
            e.target.checked? (selected[item] = true) : (selected[item] = false)
        });
        this.setState({rowsSelected: selected, checkAll: e.target.checked});
    }

    handleRowClick = () => {

    }

    handleCheckBox = (ref: any, item: any) => {
        if (!this.state.rowsSelected[item.id]) {
            this.setState(state => {
                let rowsSelected = {...state.rowsSelected, [item.id]: true};
                let counter = 0;
                for (const key in rowsSelected) {
                    if (rowsSelected[key] === true) {
                        counter++;
                    }
                }
                return {rowsSelected: rowsSelected, checkAll: counter === state.dataList.length? true : false};
            });
    
            if (this.props.onRowClick !== undefined) {
                this.props.onRowClick(item, this.tableRef[ref], Services.getSelectedInArray(this.props, this.state,{[item.id]: true}));
            }
        }
        else {
            this.setState(state => ({rowsSelected: {...state.rowsSelected, [item.id]: false}}));
            if (this.props.onRowClick !== undefined) {
                this.props.onRowClick(item, this.tableRef[ref], Services.getSelectedInArray(this.props, this.state, {[item.id]: false}));
            }
        }
        
    }

    handleColDoubleClick = (ref:any, index: number) => {
        if (this.props.inlineEdit !== undefined && this.props.inlineEditData !== undefined && JArray.find.getBoolean(this.props.inlineEditData, JArrayObject.getKeys(this.state.dataList)[index])) {
            this.tableRef[ref].contentEditable = true;
            this.tableRef[ref].className = "edit-active";
        }
    }

    editSelectedRows = () => {
        let res: boolean = false;
        if(this.props.onUpdate) {
            const uneditableColumns =  this.props.onUpdate(null);
            let selectedIds: Array<number> = [];
            for (const key in this.state.rowsSelected) {
                this.state.rowsSelected[key] && selectedIds.push(parseInt(key));         
            }
            this.state.dataList.forEach(element => {
                if(selectedIds.includes(element.id)) {
                    for(const key in element) {
                        if(!uneditableColumns.includes(key)) {
                            const ref = "ref"+this.state.dataList.indexOf(element)+ (Object.keys(element).indexOf(key).toString());
                            if(this.tableRef[ref]) {
                                this.tableRef[ref].contentEditable = true;
                                this.tableRef[ref].className = "edit-active";
                                res = true;
                            }
                        }
                    }
                }
            });
            return res;
        }
        
        return res;
    }

    closeEditForSelectedRows = () => {
        let selectedIds: Array<number> = [];
        for (const key in this.state.rowsSelected) {
            this.state.rowsSelected[key] && selectedIds.push(parseInt(key));         
        }
        this.state.dataList.forEach(element => {
            if(selectedIds.includes(element.id)) {
                for(const key in element) {
                    const ref = "ref"+this.state.dataList.indexOf(element)+ (Object.keys(element).indexOf(key).toString());
                    if(this.tableRef[ref]) {
                        this.tableRef[ref].contentEditable = false;
                        this.tableRef[ref].className = "";
                    }
                }
            }
        });
    }

    handleContentChange = (ref: any) => {
        if (this.props.onContentChange) {
            this.props.onContentChange(this.tableRef[ref]);
        }
    }

    handleSpecialClicks = (type: string) => {
        if(this.props.onComponentChange) {
            const comp = this.props.onComponentChange(type, Services.getSelectedInArray(this.props, this.state, false));
            this.setState(prev => {
                if(prev.showComponent) return {...prev, showComponent: false}
                else return {...prev, componentShowing: comp, showComponent: comp === null? false : true}
            });
        }
    }

    changePage = (val: number) => {
        const offset = val * (this.props.perPage || rowsPerPage);
        this.setState({loading: true, dataList: []});
        currentPage = val; currentOffset = offset;
        if(this.props.staticData) {
            this.setState({dataList: JArrayObject.pageRequest(this.props.data, val, (this.props.perPage || rowsPerPage))});
        }
        else {
            if(this.props.URL?.read) {
                this.fetchData(offset, val, (this.props.perPage || rowsPerPage));
            }
            else {
                this.props.onChange && this.props.onChange(offset, (this.props.perPage || rowsPerPage), val);
            }
        }
    }

    handleDelete = () => {
        const data = Services.getSelectedInArray(this.props, this.state, false);
        this.props.onDelete && this.props.onDelete(null);
        confirm("Are you sure you want to delete?", () => {
            

            this.props.URL?.delete && axiosHttp({
                data: data,
                url: this.props.URL?.delete,
                method: "DELETE",
                onSuccess: (res: IAxiosHTTPResponse<DATA>) => {
                    const arg: TTableCRUDResponse<DATA> = {
                        data: res.data, code: res.status, status: true, message: res.statusText
                    }
                    this.props.onDeleted && this.props.onDeleted(arg);
                },
                onFailure: (error: IAxiosHTTPError) => {
                    const arg: TTableCRUDResponse<DATA> = {
                        data: error, code: error.status, status: false, message: error.reason
                    }
                    this.props.onDeleted && this.props.onDeleted(arg);
                }
            })
        });
    }

    handleSave = () => {
        const data = Services.getSelectedInArray(this.props, this.state, false);
        confirm("Are you sure you want to save?", () => {
            
            this.props.URL?.update && axiosHttp({
                data: data,
                url: this.props.URL?.update,
                method: "PUT",
                onSuccess: (res: IAxiosHTTPResponse<DATA>) => {
                    const arg: TTableCRUDResponse<DATA> = {
                        data: res.data, code: res.status, status: true, message: res.statusText
                    }
                    this.props.onUpdated && this.props.onUpdated(arg);
                },
                onFailure: (error: IAxiosHTTPError) => {
                    const arg: TTableCRUDResponse<DATA> = {
                        data: error, code: error.status, status: false, message: error.reason || "Server Error"
                    }
                    this.props.onUpdated && this.props.onUpdated(arg);
                }
            });
        });
        this.closeEditForSelectedRows();
    }

    handleRefresh = () => {
        if(this.props.onRefresh) this.props.onRefresh();
        else this.fetchData(0, 0, (this.props.perPage || rowsPerPage));
    }

    render() {
        return(
            <div className="table-view">
                {
                    this.props.useToolBox !== false &&
                    <TableToolBox
                        buttonLabel={this.props.buttonLabel}
                        onRefresh={this.handleRefresh}
                        onEdit={this.editSelectedRows}
                        onSave={this.handleSave}
                        onDelete={this.handleDelete}
                        useSearch={this.props.useSearch}
                        useTools={this.props.useTools}
                        showComponent={this.state.showComponent}
                        onClick={this.handleSpecialClicks}
                        menus={this.props.groupedActionOptions}
                    />
                }
                { this.state.showComponent? <div className="table-content">{this.state.componentShowing}</div>: 
                    <div>
                        <table className="table-content">
                            <TableHeader 
                                onCheckBoxChange={this.handleCheckAll} 
                                useCheckboxSelect={this.props.useCheckboxSelect}
                                checkedAll={this.state.checkAll}
                                title={this.state.title}
                                ul={this.props.ul}
                                sorter={this.handleSorting}
                                refSetter={this.setRef}
                                actionOptions={this.props.actionOptions}
                                dataKeys={Services.getThead(this.state.dataList)}
                            />
                            <tbody>
                            {
                                Services.reorderKeys(this.state.dataList || [], ["id"]).map((item:IObjectMap, i) => (
                                    <tr onDoubleClick={() => {if(this.props.onRowDoubleClick !== undefined) this.props.onRowDoubleClick(item)}} onMouseOver={() => {this.props.useToolTip !== false && ToolTipFunc.bind(null, item["auditTraceResponse"])} } data-position={i} className={`${Services.getRowClassName(this.props, this.state, item)} ${this.props.customRowClassName? this.props.customRowClassName(item) : ""}`} key={i} onClick={this.handleRowClick.bind(null, "ref"+i,item)} ref={this.setRef.bind(null, "ref"+i)}>
                                        {
                                            (this.props.useCheckboxSelect !== false)?
                                                <td className="checkbox-col">
                                                    <Checkbox checked={this.state.rowsSelected[item.id] || (this.props.checked? this.props.checked(item) : false)} onChange={this.handleCheckBox.bind(null, "ref"+i,item)} />
                                                </td>
                                            : null
                                        }
                                        {
                                            Services.getKeys(item).map((key, j) => (
                                                <React.Fragment key={j}> 
                                                {
                                                    (JContent.equalsIgnoreCase(key, "id") || JContent.equalsIgnoreCase(key, "s/n") || JContent.equalsIgnoreCase(key, "sn"))?
                                                        (this.props.ul === undefined)?
                                                        <td><b>{currentOffset+i+1}</b></td> : null
                                                    :
                                                        ((this.props.renderColumns && !this.props.renderColumns.includes(key)) || (this.props.unRenderedColumns && this.props.unRenderedColumns.includes(key)) || key.includes("audit"))? null : 
                                                        <td ref={this.setRef.bind(null, "ref"+i+j)} onDoubleClick={this.handleColDoubleClick.bind(null, "ref"+i+j, j)} onKeyUp={this.handleContentChange.bind(null, "ref"+i+j)}> 
                                                        {
                                                            (this.props.customRendering !== undefined)? 
                                                                <td  ref={this.setRef.bind(null,"ref"+i+j)} onDoubleClick={this.handleColDoubleClick.bind(null, "ref"+i+j, j)} onKeyUp={this.handleContentChange.bind(null, "ref"+i+j)}>
                                                                    {this.props.customRendering(item[key], key, j, item, i)}
                                                                </td>
                                                        :   useRenderByType(this.props, item, key)}
                                                    </td>
                                                }
                                                </React.Fragment>
                                            ))
                                        }
                                        {
                                            (this.props.actionOptions !== undefined) &&
                                            <td>
                                                <select value="" onChange={(e) => {this.props.onActionOptionClick && this.props.onActionOptionClick(item, e)}}>
                                                    <option value="">Select</option>
                                                    {
                                                        !Array.isArray(this.props.actionOptions)?
                                                            this.props.actionOptions(item).map((opt:any, i: number) => (<option value={opt.value || opt.label} label={opt.label} title={opt.title} key={i} />))
                                                        :
                                                            this.props.actionOptions.map((opt:any, i: number) => (<option value={opt.value || opt.label} label={opt.label} title={opt.title} key={i} />))
                                                    }
                                                </select>
                                            </td>
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        <Pagination total={this.state.total} perPage={this.props.perPage || rowsPerPage} page={currentPage} onChange={this.changePage} />
                    </div>
                }
            </div>
        )
    }
}
export default Table;
export const ActionOptionRenderType = {
    Function: "func",
    Array: "array"
}
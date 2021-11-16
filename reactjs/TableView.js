import React, { Component } from 'react';
import ZeroContainer from './ZeroContainer';
import './ObjectList.css';
import ImageField from './ImageField';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import TextLimit from './TextLimit';
import { Link } from 'react-router-dom';
import { JArrayObject, JContent, JArray, JObject } from '../utils/Jpc';
import { FaSort} from 'react-icons/fa';
import LabelField from './LabelField';
import moment from 'moment';
import RigidLoading, { StrictMode } from './RigidLoading';
import { showToolTip } from './tooltip/Tooltip';
import { auditToToolTip, Settings, Values } from '../../services/Constant';


/**
 * 
 * Assemble array of objects in a table and give easy access to rows and cols
 * 
 * 
 * @param {Boolean} actionColumn Define extra column for delete, edit and view in a select tag. Takes Boolean
 * 
 * @param {} ul Define non serialize rows. Takes None
 * 
 * @param {String} customButtonLabel Define custom button label. Takes String
 * 
 * @param {String} linkLabel Define links label. Takes String
 * 
 * @param {Array} data Define data to mount into the table. Takes Array of Objects
 * 
 * @param {Array} title Define header (thead) of the table. Takes Array of Strings
 * 
 * @param {Number} total Define total number of data available. Takes Number
 * 
 * @param {Number} perPage Define numbers to load per page. Takes Number
 * 
 * @param {} inlineEdit Define columns editable. Takes None
 * 
 * @param {Array} inlineEditData Define columns (Must match items in title array). Takes Array of Strings
 * 
 * @param {} batchProcess Define batch actions. Takes None
 * 
 * @param {Boolean} showDPR Define an option to show displays records. Takes Boolean
 * 
 * @param {Boolean} showNavigation Define an option to use navigation. Takes Boolean
 * 
 * @param {Boolean} showNavigationText Define an option to show navigation label. Takes Boolean
 * 
 * @param {String} searchString Define the word being searched. Takes String
 * 
 * @param {Boolean} isSearching Define the process of searching. Takes Boolean
 * 
 * @param {Function} onEdit Define an option to edit a row. Return the particular row as object and the event of the button. Takes Function
 * 
 * @param {Function} onDelete Define an option to delete a row. Return the particular row as object and the event of the button. Takes Function
 * 
 * @param {Function} onView Define an option to view a row. Return the particular row as object and the event of the button. Takes Function
 * 
 * @param {Function} onChange Define pagination. Return current offset and data per page. Takes Function
 * 
 * @param {Function} onCustomButton Define on custom button click. Takes Function
 * 
 * @param {Function} onLink Define on link button click. Takes Function
 * 
 * @param {Function} onRowClick Define on click of a particular row. Takes Function
 * 
 * @param {Function} onUpdate Define an option to update the table (This depends on inlineEdit). Takes Function and Return Array of Object
 * 
 * @param {Function} onBatchDelete Define an option to delete selected rows (This depends on batchProcess). Takes Function
 * 
 * @param {Function} onBatchEdit Define an option to edit selected rows (This depends on batchProcess). Takes Function
 * 
 */
let currentOffset = 0, currentPage = 0;
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
             theadList: [], actionColumn: this.props.actionColumn, ul: this.props.ul, customButtonLabel: this.props.customButtonLabel, linkLabel: this.props.linkLabel, dataList: [], total: this.props.total,
             currentPage: 0, dataPerPage: this.props.perPage, otherPages: [], currentOffset: 1, navInput: "",
             inlineEdit: this.props.inlineEdit, batchProcess: this.props.batchProcess, rowsSelected: {}, offset: 0, dateFormat: Settings().dateFormat || this.props.dateFormat || "dd/MM/yyyy",
             loading: true, unRenderColumns: this.props.unRenderColumns || [], renderColumns: this.props.renderColumns || JArrayObject.getKeys(this.props.data)
        }
        

        this.tableRef = React.createRef();
        this.theadItemRef = React.createRef();
        this.pageTogo = React.createRef();
        
        if (Array.isArray(this.props.title)) {
            for (let i = 0; i < this.props.perPage; i++) {
                this["ref"+i] = React.createRef();
                for (let j = 0; j < this.props.title.length+10; j++) {
                    this["thead"+j] = React.createRef();
                    this["ref"+i+j] = React.createRef();
                }
            }
        } else {
            for (let i = 0; i < this.props.perPage; i++) {
                this["ref"+i] = React.createRef();
                for (let j = 0; j < JArrayObject.getKeys(this.props.data).length; j++) {
                    this["thead"+j] = React.createRef();
                    this["ref"+i+j] = React.createRef();
                }
            }
        }


        this.zeroContainerPlaceholder = (content = "Data is Empty") => <tr className="zero-placeholder"><td colSpan={this.props.title.length+1 + (this.props.useCheckboxSelect? 1 : 0)}> <h1 className="content-center">{content}</h1></td></tr>
    }



    //Get number of columns and heading
    /**
     * 
     * @param {*} data 
     */
    getThead = (data = []) => {
        var thead = [];
        for (const key in data[0]) {
            thead.push(key);
        }
        return thead;
    }

    getKeys = (data) => {
        var dataKey = [];
            for (const key in data) {
                dataKey.push(key);
            }
            return dataKey;  
    }

    createDynamicRefs = (data = []) => {
        console.log(data)
        let refs = [];
        for (let i = 0; i < data.length; i++) {
            for (const key in data[i]) {
                refs.push(key+i);
            }
        }
        return refs;
    }


    componentDidMount() {
        currentOffset = this.props.offset || 0;
        this.getOtherPages(this.props.total);
        this.firstPage("onMount");
    }
    
    componentDidUpdate(props, state) {


        if (JSON.stringify(state.dataList) !== JSON.stringify(this.props.data)) {
            this.setState({dataList: this.props.data, loading: false, total: this.props.total, renderColumns: this.props.renderColumns || JArrayObject.getKeys(this.props.data)});
        }

        // if(state.currentPage !== currentPage) {
        //     console.log(currentPage);
        //     this.setState({currentPage: currentPage});
        // }

        // if(this.props.data.length === 0 && state.loading) {
        //     this.setState({loading: false});
        // }
        
        if (state.total !== this.props.total) {
            this.setState({total: this.props.total});
            this.getOtherPages(this.props.total);
        }

        if (this.props.customButtonLabel !== props.customButtonLabel) {
            this.setState({customButtonLabel: this.props.customButtonLabel});
        }

        if (this.props.customButtonActive !== props.customButtonActive) {
            this.setState({customButtonActive: this.props.customButtonActive});
        }

        if(state.loading) {
            setTimeout(() => {
                this.setState({loading: false});
            }, 80000);
        }

    }


    handleSelectChange = (item,e) => {
        this.props.onActionOptionClick(item, e);
    }


    firstPage = (onMount) => {
        const newPage = 0;
        const offset = newPage * this.state.dataPerPage;
        this.setState({currentPage: newPage, loading: true, dataList: []});
        currentPage = newPage; currentOffset = offset;
        if(onMount !== "onMount") {
            this.props.onChange(offset, this.state.dataPerPage, newPage);
        }
    }
    
    prevPage = () => {
        const newPage = currentPage-1;
        const offset = newPage * this.state.dataPerPage;
        this.setState({loading: true, dataList: []});
        currentPage = newPage; currentOffset = offset;
        this.props.onChange(offset, this.state.dataPerPage, newPage);
    };

    lastPage = () => {
        const newPage = Math.ceil(this.state.total / this.state.dataPerPage) - 1;
        const offset = newPage * this.state.dataPerPage;
        this.setState({ loading: true, dataList: []});
        currentPage = newPage; currentOffset = offset;
        this.props.onChange(offset, this.state.dataPerPage, newPage);
    };
    
    nextPage = () => {
        const newPage = currentPage + 1;
        const offset = newPage * this.state.dataPerPage;
        this.setState({loading: true, dataList: []});
        currentPage = newPage; currentOffset = offset;
        this.props.onChange(offset, this.state.dataPerPage, newPage);
    };

    changePage = (val) => {
        val = parseInt(val);
        console.log(val + " to change")
        const newPage = val;
        const offset = newPage * this.state.dataPerPage;
        this.setState({offset: offset, loading: true, dataList: []});
        currentPage = newPage; currentOffset = offset;
        this.props.onChange(offset, this.state.dataPerPage, newPage);
    }

    getOtherPages = (total) => {
        var totalPages = Math.ceil(total / this.props.perPage);
        var collate = [];
        for (let index = 1; index < totalPages; index++) {
            collate.push(index);
        }
        this.setState({otherPages : collate});
    }

    customBtnClicked = (row,e) => {
        this.props.onCustomButton(row,e);
    }

    linkClicked = (row, e) => {
        this.props.onLink(row, e);
    }

    handleDisplaySelectChange = (e) => {
        currentOffset = 0;
        this.props.onChange(currentOffset, e.target.value, 0);
        this.setState({dataPerPage: e.target.value, loading: true});
    }

    handleSorting = (referral = "", property, index) => {
        let ref = this["thead"+index];
        let currentOrder = ref.current.dataset.order;

        if (referral === "props") {
            const index = JArray.find.getIndex(this.props.title, property);
            property = JArrayObject.getKeys(this.state.dataList)[index];
        }

        const reset = (order = "") => {
            this.setState(state => {
                return {dataList: state.dataList.sort(JArrayObject.customSort(JArrayObject.getKeys(state.dataList)[0], order))}
            });
            ref.current.dataset.order = "default";
            ref.current.className -= " sorting";
        }

        const sorter = (order = "") => {
            this.setState(state => {
                return {dataList: state.dataList.sort(JArrayObject.customSort(property, order))}
            });
            ref.current.dataset.order = order;
            ref.current.className += " sorting";
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

    handleRowClick = (ref, item) => {
        if (!this.state.rowsSelected[item.id]) {
            this.setState(state => ({rowsSelected: {...state.rowsSelected, [item.id]: true}}));
    
            if (this.props.onRowClick !== undefined) {
                this.props.onRowClick(item, this[ref], this.getSelectedInArray({[item.id]: true}));
            }
        }
        else {
            this.setState(state => ({rowsSelected: {...state.rowsSelected, [item.id]: false}}));
            if (this.props.onRowClick !== undefined) {
                this.props.onRowClick(item, this[ref], this.getSelectedInArray({[item.id]: false}));
            }
        }
        
    }

    handleColDoubleClick = (ref, index) => {
        if (this.props.inlineEdit !== undefined && this.props.inlineEditData !== undefined && JArray.find.getBoolean(this.props.inlineEditData, JArrayObject.getKeys(this.state.dataList)[index])) {
            this[ref].current.contentEditable = true;
            this[ref].current.className = "edit-active";
        }
    }

    handleTableDataUpdate = () => {
        let res = [];
        let rows = this.tableRef.current.rows;
        var rowCounter = 0;
        for (const k in rows) {
            if (rowCounter > 0) {
                const row = rows[k];
                let temp = {};
                var colCounter = 0;
                for (const c in row.children) {
                    const col = row.children[c];
                    let keys = [];
                    JArray.subtract(JArrayObject.getKeys(this.state.dataList), this.props.unRenderColumns).forEach(each => {
                        if (!each.includes("audit")) {
                            keys.push(each);
                        }
                    });

                    if (colCounter === 0) {
                        console.log(keys, colCounter)
                        temp[keys[colCounter]] = this.state.dataList[rowCounter-1][keys[colCounter]];
                    }
                    else {
                        if (isNaN(col.textContent)) {
                            temp[keys[colCounter]] = col.textContent;            
                        } else {
                            temp[keys[colCounter]] = parseFloat(col.textContent);                        
                        }
                    }
                    
                    ++colCounter;
                }
                if(Object.keys(temp).length > 0) {
                    res.push(temp); 
                }
            }
            ++rowCounter;
        }
        if (this.props.onUpdate !== undefined) {
            this.props.onUpdate(res);
        }
    }

    handleUpdateTableData = () => {
        let res = [];
        let rows = this.tableRef.current.rows;
        console.log(rows)
        let counter = 0;
        let dataList = this.state.dataList;
        let dataKeys = [];
        JArrayObject.getKeys(dataList, (key) => {
            if (!key.includes("audit")) {
            dataKeys.push(key);
        }});
        
        for (const key in rows) {
            let temp = {};
            var add = false;
            if (counter !== 0 ) {
                const cols = rows[key].cells;console.log(cols)
                let index = 0;
                for (const col in cols) {
                    
                    if (index < dataKeys.length) {
                        let value = cols[col].innerText;
                        let tempKey = dataKeys[index];
                        
                        if (JContent.equalsIgnoreCase(tempKey, "id")) {
                            const pos = rows[key].dataset.position;
                            temp[tempKey] = dataList[pos][tempKey];
                        } 
                        else if (!tempKey.includes("audit")) {
                            temp[tempKey] = value;                            
                        }
                        add = true;
                        index++;
                    }
                    
                }
                if (add) {
                    res.push(temp);                 
                }
            }
            counter++;
        }
        console.log(res)
        if (this.props.onUpdate !== undefined) {
            this.props.onUpdate(res);
        }
    }

    getSelectedInArray = (merge) => {
        let res = [];
        let rowsSelected = this.state.rowsSelected;

        for (const key in rowsSelected) {
            if (rowsSelected[key]) {
                res.push(JArrayObject.find.getObject(this.state.dataList, parseInt(key), "id"));         
            }
        }
        let defaultValues = {};
        if (this.props.checked) {
            this.state.dataList.forEach(item => {
                defaultValues[item.id] = this.props.checked(item);
            });            
        }
        let unedited = JObject.subtract(defaultValues, rowsSelected);
        for (const key in unedited) {
            if (unedited[key]) {
                res.push(JArrayObject.find.getObject(this.state.dataList, parseInt(key), "id"));                
            }
        }
        if (merge) {
            const key = Object.keys(merge)[0];
            if (merge[key]) {
                res.push(JArrayObject.find.getObject(this.state.dataList, parseInt(key), "id"));
            }
            else {
                res = res.filter(obj => (obj.id !== parseInt(key)));
            }            
        }
        return res;
    }
    
    handleBatchEdit = () => {
        if (this.props.onBatchEdit !== undefined) {
            this.props.onBatchEdit(this.getSelectedInArray());
        }
    }
    handleBatchDelete = () => {
        if (this.props.onBatchDelete !== undefined) {
            this.props.onBatchDelete(this.getSelectedInArray());
        }
    }
    handleBatchSelect = (e) => {
        
        if (this.props.onBatchProcess) {
            this.props.onBatchProcess(this.getSelectedInArray(), e);
        }
        if (e) {
            let value = e.target.value;
            switch (value) {
                case "edit":
                    this.handleBatchEdit();
                    break;
                case "delete":
                    this.handleBatchDelete();
                    break;
                default:
                    break;
            }
            
        }
    }

    handleContentChange = (ref) => {
        if (this.props.onContentChange) {
            this.props.onContentChange(this[ref].current);
        }
    }

    formatDate = (date) => {
        const res = moment(date).format(this.state.dateFormat);
        return res === "Invalid date"? date : res;
    }

    handleNavInputChange = (e) => {
        const val = e.target.value;
        if (e.which === 13 || e.keycode === 13) {
            this.changePage(val);
        } else {
            if (parseInt(val) < this.state.otherPages.length) {
                this.setState({navInput: val});             
            }
            else {
                this.setState(prev => {return {...prev, navInput: 0}});
            }
        }
    }

    getRowClassName = (item) => {
        let res = "";
        if((this.state.rowsSelected[item.id] || this.props.checked) && this.props.rowSelection === true) res += " row-selected";
        if(this.props.restrictChange && this.props.restrictChange(item)) res += " no-pointer-event "
        return res;
    }

    handleShowRow = () => {

    }

    handleGoto = () => {
        let value =this.pageTogo.current.value;
        value = value === ""? 0 : parseInt(value);
        if(value > 0 && value <= Math.ceil(this.state.total / this.props.perPage)) {
            this.changePage.bind(null, this.pageTogo.current.value);
        }        
    }

    renderOtherPages = () => {
        let firstTwo = [], lastTwo = [];
        const otherPages = [...this.state.otherPages];
        otherPages.forEach((val, index, arr) => {
            if(index === 0 || index === 1) firstTwo.push(val);
            else if(index === arr.length-2 || index === arr.length-1) lastTwo.push(val);
        });

        return (
            <>
            {
                firstTwo.map((val, i) => (
                    <span title={"Page " + (val+1)} className={(currentPage === val)?"active jpc-disabled":""} key={i} onClick={this.changePage.bind(null,val)} >{val+1}</span>
                ))
            }
            {
                otherPages.length > 4 && 
                <div className="pageTogo" title="Enter page to go" onSubmit={(e) => {e.preventDefault(); }}>
                    <input ref={this.pageTogo} type="text" />
                    <span title="Click to goto the specified value" onClick={this.handleGoto}>GO</span>
                </div>
            }
            {
                lastTwo.map((val, i) => (
                    <span title={"Page " + (val+1)} className={(currentPage === val)?"active jpc-disabled":""} key={i} onClick={this.changePage.bind(null,val)} >{val+1}</span>
                ))
            }
            </>
        )
    }

  render() {
    //   Check if data prop is supplied
        if(this.props.data === "" || this.props.data === undefined){
            throw new Error("Data prop is mandatory! \n Must be array \n If you think this is a code error, contact code provider");
        }
    //   Check if perPage prop is supplied
        if(this.props.perPage === "" || this.props.perPage === undefined){
            throw new Error("perPage prop is mandatory! \n Must be Integer \n If you think this is a code error, contact code provider");
        }
    //   Check if Title prop is supplied
        if(this.props.title === "" || this.props.title === undefined){
            throw new Error("Title prop is mandatory! \n Must be array \n If you think this is a code error, contact code provider");
        }

    
    const isLastPage = this.state.otherPages.slice(-1)[0] === currentPage? true : false;
    const showingTo = parseInt(currentOffset + this.state.dataPerPage);
    const showingFrom = currentOffset + 1;
    const getChecked = () => {return true;}

    return (
        <div className="object-list">
                <div className="table-fit">
                    <div className="scroll">
                        <table ref={this.tableRef}>
                            <thead>
                                <tr className="bold">
                                    {(this.props.useCheckboxSelect)?
                                        <th>
                                            <input title="Check all" type="checkbox" /> Check All
                                        </th>
                                    : null}
                                    {
                                        (this.props.title !== undefined || "" || [])?
                                            this.props.title.map((td, i) => (
                                                <React.Fragment key={i}> 
                                                {
                                                    (JContent.equalsIgnoreCase(td, "id") || JContent.equalsIgnoreCase(td, "s/n") || JContent.equalsIgnoreCase(td, "sn"))?
                                                        (this.state.ul === undefined)?
                                                            <th data-order="default" onClick={this.handleSorting.bind(null, "props", td, i)} ref={this["thead"+i]} > {td} <FaSort className="icon" />  </th>
                                                            : null
                                                    :
                                                    td.includes("audit")? null :
                                                        <th data-order="default" onClick={this.handleSorting.bind(null, "props", td, i)} ref={this["thead"+i]} > {td} <FaSort className="icon" />  </th>

                                                }
                                                </React.Fragment>
                                            ))
                                        :
                                            this.getThead(this.state.dataList).map((td, i) => (
                                                <React.Fragment key={i}> 
                                                {
                                                    (JContent.equalsIgnoreCase(td, "id") || JContent.equalsIgnoreCase(td, "s/n") || JContent.equalsIgnoreCase(td, "sn"))?
                                                        (this.state.ul === undefined)?
                                                            <th data-order="default" onClick={this.handleSorting.bind(null, "props", td, i)} ref={this["thead"+i]} > {td} <FaSort className="icon" /> </th>
                                                            : null
                                                    :
                                                        <th data-order="default" onClick={this.handleSorting.bind(null, "props", td, i)} ref={this["thead"+i]} > {td} <FaSort className="icon" />  </th>

                                                }
                                                </React.Fragment>
                                            ))
                                    }
                                    {
                                        (this.state.actionColumn === true || this.state.actionColumn === undefined)?
                                            <th> ACTION </th>
                                        :
                                            null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <ZeroContainer data={this.state.dataList} placeholder={this.state.loading? this.zeroContainerPlaceholder(<RigidLoading strictMode={StrictMode.container} color="#dfdfdf" active={this.state.loading} />) : this.zeroContainerPlaceholder()}>
                                
                                {
                                    this.state.dataList.map((item, i) => (
                                        <tr onDoubleClick={() => {if(this.props.onRowDoubleClick !== undefined) this.props.onRowDoubleClick(item)}} onMouseOver={this.props.useToolTip !== false? showToolTip.bind(null, auditToToolTip(item["auditTraceResponse"])) : null } data-position={i} className={this.getRowClassName(item)} key={i} onClick={this.handleRowClick.bind(null, "ref"+i,item)} ref={this["ref"+i]}>
                                            {
                                                (this.props.useCheckboxSelect)?
                                                    <td>
                                                        <input type="checkbox" checked={this.state.rowsSelected[item.id] || (this.props.checked? this.props.checked(item) : false)} onChange={this.handleRowClick.bind(null, "ref"+i,item)} />
                                                    </td>
                                                : null
                                            }
                                            {
                                                this.getKeys(item).map((key, j) => (
                                                    <React.Fragment key={j}> 
                                                    {
                                                        (JContent.equalsIgnoreCase(key, "id") || JContent.equalsIgnoreCase(key, "s/n") || JContent.equalsIgnoreCase(key, "sn"))?
                                                            (this.state.ul === undefined)?
                                                            <td><b>{currentOffset+i+1}</b></td> : null
                                                        :
                                                            (this.props.customRendering !== undefined)? 
                                                                <td  ref={this["ref"+i+j]} onDoubleClick={this.handleColDoubleClick.bind(null, "ref"+i+j, j)} onKeyUp={this.handleContentChange.bind(null, "ref"+i+j)}>
                                                                    {this.props.customRendering(item[key], key, j, item, i)}
                                                                </td>
                                                            :
                                                            (!this.state.renderColumns.includes(key) || this.state.unRenderColumns.includes(key) || key.includes("audit"))? null : 
                                                            <td ref={this["ref"+i+j]} onDoubleClick={this.handleColDoubleClick.bind(null, "ref"+i+j, j)} onKeyUp={this.handleContentChange.bind(null, "ref"+i+j)}> 
                                                            {
                                                                (key.includes("picture") || key.includes("photo") || key.includes("image"))?
                                                                    <img src={item[key]} width="40px" height="40px" className="picture" alt="" />
                                                                :
                                                                    (key.includes("link"))? 
                                                                        <a href={item[key]} target="_blank" rel="noopener noreferrer" >Open Link </a>
                                                                    :
                                                                        (key.includes("Date") || key.includes("date"))? 
                                                                            this.formatDate(item[key])
                                                                        :
                                                                            (item[key] !== undefined)?
                                                                                (item[key] === true)? "True" :
                                                                                (item[key] === false)? "False":
                                                                                (item[key] === null)? "Null":

                                                                                <p title={item[key]}>
                                                                                    <TextLimit limit={30}>
                                                                                        {JContent.highlight(item[key], this.props.searchString)}
                                                                                    </TextLimit>
                                                                                </p>
                                                                            : ""
                                                            }
                                                        </td>
                                                    }
                                                    </React.Fragment>
                                                ))
                                            }
                                            {
                                                (this.props.onCustomButton !== undefined)?
                                                    <td>
                                                        <button onClick={this.customBtnClicked.bind(null,item)}>
                                                            {
                                                                (this.state.customButtonLabel === undefined || this.state.customButtonLabel === "")? "Custom Button": this.state.customButtonLabel
                                                            }
                                                        </button>
                                                    </td>
                                                :
                                                    null
                                            }
                                            {
                                                (this.props.onLink !== undefined)?
                                                    <td>
                                                        <Link onClick={this.linkClicked.bind(null,item)}>
                                                            {
                                                                (this.state.linkLabel === undefined || this.state.clinkLabel === "")? "Custom Button": this.state.linkLabel
                                                            }
                                                        </Link>
                                                    </td>
                                                :
                                                    null
                                            }
                                            {
                                                (this.state.actionColumn === true || this.state.actionColumn === undefined)?
                                                    <td>
                                                        <ImageField value="" tag="s" onChange={this.handleSelectChange.bind(null,item)}>
                                                            <option value="">Select</option>
                                                            {
                                                                (this.props.actionOptions !== undefined)?
                                                                    (this.props.AORT === ActionOptionRenderType.Function)?
                                                                        this.props.actionOptions(item).map((item, i) => (<option value={item.value || item.label} label={item.label} title={item.title} key={i} />))
                                                                    :
                                                                        this.props.actionOptions.map((item, i) => (<option value={item.value || item.label} label={item.label} title={item.title} key={i} />))
                                                                :
                                                                    null
                                                            }
                                                        </ImageField>
                                                    </td>
                                                :
                                                    null
                                            }
                                        </tr>
                                    ))
                                }
                                </ZeroContainer>
                            </tbody>
                        </table>
                    </div>
                    {
                        this.props.batchProcess? 
                        <div className="container btn-div content-left form-block">
                            <LabelField className="batch-process" label="Batch Process" tag="s" onChange={this.handleBatchSelect} name="batchSelect" value="">
                                <option value="">Select</option>
                                {
                                    (this.props.batchProcessOptions !== undefined)?
                                        this.props.batchProcessOptions.map((item, i) => (<option value={item.value || item.label} label={item.label} title={item.title} key={i} />))
                                    :
                                        null
                                }
                                {
                                    this.props.onBatchEdit !== undefined? <option value="edit">Edit</option>:null
                                }
                                {
                                    this.props.onBatchDelete !== undefined? <option value="delete">Delete</option>:null
                                }
                            </LabelField>
                        </div> : null
                    }
                    <div className="btn-div">
                        <div>
                        {
                            this.props.showNavigation !== false ?
                                <div className="nav">
                                    <div className="content-left">
                                        <span title="First page" className={(currentPage === 0)?"active jpc-disabled":""} onClick={this.firstPage}> First Page </span>
                                        {this.state.otherPages.length > 0 &&
                                        <>
                                            <span title="Prev page" onClick={this.prevPage} className={(currentPage === 0)? "jpc-disabled": ""}><GoChevronLeft /></span>
                                            { this.renderOtherPages() }
                                            <span title="Next Page" onClick={this.nextPage} className={isLastPage? "jpc-disabled" : ""}><GoChevronRight /></span>
                                            <span title="Last Page" className={isLastPage?"active jpc-disabled":""} onClick={this.lastPage} >Last Page</span>
                                        </>
                                        }
                                    </div>
                                    <div>
                                        { this.props.onUpdate !== undefined && this.props.inlineEdit !== undefined ? <span className="right active update-btn" onClick={this.handleTableDataUpdate} title="Synchronize updates">Sync Update</span> : null}
                                    </div>
                                </div> : null
                        }
                        </div>
                        <div className="container">
                            <div className="three-one">
                            {  
                                !this.state.loading && this.props.showNavigationText !== false ?
                                <div style={{lineHeight: "40px", marginTop: '20px'}}>
                                { this.state.dataList.length === 0? <span> No Data Present</span> :
                                    <span> Showing {showingFrom} to {( this.state.total < showingTo) ? this.state.total : showingTo} of {this.state.total} record{this.state.total > 1?"s":null}</span>
                                }
                                </div> : null
                            }
                            </div>
                            <div className="one-three">
                            {
                                this.props.showDPR !== false ?
                                    <div className="">
                                        <div className="content-right">
                                            <label>Display </label>
                                            <select className="display-select" name="displayPerRecord" value={this.state.dataPerPage} onChange={this.handleDisplaySelectChange}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                            </select>
                                            <label> records</label>
                                        </div>
                                    </div> : null
                            }
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
  }
}

export default TableView;

export const ActionOptionRenderType = {
    Function: "func",
    Array: "array"
}
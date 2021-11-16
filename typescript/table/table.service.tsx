import moment from "moment";
import { IObjectMap } from '../Interfaces';
import { DateFormat } from './table.config';

export const Services = {
    reorderKeys: (data: Array<IObjectMap>, reorderKeys: string []): Array<IObjectMap> => {
        if(!data[0]) return data;
        const keys = Object.keys(data[0]).filter(key => !reorderKeys.includes(key));
        let res: Array<IObjectMap> = [];
        keys.unshift(...reorderKeys);
        data.forEach(element => {
            let temp: IObjectMap = {};
            keys.forEach(key => {
                temp[key] = element[key];
            });
            res.push(temp);
        });
        return res;
    },
    /**
     * 
     * @param obj Object to build from.
     * @param replace find key and replace with value
     */
    buildTitle: (obj: IObjectMap, replace: IObjectMap, exclusions: string[]) => {
        let res = [];
        for (const key in obj) {
            if(!exclusions.includes(key)){
                if (Object.keys(replace).includes(key)) {
                    res.unshift(replace[key]);
                }
                else res.push(key);
            }
        }
        return res;
    },
    formatDate: (dateFormat: string | undefined, date: any) => {
        const res = moment(date).format(DateFormat || dateFormat || "ddMMyyyy");
        return res === "Invalid date"? date : res;
    },

    getThead: (data:any): Array<string> => {
        var thead = [];
        for (const key in data[0]) {
            thead.push(key);
        }
        return thead;
    },

    getKeys: (data: object) => {
        var dataKey = [];
        for (const key in data) {
            dataKey.push(key);
        }
        return dataKey;  
    },

    getRowClassName: (props: IObjectMap, state: IObjectMap, item: any) => {
        let res = "";
        if((state.rowsSelected[item.id] || props.checked) && props.rowSelection === true) res += " row-selected";
        if(props.restrictChange && props.restrictChange(item)) res += " no-pointer-event "
        return res;
    },

    getSelectedInArray: (props: IObjectMap, state: IObjectMap, merge: any) => {
        let res = [];
        let rowsSelected = state.rowsSelected;

        for (const key in rowsSelected) {
            if (rowsSelected[key]) {
                res.push(JArrayObject.find.getObject(state.dataList, parseInt(key), "id"));         
            }
        }
        let defaultValues: IObjectMap = {};
        if (props.checked) {
            state.dataList.forEach((item:any) => {
                props.checked && (defaultValues[item.id] = props.checked(item));
            });            
        }
        let unedited: IObjectMap = JObject.subtract(defaultValues, rowsSelected);
        for (const key in unedited) {
            if (unedited[key]) {
                res.push(JArrayObject.find.getObject(state.dataList, parseInt(key), "id"));                
            }
        }
        if (merge) {
            const key = Object.keys(merge)[0];
            if (merge[key]) {
                res.push(JArrayObject.find.getObject(state.dataList, parseInt(key), "id"));
            }
            else {
                res = res.filter((obj:any) => (obj.id !== parseInt(key)));
            }            
        }
        return res;
    }
}

export const JArray = {
    find: {
        getBoolean: function (data:any = [], value:any) {
            let res = false;
            let type = typeof value;
            if (value === "") {
                console.error("You cannot search empty value, kindly supply value to search.");
            }

            if (type === "number") {
                value = parseInt(value);
            }
            else if (type === "string") {
                value = value.toString();
            }
            else {
                console.error("You can only search for a number or word.");
            }

            data.forEach((element:any) => {
                if (element === value) {
                    return res = true;
                }
            });
            return res;
        },

        getIndex: function (data:any, value: any): number {
            let index:number = -1;
            let type = typeof value;
            if (value === "") {
                console.error("You cannot search empty value, kindly supply value to search.");
            }

            if (type === "number") {
                value = parseInt(value);
            }
            else if (type === "string") {
                value = value.toString();
            }
            else {
                console.error("You can only search for a number or word.");
            }

            data.forEach((element:any) => {
                if (element === value) {
                    return index = data.indexOf(element);
                }
            });

            return index;

        }
    }
}

export const JArrayObject = {
    paginate: (data: Array<IObjectMap>, offset: number, perPage: number): IObjectMap[] => {
        let res = [];
        let counter = 1;
        for (let i = offset; i < data.length; i++) {
            if(counter <= perPage) res.push(data[i]);
            counter++;
        }
        return res;
    },
    pageRequest: (data: IObjectMap[], page: number, size: number) => {
        const offset = page * size;
        let res = [];
        let counter = 1;
        for (let i = offset; i < data.length; i++) {
            if(counter <= size) res.push(data[i]);
            counter++;
        }
        return res;
    },
    getValues: (data: Array<IObjectMap>, key: string) => {
        let res:Array<any> = [];
        data.forEach(element => {
            res.push(element[key]);
        });
        return res;
    },

    getKeys: function (data: Array<any>) {
        var dataKey = [];
        for (const key in data[0]) {
            dataKey.push(key);
        }
        return dataKey;
    },

    customSort: function (property = "", order = "") {
        var sOrder = 1;
        if (order === "desc") {
            sOrder = -1;
        }

        return function (a:any, b:any) {
            if (a[property] < b[property]) {
                return -1 * sOrder;
            }
            else if (a[property] > b[property]) {
                return 1 * sOrder;
            }
            else return 0 * sOrder;
        }
    },

    find: {
        getTotal: (data: Array<IObjectMap>, searchKey: string, searchValue: string | number | boolean): number => {
            let res: number = 0;
            data.forEach(element => {
                if(element[searchKey] === searchValue) {
                    res += 1;
                }
            });
            return res;
        },
        /**
         * Search through the array by the specifiedKey
         * @param {Array} data 
         * @param {Any} value 
         * @param {String} specifiedKey 
         * @param {String} valueKey
         * Return the value of the search according to the valueKey
         */
        getObject: function (data:any, value:any, specifiedKey = "", stepKey = []) {
            const name = "ARRAY OBJECT FIND.GET-OBJECT \\";
            let res = {};
            let type = typeof value;

            if (value === "") {
                return res;
            }

            if (specifiedKey === "") {
                console.warn(name + "You cannot search empty value, kindly supply value to search.");
            }

            if (type === "number") {
                value = parseInt(value);
            }
            else if (type === "string") {
                value = value.toString();
            }
            else {
                console.error(name + "You can only search for a number or word.");
            }

            if (stepKey.length === 0) {
                data.forEach((element:any) => {
                    if (specifiedKey !== "") {
                        if (type === "string") {
                            if (JContent.equalsIgnoreCase(element[specifiedKey], value)) {
                                return res = element;
                            }
                        }
                        else {
                            if (element[specifiedKey] === value) {
                                return res = element;
                            }
                        }
                    }
                    else {
                        for (const k in element) {
                            if (type === "string") {
                                if (JContent.equalsIgnoreCase(element[k], value)) {
                                    return res = element;
                                }
                            } else {
                                if (element[k] === value) {
                                    return res = element;
                                }
                            }
                        }
                    }
                });
            } else if (stepKey.length === 1) {
                data.forEach((element:any) => {
                    const rows:any = element[stepKey[0]];
                    if (Array.isArray(rows)) {
                        rows.forEach(row => {
                            if (specifiedKey !== "") {
                                if (type === "string") {
                                    if (JContent.equalsIgnoreCase(row[specifiedKey], value)) {
                                        return res = row;
                                    }
                                }
                                else {
                                    if (row[specifiedKey] === value) {
                                        return res = row;
                                    }
                                }
                            }
                            else {
                                for (const k in row) {
                                    if (type === "string") {
                                        if (JContent.equalsIgnoreCase(row[k], value)) {
                                            return res = row;
                                        }
                                    } else {
                                        if (row[k] === value) {
                                            return res = row;
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        if (specifiedKey !== "") {
                            if (type === "string") {
                                if (JContent.equalsIgnoreCase(rows[specifiedKey], value)) {
                                    return res = rows;
                                }
                            }
                            else {
                                if (rows[specifiedKey] === value) {
                                    return res = rows;
                                }
                            }
                        }
                        else {
                            for (const k in rows) {
                                if (type === "string") {
                                    if (JContent.equalsIgnoreCase(rows[k], value)) {
                                        return res = rows;
                                    }
                                } else {
                                    if (rows[k] === value) {
                                        return res = rows;
                                    }
                                }
                            }
                        }
                    }
                });

            }
            return res;
        },
    }
}

export const JContent = {
    equalsIgnoreCase: function (string1 = "", string2 = "") {
        string1 = string1.toLowerCase();
        string2 = string2.toLowerCase();
        if (string1 === string2) {
            return true;
        }
        return false
    },

}

export const JObject = {
    subtract: function (arg1:any = {}, arg2 = {}) {
        let res:any = {}, keys = Object.keys(arg2);
        for (const k in arg1) {
            if (!keys.includes(k)) {
                res[k] = arg1[k];
            }
        }
        return res;
    },
}

export const ActionOptionRenderType = {
    Function: "func",
    Array: "array"
}
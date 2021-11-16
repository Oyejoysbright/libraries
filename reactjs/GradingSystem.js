import React, { Component } from 'react'
import { JArray, JArrayObject } from '../utils/Jpc'
import { alert, confirm } from './dialog/Dialog'
import { ButtonIcons, removeConfirmMsg, Settings, ValidateField } from '../../services/Constant'
import ButtonLoader from './ButtonLoader';

export class GradingSystem extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            ranges: ["range1"], rangeBin: [], watcher: [], data: []
        }
        this.maxTime = 20000;
        this.baseState = this.state;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== prevState.data) {
            this.demolishArrayToRanges(prevProps.data);
        }
    }
    

    range = (item, index) => {
        const fromVal = this.state[item+"from"] !== undefined? this.state[item+"from"]  : 0;
        const toVal = this.state[item+"to"] !== undefined? this.state[item+"to"] : 0;
        const letterGradeVal = this.state[item+"letterGrade"] !== undefined ? this.state[item+"letterGrade"]  : "";
        const gradePointVal = this.state[item+"gradePoint"] !== undefined? this.state[item+"gradePoint"] : 0.0;
        const gradeRemarkVal = this.state[item+"gradeRemark"] !== undefined? this.state[item+"gradeRemark"] : "";

        return(
            <tr key={index}>
                <td>{index+1}</td>
                <td><input name={item+"from"} data-type="score" value={fromVal} onBlur={this.handleBlur} onChange={this.handleChange} /></td>
                <td><input name={item+"to"} data-type="score" value={toVal} onBlur={this.handleBlur} onChange={this.handleChange} /></td>
                <td><input name={item+"letterGrade"} data-type="letter-grade" value={letterGradeVal} onChange={this.handleChange} /></td>
                <td><input name={item+"gradePoint"} data-type="grade-point" value={gradePointVal} onChange={this.handleChange} /></td>
                <td><input name={item+"gradeRemark"} data-type="letter-grade" value={gradeRemarkVal} onChange={this.handleChange} /></td>
            </tr>
        )
    }

    demolishArrayToRanges = (data) => {
        let ranges = [];
        let state = {};

        data.forEach(element => {
            const name = "ranges"+element.id;
            ranges.push(name);
            for (const key in element) {
                if (key === "fromVal") {
                    state[name+"from"] = element[key];
                }
                else if (key === "toVal") {
                    state[name+"to"] = element[key];
                }
                else {
                    state[name+key] = element[key];
                }
            }
        });

        if (this.state.ranges !== ranges) {
            this.setState(prev => {
                return {...prev, ranges: ranges, ...state, data: data};
            });            
        }
    }

    buildRangesInArray = () => {
        let res = [];
        this.state.ranges.forEach(key => {
            if (!this.state.rangeBin.includes(key)) {
                res.push({
                    id: this.state[key+"id"] || 0,
                    fromVal: this.state[key+"from"],
                    toVal: this.state[key+"to"],
                    letterGrade: this.state[key+"letterGrade"],
                    gradePoint: this.state[key+"gradePoint"],
                    gradeRemark: this.state[key+"gradeRemark"]
                });
            };
        });
        return res;
    }

    handleBlur = ({target: {value, className}}) => {
        this.buildRangesInArray().forEach(element => {
            //Check if value falls in range
            if (value >= parseInt(element.fromVal) && value <= parseInt(element.toVal)) {
                //consider input onBlur
                //alert("Range already exist");
                className += " required";
                
                setTimeout(() => {
                    className -= " required";
                }, this.maxTime);
            }
        });
    }

    handleChange = (e) => {
        const name = e.target.name, value = ValidateField(e);
        this.setState({[name]: value});
        const minTime = 3000;

        if (name.includes("from") || name.includes("to")) {
            //Validate range
            let item = "";
            if (name.includes("from")) {
                item = name.substring(0, name.length-4);

                if (this.state[item+"to"] !== undefined && parseInt(this.state[item+"to"]) <= value ) {
                    // alert("TO value cannot be lesser than FROM value");
                    e.target.className += " required";
                    
                    setTimeout(() => {
                        e.target.className -= " required";
                        // e.target.value = 0;
                    }, minTime);
                }
            } else {
                item = name.substring(0, name.length-2);   
                
                if (this.state[item+"from"] !== undefined && parseInt(this.state[item+"from"]) >= value ) {
                    // alert("FROM value cannot be greater than TO value");
                    e.target.className += " required";
                    
                    setTimeout(() => {
                        e.target.className -= " required";
                        // e.target.value = 0;
                    }, minTime);
                }             
            }
            
        }
        else if(name.includes("letterGrade")) {
            //Check if exist
            if (JArrayObject.getDistinctKeyValues(this.buildRangesInArray(), "letterGrade").includes(value)) {
                alert("Letter grade already exist");
                e.target.className += " required";
                
                setTimeout(() => {
                    e.target.className -= " required";
                }, this.maxTime);
            }
        }
        else if(name.includes("gradeRemark")) {
            //Check if exist
            if (JArrayObject.getDistinctKeyValues(this.buildRangesInArray(), "gradeRemark").includes(value)) {
                alert("Grade Remark already exist");
                e.target.className += " required";
                
                setTimeout(() => {
                    e.target.className -= " required";
                }, this.maxTime);
            }
        }
        else if(name.includes("gradePoint")) {
            //Check if exist
            if (JArrayObject.getDistinctKeyValues(this.buildRangesInArray(), "gradePoint").includes(value)) {
                alert("Grade point already exist");
                e.target.className += " required";
                
                setTimeout(() => {
                    e.target.className -= " required";
                }, this.maxTime);
            }
        }
    }

    handleAdd = () => {
        if (JArrayObject.validate(this.buildRangesInArray(), alert)) {
            this.setState(state => {
                const count = state.ranges.length+1
                const item = "range"+count;
                return {...state, ranges: state.ranges.concat(item)}
            });
        }
    }

    handleRemove = (item) => {
        confirm(removeConfirmMsg, () => {
            this.setState(state => { return {...state, rangeBin: state.rangeBin.concat(item)}})
        });
    }

    handleReset = () => {
        this.setState(this.baseState);
    }
    
    render() {
        return (
            <div className="jpc">
                <form className="form-block" onSubmit={(e) => {e.preventDefault(); this.props.onSubmit(this.buildRangesInArray(), e)}}>
                    <table>
                        <thead>
                            <tr>
                                <th rowSpan={2}>SN</th>
                                <th colSpan={2}>Marks / Score (%)</th>
                                <th rowSpan={2}>Letter Grade</th>
                                <th rowSpan={2}>Grade Point</th>
                                <th rowSpan={2}>Grade Remark</th>
                            </tr>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {JArray.subtract(this.state.ranges, this.state.rangeBin).map((item, index) => (this.range(item, index)))}
                        </tbody>
                    </table>
                    <div className="content-right w-100">
                        <span className="btn-like" onClick={this.handleAdd}>+ Add Range</span>
                    </div>
                    <ButtonLoader className="main-button" src={ButtonIcons.save} > Save </ButtonLoader>
                    <ButtonLoader className="optional-button" type="reset" src={ButtonIcons.reset} > {Settings().optionalButtonText} </ButtonLoader>
                </form>
            </div>
        )
    }
}

export default GradingSystem

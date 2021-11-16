import React, { useState } from 'react'
import SimpleTaskView from './SimpleTaskView';
import { UIWindow } from './Views'

function CourseAllocationView({ data = [] }) {

    const [state, setState] = useState({});

    const lecturer = (data = []) => {
        return (
            <div>
                {
                    data.map((obj, index) => (
                        <div className="cards jpc-course-lecturer-view" key={index}>
                            <div>Name: {obj.staffName || obj.name}</div>
                            <div>ID: {obj.staffId || obj.id}</div>
                        </div>
                    ))
                }
            </div>
        )
    }

    // onMouseOver={showToolTip.bind(null, lecturer(item.lecturers))}


    const course = (item) => {
        return (
            <React.Fragment  key={item.id}>
                <UIWindow style={{position: 'absolute', top: '50px'}} onShow={state["window"+item.id] || false} onClosed={() => setState({...state, ["window"+item.id]: false})} title={"Lecturers Taking " + item.name} >
                    <table>
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Name</th>
                                <th>Staff ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                item.lecturers.map((staff, index) => (<tr key={staff.id}>
                                    <td>{index+1}</td>
                                    <td>{staff.staffName}</td>
                                    <td>{staff.staffId}</td>
                                </tr>))
                            }
                        </tbody>
                    </table>
                </UIWindow>
                <SimpleTaskView onClick={() => setState({...state, ["window"+item.id]: true})} title="Click to view lecturers taking this course" headLabel={item.name} startLabel="Code :" startValue={item.courseCode}  endLabel="Unit: " endValue={item.unit}  />
                <div className="cards time-slot" title="Click to view lecturers taking this course" onClick={() => setState({...state, ["window"+item.id]: true})}>
                    <div className="head">{item.name}</div>
                    <div className="start"><span className="label">Code:</span> <span className="value">{item.courseCode}</span></div>
                    <div className="end"><span className="label">Unit:</span> <span className="value">{item.unit}</span></div>
                </div>
            </React.Fragment>
        )
    }

    return (
        <div className="joysbright jpc ">
            <div className="timetable-view">
                {
                    data.map(obj => (course(obj)))
                }
            </div>
        </div>
    )
}

export default CourseAllocationView

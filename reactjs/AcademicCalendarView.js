import React from 'react'
import { SchoolInfo } from '../../services/Constant'

function AcademicCalendarView({data}) {
    const headerPrefix = data.sharing === "No"? "PROPOSED" : "";
    return (
        <div className="jpc">
            <div className="content-center">
                <h1> {(SchoolInfo().name).toUpperCase()}</h1>
                <h3><u>{`${headerPrefix} ACADEMIC CALENDAR For THE ${data.semester} SEMESTER ${data.session} ACADEMIC SESSION`.toUpperCase()}</u></h3>
            </div>
                <table>
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>ACTIVITIES/EVENTS</th>
                            <th>DESCRIPTION</th>
                            <th>START DATE</th>
                            <th>END DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.activities.map((activity, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{activity.name}</td>
                                    <td>{activity.description}</td>
                                    <td>{activity.start}</td>
                                    <td>{activity.end}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
        </div>
    )
}

export default AcademicCalendarView

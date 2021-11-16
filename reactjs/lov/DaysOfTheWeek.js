import React from 'react'

function DaysOfTheWeek({name, value, onChange}) {

    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    }

    return (
        <select name={name} value={value} onChange={handleChange}>
            <option value="">Select</option>
            {
                data.map((d, i) => (<option key={i} label={d} value={d} />))
            }
        </select>
    )
}

export default DaysOfTheWeek
export const data = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]
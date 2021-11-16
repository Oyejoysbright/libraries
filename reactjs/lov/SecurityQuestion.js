import React from 'react'

function SecurityQuestion({name, value, onChange, className, filter = [], readOnly}) {
    return (
        <select name={name} value={value} onChange={onChange} className={readOnly? className + " jpc-disabled" : className }>
            <option value="" label="Select" />
            {
                SECURITY_QUESTIONS.filter(question => !filter.includes(question)).map((question, index) => (<option key={index}>{question}</option>))
            }
        </select>
    )
}

export default SecurityQuestion

export const SECURITY_QUESTIONS = [
    "In what city were you born?",
    "What is the name of your favorite pet?",
    "What is your mother's maiden name",
    "What was the make of your dream car",
    "What is the name of your first school?",
    "What was your favorite food as a child?",
    "Where did you meet your spouse?",
    "What was your childhood nickname?",
    "What was your childhood phone number including area code?",
    "What is your oldest cousin's first and last name?",
    "What was the name of your first stuffed animal?",
    "In what city or town did your mother and father meet?",
    "Where were you when you had your first kiss?",
    "In what city does your nearest sibling lives?",
    "What is your maternal grandmother's maiden name?",
    "In what city or town was your first job?",
    "What is the name of a college you applied to but didn't attend?",
    "Where were you when you first heard about 9/11?",
    "What was your favorite place to visit as a child?",
    "What is your spouse's mother's maiden name?",
    "What is the country of your ultimate dream vacation?",
    "What is the name of favorite childhood teacher?",
    "What time of the day were you born?",
    "What was your dream job as a child?",
    "Who was your childhood hero?",
    "What was the first concert you attended?",
    "What is the last name of your favorite high school teacher?",
    "What is the name of your grandmother's pet?",
    "What was your high school mascot?",
    "What is the name of the first school you attended?",
    "What sports team do you love to see lose?"
]
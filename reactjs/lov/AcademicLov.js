export const schoolOwnerships = [
    "Missionary", "Catholic", "Government", "Community Ownership", "Privately Owned"
];

export const schoolCategories = [
    "Private", "Public"
];

export const schoolEducationLevels = [
    "Senior Secondary School", "Junior Secondary School", "Junior and Senior School", "Technical College"
];

export const schoolTypes = [
    "Boys Only", "Girls Only", "Co-Educational"
];

const subjects = ["Economics", "Agricultural", "French", "Commerce", "Government", "History", "CRK/CRS", "Literature in English",
    "Chemistry", "Physics", "Geography", "Biology", "Further Mathematics", "Technical Drawing", "Civic Education", "ARABIC"];
export const oLevelSubjects = [
    "English Language", "Mathematics", ...subjects.sort()
];

export const OLevelGrades = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

export const OLevelFullGrades = [
    {
        grade: "A1", value: 8, interpretation: "credit"
    },
    {
        grade: "B2", value: 7, interpretation: "credit"
    },
    {
        grade: "B3", value: 6, interpretation: "credit"
    },
    {
        grade: "C4", value: 5, interpretation: "credit"
    },
    {
        grade: "C5", value: 4, interpretation: "credit"
    },
    {
        grade: "C6", value: 3, interpretation: "credit"
    },
    {
        grade: "D7", value: 2, interpretation: "pass"
    },
    {
        grade: "E8", value: 1, interpretation: "pass"
    },
    {
        grade: "F9", value: 0, interpretation: "pass"
    },
]

export const ResultType = ["Ordinary National Diploma", "Higher National Diploma", "Bachelor's Degree", "Master's Degree", "Doctor of Philosophy"];
export const PolytechnicGrades = ["Fail", "Pass", "Lower Credit", "Upper Credit", "Distinction"];
export const UniversityGrades = ["Fail", "Pass", "Third Class", "Second Class (Lower Division)", "Second Class (Upper Division)", "First Class"];
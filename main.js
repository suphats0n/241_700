let students = [
    {
        name: "John",
        score: 25,
        grade: 'A'
    },
    {
        name: "Jane",
        score: 75,
        grade: 'B'
    },
    {
        name: "Jim",
        score: 60,
        grade: 'C'
    }
    
]
let student = students.find((s) => {
    if(s.name == "Jane") {
        return true;
    }
})

console.log(student[1]);
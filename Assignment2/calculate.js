/* Read an uploaded .csv file containing rows of student names and grades. A file 
handler should parse the file’s data into an appropriate JavaScript structure. 
<input id="file-input" type="file" onload="init()">  Each time the user changes 
the lower bounds of any letter grade, the Histogram should dynamically adjust 
itself to represent the number of students in each range. You can use table 
cells, div box widths, images, etc. You may not use any external libraries. */

/* If there is an invalid input of any kind, i.e. bounds of letter grades 
overlap or a string is entered as input, then your program should deal with it 
accordingly. */


document.getElementById('file-input').addEventListener('change', handleFileSelect, false);



function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event) {
    const students = parseCSVData(event.target.result);
    fileUploaded = true;
    document.getElementById('update-button').addEventListener('click', function() {renderHistogram(students);});
    renderHistogram(students);
}

function parseCSVData(contents) {
    const students = [];
    const lines = contents.split('\n');

    for (let i = 1; i < lines.length; i++) {
        const [name, grade] = lines[i].split(',').map(str => str.trim());
        if (name && grade) {
            students.push({ name, grade: Number(grade) });
        }
    }

    return students;
}


function renderHistogram(students) {
    let bounds = getLowerBoundsValues();
    
    // Print histogram
    let H_print = document.querySelectorAll('.histogramResults');
    
    // Output if error
    const errorMessage = document.getElementById('error-message');
    if(!bounds){
        for(let i = 0; i < H_print.length; i++){H_print[i].style.width = '0%';}
        errorMessage.style.display = 'block';
        errorMessage.textContent = '* Range error occured.'
        return;
    }
    errorMessage.style.display = 'none';
        
    
    // Find the maximum number of students in a single range
    let maxStudentsInRange = 0;
    for(let i = 0; i < H_print.length; i++){
        const numStudentsInRange = students.filter(student => bounds[i] > student.grade && student.grade >= bounds[i+1]).length;
        if (numStudentsInRange > maxStudentsInRange) {
            maxStudentsInRange = numStudentsInRange;
        }
    }
    
    // Output on success
    for(let i = 0; i < H_print.length; i++){
        const numStudentsInRange = students.filter(student => bounds[i] > student.grade && student.grade >= bounds[i+1]).length;
        const percentage = (numStudentsInRange / maxStudentsInRange) * 100;
        H_print[i].style.width = percentage + '%';
    }

    // Calculate statistics
    const stats = calculateStatistics(students);
    document.getElementById('high').textContent = stats.highName +' ('+ stats.high + ')%';
    document.getElementById('low').textContent = stats.lowName +' ('+ stats.low + ')%';
    document.getElementById('mean').textContent = stats.mean.toFixed(2) + '%';
    document.getElementById('median').textContent = stats.median.toFixed(2) + '%';
}


function calculateStatistics(students) {
    // Find the highest and lowest grades
    let highestGrade = -Infinity;
    let lowestGrade = Infinity;
    students.forEach(student => {
        if (student.grade > highestGrade) {
            highestGrade = student.grade;
            highestGradeStudent = student.name;
        }
        if (student.grade < lowestGrade) {
            lowestGrade = student.grade;
            lowestGradeStudent = student.name;
        }
    });

    // Find the mean grade
    let sum = 0;
    students.forEach(student => {
        sum += student.grade;
    });
    const meanGrade = sum / students.length;

    // Find the median grade
    const sortedGrades = students.map(student => student.grade).sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedGrades.length / 2);
    const medianGrade = sortedGrades.length % 2 === 0
        ? (sortedGrades[middleIndex - 1] + sortedGrades[middleIndex]) / 2
        : sortedGrades[middleIndex];

    return {
        high: highestGrade,
        highName: highestGradeStudent,
        low: lowestGrade,
        lowName: lowestGradeStudent,
        mean: meanGrade,
        median: medianGrade,
    };
}


function getLowerBoundsValues() {
    const boundsValues = ['100.0'];
    
    // Get all the input elements within lower bounds
    const inputs = document.getElementById('lower-bounds').querySelectorAll('input[type="number"]');

    // Iterate through the inputs and get their values
    inputs.forEach(input => {
        if(input.value == ""){boundsValues.push(input.placeholder);}
        else{boundsValues.push(input.value);}
        // Unhighlight error
        input.style.color = 'black';
        input.style.border = 'none';
    });

    

    // Return null if the lower bounds input is invalid
    const maxBound = document.getElementById('max-bound');
    let rangeError = false;
    for(let i = 1; i < boundsValues.length; i++){
        // Highlight error
        if(Number(boundsValues[i]) == NaN){
            inputs[i-1].style.color = '#CC0633';
            inputs[i-1].style.border = '3px solid #CC0633';
            rangeError = true;
        }
        if(Number(boundsValues[i-1]) < Number(boundsValues[i])){
            if(i-2 >= 0){
                inputs[i-2].style.color = '#CC0633';
                inputs[i-2].style.border = '3px solid #CC0633';
            } else {
                maxBound.style.color = '#CC0633';
                maxBound.style.border = '3px solid #CC0633';
            }
            rangeError = true;
        }
    }

    if(rangeError){return null;}
    return boundsValues;
}

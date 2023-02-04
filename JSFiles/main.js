(function() {
    let toDay = new Date();
    
    function formToAdd() {
        let form = document.querySelector('#form');
        let SNInput = document.querySelector('#inputSN');   // surname
        let FNInput = document.querySelector('#inputFN');   // firstname
        let PTInput = document.querySelector('#inputPT');   // patronymic
        let BDInput = document.querySelector('#inputBD');   // birthdate
        let SDInput = document.querySelector('#inputSD');   // get started studing date
        SDInput.min = 2000;
        SDInput.max= toDay.getFullYear();
        BDInput.min = '1900-01-01';
        BDInput.max = `${toDay.getFullYear()}-0${toDay.getMonth() + 1}-${toDay.getDate()}`
        let FacInput = document.querySelector('#inputFac');  // faculty

        let formBtn = document.querySelector('#form_btn'); 
        let openFormBtn = document.querySelector('#openFormBtn');


        openFormBtn.addEventListener('click', () => {
            form.classList.toggle('form_disactive');
            form.classList.toggle('form_active');

            if(openFormBtn.textContent === 'Добавить студента') {
                openFormBtn.textContent = 'Скрыть';
            } else {
                openFormBtn.textContent = 'Добавить студента'
            }

        })

        return {
            SNInput,
            FNInput,
            PTInput,
            BDInput,
            SDInput,
            FacInput,
            formBtn,
            form
        }
    };

    function deleteRows() {
        let tableRow = document.querySelectorAll('tr');
        tableRow.forEach(tR => {
            if(tR.classList.contains('table_firstRow') == false) {
                tR.remove()
            }
            })
    }



    function addStudentToTable(obj) {
        let tableBase = document.querySelector('.table_base');
        
            let newRow = document.createElement('tr');
            newRow.classList.add('table_row');
            
            let iTd = 0;

            let result = Object.keys(obj).length > 6? Object.keys(obj).length - 3 : Object.keys(obj).length;

            while(iTd < result) {
                
                let newData = document.createElement('td');
                
                newData.classList.add('table_data')
                if(Object.keys(obj)[iTd] === "birthday") {
                    let nowDate = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate());
                    let birthDay = new Date(Object.values(obj)[iTd]);
                    let BDNow = new Date(nowDate.getFullYear(), birthDay.getMonth(), birthDay.getDate());
                    let age;
                    
                    age = toDay.getFullYear() - birthDay.getFullYear();
                    if(nowDate < BDNow) {
                        age-=1;
                    }
                    newData.append(`${birthDay.getDate()}.${birthDay.getMonth() + 1}.${birthDay.getFullYear()}  (${age} лет)`);
                }
                
                if(Object.keys(obj)[iTd] === "studyStart") {
                    let course = toDay.getFullYear() - Object.values(obj)[iTd];
                    if (toDay.getMonth() > 8) {
                        course-=1;
                    }
                    if(course > 4) {
                        newData.append(`${Object.values(obj)[iTd]} - ${parseInt(Object.values(obj)[iTd]) + 4} (Выпустился в ${parseInt(Object.values(obj)[iTd]) + 4})`);
                    } else {
                        newData.append(`${Object.values(obj)[iTd]} - ${parseInt(Object.values(obj)[iTd]) + 4} (${course} курс)`);
                    }
                } 
                
                if (Object.keys(obj)[iTd] != "studyStart" && Object.keys(obj)[iTd] != "birthday") {
                    newData.append(Object.values(obj)[iTd]);
                }
                newRow.append(newData);
                iTd++;

            }
            
            let buttonDel = document.createElement('button');
            let dataDel = document.createElement('td');
            dataDel.classList.add('table_data');
            buttonDel.textContent = 'Удалить';
            buttonDel.classList.add('delBtn');

            
            dataDel.append(buttonDel);
            newRow.append(dataDel);
            tableBase.append(newRow);

            const delobj = obj => {
                    fetch(`http://localhost:3000/api/students/${obj.id}`, {
                        method: 'DELETE',
                    })
            }

            buttonDel.addEventListener('click', () => {
                newRow.remove();
                delobj(obj);
            })
 
    }
    
    function extractObjFromDBArryAndAddtoBase(arry) {
        arry.forEach(student => {
            addStudentToTable(student);
         })
    }

    function sortArray(arry) {
        let tableHeadData = document.querySelectorAll('.table_firstData');

            tableHeadData.forEach(sB => {
                sB.addEventListener('click', (e) => {
                    switch(e.target.id) {
                        case 'SN':
                        arry = arry.sort((x,y)=> x.name.localeCompare(y.name));
                        break;
                        
                        case 'FN':
                        arry = arry.sort((x,y)=> x.surname.localeCompare(y.surname));
                        break;

                        case 'PT':
                        arry = arry.sort((x,y)=> x.lastname.localeCompare(y.lastname));
                        break;

                        case 'BD':
                        arry = arry.sort((x,y)=> new Date(x.birthday) - new Date(y.birthday));
                        break;

                        case 'SD':
                        arry = arry.sort((x,y)=> x.studyStart - y.studyStart);
                        break;
                        
                        case 'Fac':
                        arry = arry.sort((x,y)=> x.faculty.localeCompare(y.faculty));
                        break;
                    }
                    deleteRows();
                    extractObjFromDBArryAndAddtoBase(arry);
                })
            })
    }

    function filterArry(arry) {
        let inputFilter = document.querySelectorAll('.filter_input');

        let filterBtn = document.querySelector('.filter_btn');
        let filterBlock = document.querySelector('.filter-block');

        filterBtn.addEventListener('click', function() {
            filterBlock.classList.toggle('form_disactive');
            filterBlock.classList.toggle('form_active');
        })

        inputFilter.forEach(inFil => {
            inFil.addEventListener('input', q => {
                switch(q.target.id) {
                    case 'snFilter':
                        let filterArr = arry.filter(el => {
                            return el.name.includes(q.target.value)
                        })
                        deleteRows()
                        extractObjFromDBArryAndAddtoBase(filterArr);
                        break;

                    case 'fnFilter':
                        let filterArr2 = arry.filter(el => {
                            return el.surname.includes(q.target.value)
                        })
                        deleteRows()
                        extractObjFromDBArryAndAddtoBase(filterArr2);
                        break;

                    case 'ptFilter':
                        let filterArr3 = arry.filter(el => {
                            return el.lastname.includes(q.target.value)
                        })
                        deleteRows()
                        extractObjFromDBArryAndAddtoBase(filterArr3);
                        break;

                    case 'bdFilter':
                        let filterArr4 = arry.filter(el => {
                            return el.birthday.includes(q.target.value)
                        })
                        deleteRows()
                        extractObjFromDBArryAndAddtoBase(filterArr4);
                        break;

                    case 'sdFilter':
                        let filterArr5 = arry.filter(el => {
                            return el.studyStart.includes(q.target.value)
                        })
                        deleteRows()
                        extractObjFromDBArryAndAddtoBase(filterArr5);
                        break;

                    case 'facFilter':
                        let filterArr6 = arry.filter(el => {
                            return el.faculty.includes(q.target.value)
                        })
                        deleteRows()
                        extractObjFromDBArryAndAddtoBase(filterArr6);
                        break;
                }
            })
        })
    }

    function createBase() {
        
        (async() =>{
            const studentsArrayOfDB = await fetch('http://localhost:3000/api/students');
            const ds = await studentsArrayOfDB.json();
            filterArry(ds);
            sortArray(ds);
            extractObjFromDBArryAndAddtoBase(ds);
        }) ();
        
        
        let formToAddStudent = formToAdd();
        formToAddStudent.form.addEventListener('submit', (page) => {

            page.preventDefault();

            const student = {
                name: formToAddStudent.SNInput.value,
                surname: formToAddStudent.FNInput.value,
                lastname: formToAddStudent.PTInput.value,
                birthday: formToAddStudent.BDInput.value,
                studyStart: formToAddStudent.SDInput.value,
                faculty: formToAddStudent.FacInput.value,
            }
            addStudentToTable(student);
            formToAddStudent.form.reset();

            (async () => {
            const loadData = await fetch('http://localhost:3000/api/students', {
                method: 'POST',
                body: JSON.stringify(student),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            // const fd = await loadData.json();
        }) ();
            
        })
    }


    window.createStudentBase = createBase;
}) ();


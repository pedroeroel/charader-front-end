let data = undefined;
const userAnswer = document.querySelector("#userAnswer");
const resultElement = document.querySelector("#resultElement");
let edit = false;
const url = `https://charader-senai.vercel.app/api/charades`;
const listURL = `https://charader-senai.vercel.app/api/charades/list`;

let creationForm = document.querySelector('#create-form');
let inputCharadeCreation = document.querySelector('#create-charade-input')
let inputAnswerCreation = document.querySelector('#create-answer-input');

let updateForm = document.querySelector('#update-form');
let inputUpdateID = document.querySelector('#update-id');
let inputCharadeUpdate = document.querySelector('#update-charade-input');
let inputAnswerUpdate = document.querySelector('#update-answer-input');
let loadingElement = document.querySelector('#loading-element');

let charadeListElement = document.querySelector('#charade-list');

async function getCharadeList() {
    try {
        let response = await fetch(listURL);

        if (!response) {
            throw new Error(`API ERROR: ${response.status}, ${response.statusText}`);
        }

        data = await response.json();

        loadingElement.style.transition = 'color ease-in-out 200ms';
        loadingElement.style.color = 'black';
        setTimeout(() => {
            loadingElement.style.color = "transparent";
        }, 500);

    } catch (e) {
        console.error(`ERROR: ${e}`);
        charadeListElement.style.color = 'red';
        charadeListElement.innerHTML = `<p>Error at loading charades: ${e.message}</p>`;
    } finally {
        return data
    }
}

async function newCharade(event) {
    event.preventDefault();
    console.log("Trying to create a new charade...");

    const question = inputCharadeCreation.value;
    const answerToCharade = inputAnswerCreation.value;

    if (!question || !answerToCharade) {
        alert("Please fill in both the question and the answer.");
        return;
    }

    const newCharade = {
        charade: question,
        answer: answerToCharade
    };

    try {
        const responseHttp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCharade)
        });

        const apiResult = await responseHttp.json();

        if (!responseHttp.ok) {
            throw new Error(apiResult.message || `Error creating charade: ${responseHttp.status}`);
        }

        console.log("Charade created successfully!", apiResult);
        alert(apiResult.message);

        inputCharadeCreation.value = '';
        inputAnswerCreation.value = '';

        await showCharades();

    } catch (error) {
        console.error("Failed to create charade:", error);
        alert(`Error creating charade: ${error.message}`);
    }
}

function showCharades(charades) {
    console.log("Updating the charade list on the screen...");
    charadeListElement.innerHTML = '';
    if (!charades || charades.length === 0) {
        charadeListElement.style.color = 'black';
        charadeListElement.innerHTML = '<p>No charades registered yet.</p>';
        return;
    }
    for (const charade of charades) {
        const charadeElementDiv = document.createElement('div');
        charadeElementDiv.classList.add('border', 'border-gray-300', 'p-2', 'mb-3', 'rounded', 'flex', 'justify-between', 'items-center');
        charadeElementDiv.id = `charade-${charade.id}`;
        charadeElementDiv.innerHTML = `
            <div class="flex-grow mr-3">
                <strong class="charade-question">${charade.charade}</strong>
                <p><small class="charade-answer">Answer: ${charade.answer || 'Not defined'}</small></p>
                <p><small>ID: ${charade.id}</small></p>
            </div>
            <div>
                <button class="edit-btn bg-yellow-400 transition duration-200 hover:bg-yellow-500 text-black font-bold py-1 px-2 rounded text-sm ml-1">Edit</button>
                <button class="delete-btn bg-red-500 transition duration-200 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm ml-1">Delete</button>
            </div>
        `;
        const editButton = charadeElementDiv.querySelector('.edit-btn');
        editButton.addEventListener('click', function() {
            console.log(`Edit button clicked for charade ID: ${charade.id}`);

            inputUpdateID.value = charade.id;
            inputCharadeUpdate.value = charade.charade;
            inputAnswerUpdate.value = charade.answer;
            updateForm.style.display = 'block';
            creationForm.style.display = 'none';
            edit = true
        });

        const deleteButton = charadeElementDiv.querySelector('.delete-btn');
        deleteButton.addEventListener('click', async function() {
            console.log(`Delete button clicked for charade ID: ${charade.id}`);
            const confirmDelete = confirm(`Are you sure you want to delete charade ID ${charade.id}?`);
            if (confirmDelete) {
                try {
                    const deleteUrl = `${url}/${charade.id}`;
                    const response = await fetch(deleteUrl, {
                        method: 'DELETE',
                    });
                    const result = await response.json();
                    if (response.ok) {
                        console.log('Charade deleted successfully:', result);
                        alert(result.message);
                        await getCharadeList()
                        showCharades(data);
                    } else {
                        console.error('Error deleting charade:', result);
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Failed to delete charade:', error);
                    alert(`Failed to delete charade: ${error.message}`);
                }
            }
        });
        charadeListElement.appendChild(charadeElementDiv);
    }
}

updateForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (edit) {
        const updateId = inputUpdateID.value;
        const updatedQuestion = inputCharadeUpdate.value;
        const updatedAnswer = inputAnswerUpdate.value;

        if (!updatedQuestion || !updatedAnswer) {
            alert("Please fill in both the question and the answer for the update.");
            return;
        }

        const updatedCharade = {
            charade: updatedQuestion,
            answer: updatedAnswer
        };

        try {
            const updateUrl = `${url}/${updateId}`;
            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCharade)
            });

            const apiResult = await response.json();

            if (!response.ok) {
                throw new Error(apiResult.message || `Error updating charade: ${response.status}`);
            }

            console.log("Charade updated successfully!", apiResult);
            alert(apiResult.message);

            updateForm.style.display = 'none';
            creationForm.style.display = 'block';
            inputUpdateID.value = '';
            inputCharadeUpdate.value = '';
            inputAnswerUpdate.value = '';
            edit = false;

            await getCharadeList();
            showCharades(data);

        } catch (error) {
            console.error("Failed to update charade:", error);
            alert(`Error updating charade: ${error.message}`);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM was fully loaded.');
    getCharadeList();
    setTimeout(() => {
        showCharades(data);
    }, 1500);
});

creationForm.addEventListener('submit', newCharade);
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM was fully loaded.');
    getCharadeList();
    setTimeout(() => {
        showCharades(data)
    }, 1500);
});

async function newCharadeList(dict) {
    console.log("Trying to create a new charade list...");

    let num = 0

    for (const charade of dict) {

        num += 1

        const question = charade.charade;
        const answerToCharade = charade.answer;
        
        if (!question || !answerToCharade) {
            alert("Please fill in both the question and the answer.");
            return;
        }
        
        const newCharade = {
            charade: question,
            answer: answerToCharade
        };
        
        try {
            const responseHttp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCharade)
            });
            
            const apiResult = await responseHttp.json();
            
            if (!responseHttp.ok) {
                throw new Error(apiResult.message || `Error creating charade: ${responseHttp.status}`);
            }
            
            console.log(`Charade ${num} created successfully!`, apiResult);
            
            inputCharadeCreation.value = '';
            inputAnswerCreation.value = '';
            
            await showCharades();
            
        } catch (error) {
            console.error("Failed to create charade:", error);
            alert(`Error creating charade: ${error.message}`);
        }
    }

    console.log('Successfully created charade list!')
}
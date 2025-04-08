let data = undefined;
const userAnswer = document.querySelector("#userAnswer");
const resultElement = document.querySelector("#resultElement");
let edit = false;
const url = `https://charader-senai.vercel.app/api/charades`;
const creationURL = `https://charader-senai.vercel.app/api/new-charade`;
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
        charadeListElement.innerHTML = '<p>No charades registered yet.</p>';
        return;
    }
    for (const charade of charades) {
        const charadeElementDiv = document.createElement('div');
        charadeElementDiv.classList.add('border', 'border-gray-300', 'p-2', 'mb-3', 'rounded', 'flex', 'justify-between', 'items-center');
        charadeElementDiv.id = `charade-${charade.id}`;
        charadeElementDiv.innerHTML = `
            <div class="flex-grow mr-3">
                <strong>${charade.charade}</strong>
                <p><small>Answer: ${charade.answer || 'Not defined'}</small></p>
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
            
            alert(`The functionality to edit charade ${charade.id} is not ready yet! 😉`);
        });
        const deleteButton = charadeElementDiv.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function() {
            console.log(`Delete button clicked for charade ID: ${charade.id}`);

            alert(`Careful! The functionality to delete charade ${charade.id} doesn't work yet! 😬`);
        });
        charadeListElement.appendChild(charadeElementDiv);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM was fully loaded.');
    getCharadeList();
    setTimeout(() => {
        showCharades(data)
    }, 1500);
});

creationForm.addEventListener('submit', newCharade)
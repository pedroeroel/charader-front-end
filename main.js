let data = undefined
const userAnswer = document.querySelector("#userAnswer") ;
const resultElement = document.querySelector("#resultElement") ;
let edit = false

async function getCharade() {
    try {

        document.querySelector('#charade').style.color = 'transparent';
        resultElement.style.color = 'transparent'
        if (edit != true) {
            userAnswer.value = ''
        } ;
        const url = `https://charader-senai.vercel.app/api/charades`;
        const id = document.querySelector('#charadeId').value || false
        const response = id ? await fetch(`${url}/${id}`) : await fetch(url) ;
        
        data = await response.json();

        document.querySelector('#charade').innerHTML = JSON.stringify(data.charade)
        console.log(data.charade)

        document.querySelector('#charade').style.transition = "color 200ms ease-in-out";

        setTimeout(() => {
            document.querySelector('#charade').style.color = "black";
        }, 200);

        resultElement.style.transition = "color 200ms ease-in-out";

        document.querySelector('#verifyButton').onclick = verifyAnswer
        
    }
    
    catch (e) {
        console.log(e)
    }

    return data
}

function verifyAnswer() {
    const currentAnswer = (JSON.stringify(data.answer)).replaceAll('"', '');
    
    console.log(currentAnswer)
    console.log(userAnswer.value)
    
    resultElement.style.transition = "color 200ms ease-in-out";
    resultElement.style.transition += "opacity 200ms ease-in-out";


    if (userAnswer.value.toLowerCase() == currentAnswer.toLowerCase()) {

        resultElement.textContent = "Correct!" ;
        resultElement.style.color = "green" ;
        document.querySelector('#charade').style.color = "green" ;
    } else {
        resultElement.textContent = "Incorrect. Try again!" ;
        resultElement.style.color = "red" ;
        document.querySelector('#charade').style.color = "red" ;
    }
}

function revealAnswer() {
    const currentAnswer = (JSON.stringify(data.answer)).replaceAll('"', '');
    
    resultElement.style.color = 'transparent'
    resultElement.style.opacity = 0 ;
    
    document.querySelector('#charade').style.color = 'black';
    
    setTimeout(() => {
        resultElement.textContent = `The answer was ${currentAnswer.toLowerCase()}.` ;
        resultElement.style.opacity = 1;
        resultElement.style.color = "green";
        }, 200);
    document.querySelector('#verifyButton').onclick = '' 
}

function revealResult() {

    resultElement.style.color = 'black'
    resultElement.style.opacity = 1 ;

}

getCharade()

// Using Form Data to feed the form input
const catEditForm = document.querySelector('#catEditForm');
let formData = new FormData(catEditForm);
const subBtn = document.querySelector('#subEdit');
//const submitButton = document.querySelector('#submitButton');
const idGrab = document.querySelector('#idGrab');
const myId = idGrab.value;
const subHead = document.querySelector('h5');
subHead.innerHTML = myId; 

const editForm = () => {
    console.log('Edit Form Submitted');
    const url = '/edit';
    console.log(url);
    // Using Fetch to send data to server
    fetch( url , {
        method: 'POST',
        body: formData
    });
}
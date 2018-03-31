// Using Form Data to feed the form input
const catAddForm = document.querySelector('#catAddForm'); 
const formData = new FormData(catAddForm);

//Using Fecth to send data to server
fetch('/add', {
    method: 'POST',
    body: formData
});
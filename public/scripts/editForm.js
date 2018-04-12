
// Using Form Data to feed the form input
const catEditForm = document.querySelector('#catEditForm'); 
//const submitButton = document.querySelector('#submitButton');

const editForm = (picArr) => {
  
    const formData = new FormData(catEditForm);
    //Using Fetch to send data to server
    fetch('/add', {
        method: 'PUT',
        body: formData
    });
}
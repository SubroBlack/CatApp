// Using Form Data to feed the form input
const catAddForm = document.querySelector('#catAddForm'); 

const submitForm = () => {
  
    const formData = new FormData(catAddForm);
    //Using Fetch to send data to server
    fetch('/add', {
        method: 'POST',
        body: formData
    });
}

// Using Form Data to feed the form input
const catEditForm = document.querySelector('#catEditForm');

const editForm = () => {
    const url = '/edit';
    console.log(url);
    // Using Fetch to send data to server
    fetch( url , {
        method: 'POST',
        body: formData
    });
}
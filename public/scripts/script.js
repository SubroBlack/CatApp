const filt = document.querySelector('#filter');
const searchCats = document.querySelector('#mySearch');
const currentUser = document.querySelector('#currentUser').value;
console.log(currentUser);
const userData = '/api/' + currentUser;
console.log(userData);


// fetching the picArray JSON file 
fetch(userData)
.then((res) => res.json())
.then((data) => {
 const picArr = data;

 // filter array by category 
 updateDOM(picArr);
 filt.addEventListener('change',() => updateDOM(picArr));
});

// Search by Title
const searchTitle = () => {
  fetch(userData + '/' + searchCats.value)
  .then((res) => res.json())
  .then((data) => {
    const picArr = data;
    updateDOM(picArr);
  })
}

// Selecting the Main Container in the DOM 
const pics = document.querySelector('.gallery');

//Creating a DOM 
const updateDOM = (Arr) => {

  const arr = Arr.filter((element) => {
    const selectedIndex = filt.selectedIndex;
    const options = document.querySelectorAll('option');
    const category = options[selectedIndex].value;
    if (category) {
      return element.category == category;
    } else {
      return true;
    } 
  });
  document.querySelector('.gallery').innerHTML ='';
 arr.forEach((element) => {
  const imgNode = document.createElement('div');
  imgNode.className = 'imgNode col-md-4';

// Function to open the modal
  const openModal = () => {
    modal.style.display = 'block';
  }

// Function to close the modal
  const closeModal = () => {
    modal.style.display = 'none';
  }

// Function to delete the entry
  const del = (e) => {
    e.preventDefault();
    fetch(btnDel.dataset.id, {
      method: 'DELETE'
    })
    imgNode.style.display = 'none';
  };

    // Function to Edit the entry
   const editEntry = () => {
    window.location.assign('/edit/' + element._id);    
  };
 
// Function to create and render the image elements inside the container
  const addImg = document.createElement('img');
  addImg.src = element.original;
  addImg.className = 'img-responsive';
  addImg.id = element.id;
  addImg.addEventListener('click', openModal);

// To render the Title of the pictures
  const title = document.createElement('h4');
  title.innerHTML = element.title;

// To render the date of the picture
  const date = document.createElement('h5');
  date.innerHTML = element.time;

// Details of the image
  const details = document.createElement('h6');
  details.innerHTML = element.details;

// Button to trigger the opening of the modal
  const btnModal = document.createElement('button');
  btnModal.id = element._id;
  btnModal.className = 'col-sm-4';
  btnModal.innerHTML = 'Details';
  btnModal.addEventListener('click', openModal);

  // Button to delete the entry
  const btnDel = document.createElement('button');
  btnDel.className = 'col-sm-4';
  btnDel.innerHTML = 'Delete';
  btnDel.setAttribute('data-id', element._id);
  btnDel.addEventListener('click', del);

  // Button to Edit the entry
  const btnEdit = document.createElement('button');
  btnEdit.className = 'col-sm-4';
  btnEdit.innerHTML = 'Edit';
  btnEdit.setAttribute('data-id', element._id);
  btnEdit.addEventListener('click', editEntry);

// Creating a Modal
const modal = document.createElement('modal');
modal.id = 'modal';
modal.style.display = 'none';
// The container-fluid for the containing in the contents of the modal
const cont = document.createElement('div');
cont.className = 'container-fluid';
cont.className = 'modal_cont';
// Image inside the modal
const imgBig = document.createElement('img');
imgBig.className = 'modalImg img-responsive';
imgBig.src = element.original;
//CLose button for the modal
const close = document.createElement('span');
close.innerHTML = '&times';
close.style.color = 'white';
close.addEventListener('click', closeModal);

//Rendering things into the MODAL 
modal.appendChild(cont);
cont.appendChild(close);
cont.appendChild(imgBig);

// Adding a Map container
const mapCont = document.createElement('iframe');
mapCont.className = 'container-fluid';
mapCont.id = 'mapCont';

//Getting the MAP 
const APIkey = 'AIzaSyB84eUub58287pgCriqnnspYoLnA-zFusE';
mapCont.src = `https://www.google.com/maps/embed/v1/place?key=${APIkey}&q=${element.coordinates.lat},${element.coordinates.lng}`;


// rendering everything on the DOM Tree
  pics.appendChild(imgNode);
  imgNode.appendChild(addImg);
  imgNode.appendChild(title);
  imgNode.appendChild(date);
  imgNode.appendChild(btnModal);
  imgNode.appendChild(btnDel);
  imgNode.appendChild(btnEdit);
  imgNode.appendChild(details);
  imgNode.appendChild(mapCont);
  document.body.appendChild(modal);
 })
}
const filt = document.querySelector('#filter');

// fetching the picArray JSON file 
fetch('/api')
.then((res) => res.json())
.then((data) => {
 const picArr = data;
 console.log(picArr);
 
 // filter array by category 
 updateDOM(picArr);
 filt.addEventListener('change',() => updateDOM(picArr));
});

// Selecting the Main COntainer in the DOM 
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
  imgNode.className = 'container-fluid imgNode col-xs-3';

// Function to open the modal
  const openModal = () => {
    modal.style.display = 'block';
  }

// Function to close the modal
  const closeModal = () => {
    modal.style.display = 'none';
  }

// Function to create and render the image elements inside the container
  const addImg = document.createElement('img');
  addImg.src = element.original ;
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
  const btn = document.createElement('button');
  btn.id = element.id;
  btn.className = 'buttons';
  btn.innerHTML = 'Details';
  btn.addEventListener('click', openModal);

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
  imgNode.appendChild(btn);
  imgNode.appendChild(details);
  imgNode.appendChild(mapCont);
  document.body.appendChild(modal);
 })
}







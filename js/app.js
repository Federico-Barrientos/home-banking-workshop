//Elementos del Dom
//Botones
const btnLogIn = document.getElementById('btn-login');
const btnSignIn = document.getElementById('btn-signin');
//Paginas
const mainPage = document.getElementById('main-page');
const signIn = document.getElementById('sign-in');
const logIn = document.getElementById('log-in');


//Eventos
btnSignIn.addEventListener('click', (event) => {
    event.preventDefault();
    mainPage.classList.add('hidden');
    signIn.classList.remove('hidden');
})

btnLogIn.addEventListener('click', (event) => {
    event.preventDefault();
    mainPage.classList.add('hidden');
    logIn.classList.remove('hidden');
})
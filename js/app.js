//Elementos del Dom
//Botones
const btnLogIn = document.getElementById('btn-login');
const btnSignIn = document.getElementById('btn-signin');
const btnBack = document.getElementById('btn-back')

//Paginas
const pages = {
    main: document.getElementById('main-page'),
    signIn: document.getElementById('sign-in'),
    logIn: document.getElementById('log-in')
}

//Eventos
btnSignIn.addEventListener('click', (event) => {
    event.preventDefault();
    pages.main.classList.add('hidden');
    pages.signIn.classList.remove('hidden');
})

btnLogIn.addEventListener('click', (event) => {
    event.preventDefault();
    pages.main.classList.add('hidden');
    pages.logIn.classList.remove('hidden');
})

function backTo(page) {
    pages.main.classList.add('hidden');
    pages.logIn.classList.add('hidden');
    pages.signIn.classList.add('hidden');

    pages[page].classList.remove('hidden');

}
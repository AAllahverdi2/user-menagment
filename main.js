

const URL = 'https://mocki.io/v1/f0b8306c-781b-45f1-9f88-0dc0a039f46f';

async function getData() {
    try {
        const res = await fetch(URL);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

getData();

class Person {
    constructor(name, address, email, phone_number, birthdate, job, company, age) {
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone_number = phone_number;
        this.birthdate = birthdate;
        this.job = job;
        this.company = company;
        this.age = this.getage();
        this.isRetired = this.isRetired();
    }
    getage() {
        const today = new Date();
        const birthDate = new Date(this.birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}

class User extends Person {
    constructor(name, address, email, phone_number, birthdate, job, company, age) {
        super(name, address, email, phone_number, birthdate, job, company, age);
    }
    isRetired() {
        return this.getage() > 65;
    }
}

async function initiAlUser() {
    const data = await getData();
    const persons = data.map(user => new User(
        user.name,
        user.address,
        user.email,
        user.phone_number,
        user.birthdate,
        user.job,
        user.company
    ));
    return persons;
}

const Tbody = document.getElementById('user-table');
const itemsPerPage = 10;
let currentPage = 1;
let allUsers = [];
let originalUsers = [];

async function FirstScreen() {
    let persons = await initiAlUser();
    allUsers = persons;
    originalUsers = persons;
    displayData();
}

function displayData() {
    Tbody.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const usersToDisplay = allUsers.slice(startIndex, endIndex);
    
    usersToDisplay.forEach(element => {
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>${element.name}</td>
            <td>${element.address}</td>
            <td>${element.email}</td>
            <td>${element.phone_number}</td>
            <td>${element.job}</td>
            <td>${element.company}</td>
            <td>${element.birthdate}</td>
            <td>${element.age}</td>
            <td>${element.isRetired ? 'Yes' : 'No'}</td>
        `;
        Tbody.appendChild(userRow);
    });
}

async function handleSearch() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    if (searchValue === "") {
        allUsers = originalUsers;
    } else {
        allUsers = originalUsers.filter(user =>
            user.name.trim().toLowerCase().includes(searchValue)
        );
    }
    currentPage = 1;
    displayData();
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayData();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < Math.ceil(allUsers.length / itemsPerPage)) {
        currentPage++;
        displayData();
    }
});

FirstScreen();


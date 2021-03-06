/**
 * Import
 */
import Element from "./model/element";
import "./assets/scss/main.scss";
import "./assets/img/Network.svg";
import "./assets/img/Launch.svg";
import "./assets/img/Ai.svg";
import "./assets/img/arrow.svg";
import "./assets/img/Programming.svg";
import "./assets/img/Science.svg";
import "./assets/img/Security.svg";
import "./assets/img/Social-media.svg";
import "./assets/img/Design.svg";

/**
* Variables
*/
const spreadsheetsId = `1xG2xF92GiSf5yVHU5JFoEHrAvR2ksaMNm7kMHAI4Iyg`;
const spreadsheet = `https://spreadsheets.google.com/feeds/list/${spreadsheetsId}/1/public/values?alt=json`;
const navbar = document.querySelector(".header--infobar");
const header = document.querySelector("header");
const dateField = document.querySelector(".header--infobar--date");
const sectionLeft = document.querySelector(".main--left");
const sectionRight = document.querySelector(".main--right");
const select = document.querySelector("select");
const optionValues = document.querySelectorAll("option");
const svgChronologique = document.querySelector(".chronologique");
const sticky = navbar.offsetTop;
let elementTab = [];
let dateChronologique = true;

/**
 * Déclaration
 */
const getData = async bdd => { // TODO: Get data from BDD
    try {
        let data = await fetch(bdd);
        let res = await data.json();
        return res.feed.entry;
    } catch (error) {
        throw error;
    }
}
const navFixed = () => { // TODO: Fixed navbar
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("is__sticky");
        header.classList.add("sticky");
        navbar.style.width = `${document.querySelector("main").clientWidth}px`;
    } else {
        navbar.classList.remove("is__sticky");
        header.classList.remove("sticky");
        navbar.style.width = "";
    }
}
const createElement = obj => {
    const div = document.createElement("div");
    div.classList.add("main--left--element");
    div.innerHTML += `
        <div class="main--left--element--date">
            <h3 class="is__date">${obj.day} / ${obj.month}</h3>
            <h4 class="is__date__year">${obj.year}</h4>
        </div>
        <div class="main--left--element--img">
            <img src="./img/${obj.img}" alt="Icon" class="is__element__img"/>
        </div>
        <div class="main--left--element--text">
            <h2 class="is__title__element">${obj.title}</h2>
            <p class="is__content__element">${obj.description}</p>
            <p class="is__content__tag__element">#${obj.category}</p>
        </div>`;
    sectionLeft.appendChild(div);
    return div;
}
const createContentSection = obj => {
    document.body.classList.add("is__overflow__hidden"); 
    sectionRight.classList.remove("is__none");
    sectionRight.innerHTML = `
    <div class="main--right--element">
        <div class="main--right--element--wrapper">
            <div class="main--right--element--wrapper--description">
                <h2 class="is__">Overview</h2>
                <div class="separateur"></div>
                <p>${obj.content}</p>
                <h2 class="is__">Links</h2>
                <p><a href="${obj.link}">${obj.link}</a></p>
                <p><a href="${obj.otherLink}">${obj.otherLink}</a></p>
            </div>
            <div class="main--right--element--wrapper--related">
                <span class="is__arrow__close">&times;</span>
                <h2 class="is__">Related</h2>
                <div class="separateur"></div>
                <h3>Category</h3>
                <p>${obj.category}</p>
                <h3>Related date</h3>
            </div>
        </div>
    </div>`;
    const arrowClose = document.querySelector(".is__arrow__close");
    arrowClose.addEventListener("click", () => {
        sectionRight.innerHTML = "";
        sectionRight.classList.add("is__none");
        document.body.classList.remove("is__overflow__hidden"); 
    });
};
const renderContent = async () => { // TODO: Render element
    const data = await getData(spreadsheet);
    for (let i = 0; i < data.length; i++) {
        new Element(data[i], optionValues, select, createElement, elementTab);
    }
}
const filter = async () => { //TODO: Filter date with categories
    sectionLeft.innerHTML = "";
    if (select.value === "") {
        elementTab.forEach(element => {
            createElement(element);
        });
    } else {
        dateChronologique = true;
        elementTab.forEach(element => {
            if (element.category === select.value) {
                createElement(element);
            }
        });
    }
};
const returnDate = () => {
    sectionLeft.innerHTML = "";
    if (select.value === "") {
        if (dateChronologique) {
            svgChronologique.style.transform = 'rotate(180deg)';
            for (let i = elementTab.length - 1; i >= 0; i--) {
                createElement(elementTab[i]);
            }
            dateChronologique = false;
        } else {
            svgChronologique.style.transform = '';   
            for (const i of elementTab) {
                createElement(i);
            }
            dateChronologique = true;
        }
    } else {
        if (dateChronologique) {
            for (let i = elementTab.length - 1; i >= 0; i--) {
                if (select.value === elementTab[i].category) {
                    createElement(elementTab[i]);
                }
            }
            dateChronologique = false;
        } else {
            for (const i of elementTab) {
                if (select.value === i.category) {
                    createElement(i);
                }
            }
            dateChronologique = true;
        }
    }
}
const getFullcontent = e => {
    if (e.path[0].className === "main--left--element--text") {
        elementTab.forEach(element => {
            if (e.path[0].firstElementChild.textContent === element.title) {
                createContentSection(element);
            }
        });
    } else if (e.path[1].className === "main--left--element--text") {
        elementTab.forEach(element => {
            if (e.path[1].firstElementChild.textContent === element.title) {
                createContentSection(element);
            }
        });
    }
}

/**
 * Éxecution
 */
window.addEventListener("DOMContentLoaded", renderContent);
window.addEventListener("scroll", navFixed);
select.addEventListener("change", filter);
dateField.addEventListener("click", returnDate);
document.addEventListener("click", event => { getFullcontent(event) });
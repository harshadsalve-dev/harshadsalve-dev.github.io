// Select header, navbar and navigation list
const header = document.querySelector("header");
const nav = document.querySelector("nav");
const navList = document.querySelector("nav ul");


// ===============================
// CREATE HAMBURGER BUTTON
// ===============================

const menuButton = document.createElement("button");

menuButton.innerHTML = "☰";
menuButton.classList.add("menu-btn");

// Accessibility: screen readers can announce what this button does
menuButton.setAttribute("aria-label", "Toggle menu");
menuButton.setAttribute("aria-expanded", "false");

// Add button inside navbar
nav.appendChild(menuButton);


// ===============================
// OPEN / CLOSE MOBILE MENU
// ===============================

menuButton.addEventListener("click", function () {

    navList.classList.toggle("show-menu");

    const isOpen = navList.classList.contains("show-menu");

    // Change hamburger icon
    menuButton.innerHTML = isOpen ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(isOpen));

});


// ===============================
// CLOSE MENU AFTER CLICKING LINK
// (smooth scrolling is handled by CSS: scroll-behavior: smooth)
// ===============================

const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navList.classList.remove("show-menu");

        menuButton.innerHTML = "☰";
        menuButton.setAttribute("aria-expanded", "false");

    });

});


// ===============================
// ACTIVE NAVIGATION LINK
// + HEADER SCROLL EFFECT
// ===============================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", function () {

    // ----- Active link -----
    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });

    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }

    });

    // ----- Header effect (darker background after scrolling) -----
    header.classList.toggle("scrolled", window.scrollY > 50);

});

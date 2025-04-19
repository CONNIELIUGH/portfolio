console.log("IT'S ALIVE");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }
  
// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add("current");



let pages = [
    {url: "", title: "Home"},
    {url: "projects/", title:"Projects"},
    {url: "resume/", title: "Resume"},
    {url: "contact/", title: "Contact"},
    {url: "https://github.com/CONNIELIUGH", title: "GitHub Profile"}
]

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages){
    let url = p.url;
    let title = p.title;
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
            ? "/"                  // Local server
            : "/website/";         // GitHub Pages repo name
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    // nav.insertAdjacentHTML('beforeend', `<a href = "${url}">${title}</a>`);
    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle("current", 
        a.host === location.host && a.pathname === location.pathname,
    );
    // GitHub Profile Page direct to new page
    if (a.host  !== location.host){
        a.target = "_blank";
    }

}

// Change theme option buttons

document.body.insertAdjacentHTML(
    'afterbegin',
    `<label class="color-scheme">
       Theme:
       <select>
         <option value="light dark">Automatic</option>
         <option value="light">Light</option>
         <option value="dark">Dark</option>
       </select>
     </label>`
);


let select = document.querySelector("select");

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);

    localStorage.colorScheme = event.target.value;


});

if ('colorScheme' in localStorage) {
    const saved = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', saved);
    select.value = saved;    // make the dropdown show the stored choice
  }


import { fetchJSON, renderProjects, createProjectTitle } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');


renderProjects(projects, projectsContainer, 'h4');
createProjectTitle(projects, projectsContainer);



// drawing a pie chart with D3
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);


let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
  );


let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
});

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let sliceGenerator = d3.pie().value((d)=> d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})


let legend = d3.select('.legend'); // adding stuff inside ul 
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .attr('class', 'corlorlegends')
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});

console.log(rolledData);



// adding a search feield 
let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) =>{
    // update query value
    query = event.target.value;
    

    // filter the projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    console.log(filteredProjects);

    // render filtered projects
    renderProjects(filteredProjects, projectsContainer, 'h2');
})


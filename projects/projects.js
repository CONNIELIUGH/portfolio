import { fetchJSON, renderProjects, createProjectTitle } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

let newArcs;

// drawing a pie chart with D3
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);


function setQuery(query){
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
    return filteredProjects;

}

function renderPieChart(projectsGiven){
    // re-calcualte rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // re-calculate slice generator, arc data, arc, ...
    let newSliceGenerator = d3.pie().value((d)=> d.value);
    let newArcData = newSliceGenerator(newData);
    newArcs = newArcData.map((d) => arcGenerator(d));

    let selectedIndex = -1;

    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();


    let legend = d3.select('.legend'); 
    legend.selectAll('li').remove();
    newData.forEach((d, idx) => {
    legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .attr('class', 'corlorlegends')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });

    newArcs.forEach((arc, idx) => {
        newSVG.append('path')
          .attr('d', arc)
          .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
          .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            console.log("hello", selectedIndex);
            newSVG
              .selectAll('path')
              .attr('class', (_, idx) => (
                selectedIndex === idx ? 'selected' : null
              ));
            legend.selectAll('li').attr('class', (_, idx) => (
                  selectedIndex === idx ? 'selected' : null
            ));
            if (selectedIndex == -1){
                console.log(selectedIndex, "yo");
                console.log(newData);
                renderProjects(projectsGiven, projectsContainer, 'h2');
        
            } else {
                console.log(selectedIndex, "yo");
                
                console.log(newData[selectedIndex]);
                let filteredGivenProjects = projectsGiven.filter((project) => {
                    return project.year == newData[selectedIndex].label;
                })
                renderProjects(filteredGivenProjects, projectsContainer, 'h2');
        
            }
          })

    });

   
};

renderPieChart(projects);
renderProjects(projects, projectsContainer, 'h2');
createProjectTitle(projects, projectsContainer);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  let filteredProjects = setQuery(event.target.value);

  // re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});




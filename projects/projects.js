import { fetchJSON, renderProjects, createProjectTitle } from '../global.js';


const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

createProjectTitle(projects, projectsContainer);
renderProjects(projects, projectsContainer, 'h4');





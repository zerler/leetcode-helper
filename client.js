const problems = document.querySelector('.problems');
const loading = document.querySelector('.loading');

const RECENT_URL = 'http://localhost:3000/recent';
const UPDATE_URL = 'http://localhost:3000/update';

fetch(RECENT_URL)
.then(data => data.json())
.then(res => insertProblems(res))
.catch(err => console.log(err));

const insertProblems = problemArray => {
   let html = '';
   for (problem in problemArray) {
      const p = problemArray[problem];
      html += 
      `<div class="problem">
         <a href="${problemArray[problem].url}">
            <h2>${p.type}: ${p.name}</h2>
            <p>${p.relative_time}</p>
         </a>
         <svg onclick="updateProblem('${p.name}')"
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
      </div>`;
   }
   problems.innerHTML = html;
   loading.style.display = 'none';
};

const updateProblem = name => {
   const data = { name };
   fetch(UPDATE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })
    .then(() => location.reload())
    .catch(err => console.log(err));
};
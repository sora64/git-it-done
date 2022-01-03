const issueContainerEl = document.querySelector('#issues-container');
const limitWarningEl = document.querySelector('#limit-warning');
const repoNameEl = document.querySelector('#repo-name');

let getRepoName = function() {
    let queryString = document.location.search;

    let repoName = queryString.split('=')[1];

    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // if no repo was given, redirect to the hompage
        document.location.replace('./index.html');
    }
};

let getRepoIssues = function(repo) {
    console.log(repo);

    let apiUrl = 'https://api.github.com/repos/' + repo + '/issues?direction=asc';

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get('Link')) {
                    displayWarning(repo);
                }
            });
        } else {
            // if not successful, redirect to homepage
            document.location.replace('./index.html');
        }
    });
};

let displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = 'This repo has no open issues!';
        return;
    }

    for (let i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        let issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute('href', issues[i].html_url);
        issueEl.setAttribute('target', '_blank');

        // create span to hold issue title
        let titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        let typeEl = document.createElement('span');

        // check if issue is an acutal issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = '(Pull request)';
        } else {
            typeEl.textContent = '(Issue)';
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

let displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = 'To see more than 30 issues, visit ';

    let linkEl = document.createElement('a');
    linkEl.textContent = 'GitHub.com';
    linkEl.setAttribute('href', 'https://github.com/' + repo + '/issues');
    linkEl.setAttribute('target', '_blank');

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
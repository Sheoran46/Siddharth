// User Authentication
const users = JSON.parse(localStorage.getItem('users')) || {};

document.getElementById('loginButton').addEventListener('click', () => {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    if (users[userId] && users[userId] === password) {
        alert('Login successful!');
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('portfolioBuilderSection').style.display = 'block';
        document.getElementById('outputSection').style.display = 'block';
        loadPortfolioData(userId);  // Load user's saved portfolio
    } else {
        alert('Invalid User ID or Password.');
    }
});

document.getElementById('signupButton').addEventListener('click', () => {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!userId || !password) {
        alert('Please enter both User ID and Password.');
        return;
    }

    if (users[userId]) {
        alert('User ID already exists. Please choose a different one.');
    } else {
        users[userId] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign-up successful! Please log in.');
    }
});

// Portfolio Functionality
const skills = [];
let profilePictureData = '';
let currentUser = '';

document.getElementById('profilePicture').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePictureData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('addSkillButton').addEventListener('click', () => {
    const skill = document.getElementById('skillName').value.trim();
    if (skill) {
        skills.push(skill);
        updateSkillsContainer();
        document.getElementById('skillName').value = '';
    }
});

function updateSkillsContainer() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';
    skills.forEach((skill) => {
        const skillBlock = document.createElement('div');
        skillBlock.className = 'skill-block';
        skillBlock.textContent = skill;
        container.appendChild(skillBlock);
    });
}

document.getElementById('generateButton').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const summary = document.getElementById('summary').value;
    const experience = document.getElementById('experience').value;
    const education = document.getElementById('education').value;
    const projects = document.getElementById('projects').value;
    const certifications = document.getElementById('certifications').value;
    const languages = document.getElementById('languages').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;

    const profileHTML = `
        <div class="profile-header">
            <img src="${profilePictureData}" alt="Profile Picture">
            <h3>${name}</h3>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
        </div>
        <h3>Statement of Originality:</h3>
        <p>${summary}</p>
        <h3>Career Summary:</h3>
        <p>${experience}</p>
        <h3>Education:</h3>
        <p>${education}</p>
        <h3>Projects:</h3>
        <p>${projects}</p>
        <h3>Certifications:</h3>
        <p>${certifications}</p>
        <h3>Languages:</h3>
        <p>${languages}</p>
        <h3>Skills:</h3>
        <div class="skills-container">
            ${skills.map(skill => `<div class="skill-block">${skill}</div>`).join('')}
        </div>
        <h3>Social Links:</h3>
        <p><a href="${linkedin}" target="_blank">LinkedIn</a></p>
        <p><a href="${github}" target="_blank">GitHub</a></p>
    `;

    document.getElementById('portfolioOutput').innerHTML = profileHTML;
});

// Save Portfolio Data
document.getElementById('saveButton').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const summary = document.getElementById('summary').value;
    const experience = document.getElementById('experience').value;
    const education = document.getElementById('education').value;
    const projects = document.getElementById('projects').value;
    const certifications = document.getElementById('certifications').value;
    const languages = document.getElementById('languages').value;

    const portfolioData = {
        name,
        email,
        phone,
        summary,
        experience,
        education,
        projects,
        certifications,
        languages,
        profilePicture: profilePictureData,
        skills
    };

    if (!currentUser) {
        alert('Please log in to save your portfolio.');
        return;
    }

    const userPortfolios = JSON.parse(localStorage.getItem('portfolios')) || {};
    userPortfolios[currentUser] = portfolioData;
    localStorage.setItem('portfolios', JSON.stringify(userPortfolios));
    alert('Portfolio saved!');
});

// Load Portfolio Data
function loadPortfolioData(userId) {
    const userPortfolios = JSON.parse(localStorage.getItem('portfolios')) || {};
    const savedPortfolio = userPortfolios[userId];

    if (savedPortfolio) {
        document.getElementById('name').value = savedPortfolio.name;
        document.getElementById('email').value = savedPortfolio.email;
        document.getElementById('phone').value = savedPortfolio.phone;
        document.getElementById('summary').value = savedPortfolio.summary;
        document.getElementById('experience').value = savedPortfolio.experience;
        document.getElementById('education').value = savedPortfolio.education;
        document.getElementById('projects').value = savedPortfolio.projects;
        document.getElementById('certifications').value = savedPortfolio.certifications;
        document.getElementById('languages').value = savedPortfolio.languages;
        profilePictureData = savedPortfolio.profilePicture;
        skills.push(...savedPortfolio.skills);
        updateSkillsContainer();
    }

    currentUser = userId;  // Store current user
}

document.getElementById('downloadButton').addEventListener('click', () => {
    const portfolioContent = document.getElementById('portfolioOutput').innerHTML;
    const blob = new Blob([portfolioContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'portfolio.html';
    link.click();
});
// Generate Portfolio Link
document.getElementById('generateLinkButton').addEventListener('click', () => {
    const portfolioContent = document.getElementById('portfolioOutput').innerHTML;
    
    // Create a Blob from the portfolio content
    const blob = new Blob([portfolioContent], { type: 'text/html' });
    
    // Create a temporary link element to download the portfolio as an HTML file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'portfolio.html';  // Suggested filename for the portfolio file
    link.click();

    // Provide feedback to the user
    alert('A link to your portfolio has been generated. Check your downloads folder!');
});
// Function to handle the file upload and display it in the portfolio preview
function handleFileUpload(fileInputId, sectionId) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0]; // Get the first file from the input
    const section = document.getElementById(sectionId);

    if (file) {
        // Display the file name in the section
        const fileName = document.createElement('p');
        fileName.textContent = `Uploaded File: ${file.name}`;
        section.appendChild(fileName);
        
        // Optionally, display an image preview (for image files only)
        if (file.type.startsWith('image/')) {
            const imgPreview = document.createElement('img');
            imgPreview.src = URL.createObjectURL(file);
            imgPreview.style.width = '150px';  // Set the preview image size
            section.appendChild(imgPreview);
        }
    }
}

// Add event listeners for file uploads in certifications and projects
document.getElementById('certificationFile').addEventListener('change', () => {
    handleFileUpload('certificationFile', 'portfolioOutput');
});

document.getElementById('projectFile').addEventListener('change', () => {
    handleFileUpload('projectFile', 'portfolioOutput');
});

const overviewBtn = document.getElementById("overviewButton");
const userAnalysisBtn = document.getElementById("userAnalysisButton");

const homePageDiv = document.getElementById("homePage");
const userPageDiv = document.getElementById("userPage");

overviewBtn.onclick = (e) => {
    userPageDiv.style.display = "none";
    homePageDiv.style.display = "block";
}

userAnalysisBtn.onclick = (e) => {
    homePageDiv.style.display = "none";
    userPageDiv.style.display = "block";
}

userPageDiv.style.display = "none";
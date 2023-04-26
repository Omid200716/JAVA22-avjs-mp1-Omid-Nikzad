import { getHighScoreList } from "./dataBase2.js";

//prompt method for att tar emot user name
const addUserName = prompt("Enter you name please!");
const name = document.querySelector(".userName");
name.innerText = addUserName;
const divContainer = document.querySelector(".divContainer");

export function game() {
  // divContainer som behåller alla
  const imageBox = document.querySelectorAll(".items");
  const button = document.querySelector(".button");

  //med hjälp av for loopen addEventlistere tillägg i alla image elementer
  for (let i = 0; i < imageBox.length; i++) {
    imageBox[i].addEventListener("click", () => {
      //ett random nummer for Cpu val
      const randomN = Math.floor((Math.random() * 10) / 4);
      // console.log(randomN + " computer");

      divContainer.innerHTML = "";
      cpuLogic(randomN);
      gameLogic(i, randomN);
    });
  }

  // med hjälp av den här function gömma man user val image
  function hiddenElement() {
    for (let i = 0; i < imageBox.length; i++) {
      imageBox[i].classList.add("hidden");
    }
  }

  let userPoint = 0;

  // med hjälp av den här function sätt man vår vilkor till cpu
  async function cpuLogic(randomNumber) {
    //getHichScoreList();

    console.log(randomNumber);
    if (randomNumber == 0) {
      const image1 = document.createElement("img");
      divContainer.append(image1);

      const imgUrl1 = new URL("../img/paper.png", import.meta.url);
      image1.src = imgUrl1.href;
      createElement("paper");
    }
    if (randomNumber == 1) {
      const image2 = document.createElement("img");
      divContainer.append(image2);

      const imgUrl2 = new URL("../img/rock.png", import.meta.url);
      image2.src = imgUrl2.href;
      createElement("rock");
    } else if (randomNumber == 2) {
      const image3 = document.createElement("img");
      divContainer.append(image3);

      const imgUrl3 = new URL("../img/scissor.png", import.meta.url);
      image3.src = imgUrl3.href;
      createElement("scissor");
    }
  }

  userPoint = 0;

  // Den här function gör hela spel logic.
  async function gameLogic(user, cpu) {
    const userP = document.querySelector(".userP");
    const cpuP = document.querySelector(".cpuP");

    if (
      (user == 0 && cpu == 1) ||
      (user == 2 && cpu == 0) ||
      (user == 1 && cpu == 2)
    ) {
      userPoint++;
      userP.innerText = userPoint;
      createElement(addUserName + "win the game!");
    } else if (
      (user == 0 && cpu == 0) ||
      (user == 1 && cpu == 1) ||
      (user == 2 && cpu == 2)
    ) {
      createElement("Equal");
    } else {
      createElement(`Cpu win the game!`);
      hiddenElement();

      putPlayerTODatabase(addUserName, userPoint);

      //console.log(addUserName + "demo" + userPoint);
    }
  }
  // hämta datan från URL som innehåller en JSON fil med högsta poänglistor.
  async function getHighScore() {
    //highscore array listan
    const highscore = await getHighScoreList();

    const highScoreList = document.querySelector("#high-score-list");

    const ul = document.createElement("ul");

    for (let i = 0; i < highscore.length; i++) {
      let objekt = highscore[i];

      const li = document.createElement("li");

      li.textContent += `${objekt.name}: ${objekt.score}`;
      ul.appendChild(li);
    }

    highScoreList.innerHTML = "";
    highScoreList.appendChild(ul);
  }

  async function putPlayerTODatabase(name, poäng) {
    const databaseURL =
      "https://highscore-66ea9-default-rtdb.europe-west1.firebasedatabase.app/highscore.json";

    const response = await fetch(databaseURL);
    const data = await response.json();
    console.log(data);

    let highscore2 = Object.keys(data || {}).map((key) => ({
      name: data[key].name,
      score: data[key].score,
    }));

    let firstEmptyIndex = highscore2.findIndex(
      (item) =>
        item.name === undefined ||
        item.name === null ||
        item.score === 0 ||
        (item.name === undefined && item.name === null && item.score === 0)
    );

    if (firstEmptyIndex === -0) {
      highscore2 = highscore2.filter((item) => item.score !== 0);
      firstEmptyIndex = highscore2.findIndex((item) => item.score === 0);
    }

    if (firstEmptyIndex >= 0) {
      highscore2[firstEmptyIndex] = { name: name, score: poäng };
    } else {
      const minScoreIndex = highscore2.reduce(
        (minIndex, item, index) =>
          item.score < highscore2[minIndex].score ? index : minIndex,
        0
      );
      highscore2[minScoreIndex] = { name: name, score: poäng };
    }

    console.log(name + "" + poäng);

    highscore2.sort((a, b) => b.score - a.score);

    highscore2.splice(5);

    const headers = { "Content-Type": "application/json " };
    const body = JSON.stringify(highscore2);
    const putResponse = await fetch(databaseURL, {
      method: "PUT",
      headers: headers,
      body: body,
    });
    if (!putResponse.ok) {
      throw new Error(`HTTP error! status: ${putResponse.status}`);
    }

    console.log("Firebase database updated successfully");
    await getHighScore();
  }

  function createElement(data) {
    const element = document.createElement("h4");
    divContainer.append(element);
    element.innerText = data;
  }
}

import { getHighScoreList } from "./dataBase2.js";

const addUserName = prompt("Enter your name, please!");
const name = document.querySelector(".userName");
name.innerText = addUserName;
const divContainer = document.querySelector(".divContainer");

export async function game() {
  const imageBox = document.querySelectorAll(".items");
  const button = document.querySelector(".button");

  for (let i = 0; i < imageBox.length; i++) {
    imageBox[i].addEventListener("click", async () => {
      const randomN = Math.floor((Math.random() * 10) / 4);

      divContainer.innerHTML = "";
      await cpuLogic(randomN);
      gameLogic(i, randomN);
    });
  }

  function hiddenElement() {
    for (let i = 0; i < imageBox.length; i++) {
      imageBox[i].classList.add("hidden");
    }
  }

  let userPoint = 0;

  async function cpuLogic(randomNumber) {
    if (randomNumber === 0) {
      const image1 = document.createElement("img");
      divContainer.append(image1);

      const imgUrl1 = new URL("../img/paper.png", import.meta.url);
      image1.src = imgUrl1.href;
      createElement("paper");
    } else if (randomNumber === 1) {
      const image2 = document.createElement("img");
      divContainer.append(image2);

      const imgUrl2 = new URL("../img/rock.png", import.meta.url);
      image2.src = imgUrl2.href;
      createElement("rock");
    } else if (randomNumber === 2) {
      const image3 = document.createElement("img");
      divContainer.append(image3);

      const imgUrl3 = new URL("../img/scissor.png", import.meta.url);
      image3.src = imgUrl3.href;
      createElement("scissor");
    }
  }

  async function gameLogic(user, cpu) {
    const userP = document.querySelector(".userP");
    const cpuP = document.querySelector(".cpuP");

    if (
      (user === 0 && cpu === 1) ||
      (user === 2 && cpu === 0) ||
      (user === 1 && cpu === 2)
    ) {
      userPoint++;
      userP.innerText = userPoint;
      createElement(addUserName + " wins the game!");
    } else if (
      (user === 0 && cpu === 0) ||
      (user === 1 && cpu === 1) ||
      (user === 2 && cpu === 2)
    ) {
      createElement("Equal");
    } else {
      createElement(`CPU wins the game!`);
      hiddenElement();
      await putPlayerToDatabase(addUserName, userPoint);
    }
  }

  async function getHighScore() {
    const highscore = await getHighScoreList();
    const highScoreList = document.querySelector("#high-score-list");
    const ul = document.createElement("ul");

    for (let i = 0; i < highscore.length; i++) {
      const objekt = highscore[i];
      const li = document.createElement("li");
      li.textContent = `${objekt.name}: ${objekt.score}`;
      ul.appendChild(li);
    }

    highScoreList.innerHTML = "";
    highScoreList.appendChild(ul);
  }

  async function putPlayerToDatabase(name, poäng) {
    const databaseURL =
      "https://highscore-66ea9-default-rtdb.europe-west1.firebasedatabase.app/highscore.json";

    // Hämta den nuvarande highscore-listan från databasen
    let highscore = await getHighScoreList() || [];

    // Hitta om den nuvarande spelaren redan finns i listan
    const existingPlayerIndex = highscore.findIndex(player => player.name === name);

    if (existingPlayerIndex !== -1) {
        // Om den nuvarande spelaren redan finns och har en högre poäng, uppdatera poängen
        if (poäng > highscore[existingPlayerIndex].score) {
            highscore[existingPlayerIndex].score = poäng;
        }
    } else if (highscore.length < 5 || poäng > highscore[4].score) {
        // Lägg till den nuvarande spelaren om listan har mindre än 5 spelare
        // eller om spelaren har en högre poäng än den lägsta i listan
        highscore.push({ name, score: poäng });
    }

    // Sortera listan i fallande ordning baserat på poäng
    highscore.sort((a, b) => b.score - a.score);

    // Behåll bara topp 5 poäng
    highscore = highscore.slice(0, 5);

    // Uppdatera databasen med den nya listan
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(highscore);
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

await getHighScore();

}

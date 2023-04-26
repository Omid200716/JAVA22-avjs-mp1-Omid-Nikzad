// hämta data från firebase
export async function getHighScoreList() {
    const url = 'https://highscore-66ea9-default-rtdb.europe-west1.firebasedatabase.app/highscore.json'
    
    
    const response = await fetch(url);
  
    const data = await response.json();
    return data;
}
    



  
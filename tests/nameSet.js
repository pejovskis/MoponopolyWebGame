class Player {

    name = "";
    isAlive = false;
    cash = 0;
    position = 0;
    items = [];

    constructor (name, isAlive, cash, position, items) {
        this.name = name;
        this.isAlive = isAlive;
        this.cash = cash; 
        this.position = position;
        this.items = items;
    }

    /* Get random number 1-6, update the html and display the generated number. Calculate the next position and move*/
    movePlayer() {
        let rollRes = 1 + Math.floor(Math.random() * 12);
        /*let rollRes = 4; /* T E S T E R ! ! ! */
        updater(); // update everything
        consoleInfo.innerText += this.name + " rolled a " + rollRes + "\n";
        rollResEl.innerText = "Roll result: " + rollRes; 
        
        if(this.position + rollRes <= field.length - 1){ // Change this number to change the total number of fields ! ! !
            this.position += rollRes;
        } else if(this.position + rollRes === 40) {
            this.position = 0;
            this.cash += 200;
            consoleInfo.textContent = "+200€ for crossing Start";
        } else {
            this.position = rollRes + this.position - field.length; // Change this number to change the total number of fields ! ! !
            this.cash += 200;
            consoleInfo.textContent = "+200€ for crossing Start";
        }

        /** Buy Btn disabler. In case the land is not ownable. */
        /** */
        let currentField = this.position;
        if(field[currentField].isOwnable) {
            buyBtnEl.removeAttribute("disabled");
        } else {
            if((field[currentField].name === "Surprise") || (field[currentField].name === "Chance")){
                turnOverBtn.style.display = "none";
                readBtnEl.style.display = "inline-block";
            }
            else if((field[currentField].name === "Prison") || (field[currentField].name === "Prison")){
                this.position = 10;
            }
            else if((field[currentField].name === "Tax")){
                this.cash -= 30;
                consoleInfo.textContent += "Tax 30€ payed."
            }
            else if((field[currentField].name === "Us Tax")){
                this.cash -= 130;
                consoleInfo.textContent += "US Tax 130€ payed."
            }
            buyBtnEl.setAttribute("disabled", "");
        }

        updater();
        
    }

    /* Buy Field function */ 
    buyField() {

        let currentField = this.position;

        /* Check if the player has got enough cash to buy the Field and if the Field is ownable */
        if((this.cash >= field[currentField].price) &&
            (field[currentField].isOwnable === true)) {

            this.cash -= field[currentField].price;
            this.items.push(document.createElement("li").innerText = field[currentField].name);
            field[currentField].isOwnable = false;
            field[currentField].owner = this.name;
            buyBtnEl.setAttribute("disabled", "");
 
            consoleInfo.innerText += this.name + " Bought " + field[currentField].name + ". \n Current cash: - " + field[currentField].price;

        } else if((this.cash >= field[currentField].price) &&  // If the player's got enough cash but the field is not ownable.
        (field[currentField].isOwnable === false)){
            consoleInfo.innerText += "Current Field is not for sale!" + field[currentField].owner + " Owns it! \n";
        } else { // if the player does not have enough cash
            console.log("not enough cash");
            consoleInfo.innerText += "not enough cash";
        }
        updater();
    }

    /* Pay Rent Function. Check if the player owns the field. if not, checks if it's a land. If yes checks if anyone owns it, if yes pay the rent. */
    payRent() {

        let currentPosition = this.position;

        if((this.items.includes(field[currentPosition].name))) {
            consoleInfo.innerText += "Field status: " + "Field owned. \n"
        }else if(field[currentPosition].isLand === false) {
            consoleInfo.innerText += "Field status: " + "Chance, Surprise, Prison \n"
        }else if((field[currentPosition].isLand === true) && (field[currentPosition].isOwnable === false)) {
            let payRentSum = field[currentPosition].rent;
            this.payToPlayer(player, currentPosition, payRentSum);
            updater();
            this.gameOver();
        }
        
    }

    /** Game over, check after paying rent, called in the object in the payRent(). Dissables the roll btn */
    gameOver() {

        updater();

        if(this.cash < 0) {
            this.isAlive = false;
            consoleInfo.innerText += this.name + " is bancrupt! Game OVER!";
            rollBtnEl.setAttribute("disabled", "");
            startBtnEl.style.display = "inline-block";
        }

    }

    /** Move the HTML Elements to simulate the gameplay. The pixels are calculated according the the main table div size. */
    movePlayerOb() {

        let elXPosition;
        let elYPosition;
    
        if(this.position <= 10) {
            elXPosition = this.position * 100 + 100;
            elYPosition = 0;
        } else if (this.position > 10 && this.position <= 20) {
            elXPosition = 1100 
            elYPosition = this.position * 100 - 900; 
        } else if (this.position > 20 && this.position <= 30) {
            elXPosition = Math.abs(this.position * 100 - 2000 - 1100);
            elYPosition = 1100;
        } else if (this.position > 30 && this.position < 40) {
            elXPosition = 165;
            elYPosition = Math.abs(this.position * 100 - 3000 - 1100);
        }

        elXPosition += "px";
        elYPosition += "px";

        console.log(elXPosition + " " + elYPosition);

        const playerIndex = player.indexOf(this);
        playerEl[playerIndex].style.left = elXPosition;
        playerEl[playerIndex].style.top = elYPosition;
    }

    /** Paying function, it's called inside the object in the payRent() */
    payToPlayer(players, curField,sumToPay) {
        for(let i = 0; i < players.length; i++) {
            if(players[i].name === field[curField].owner) {
                players[i].cash += sumToPay;
                this.cash -= sumToPay;
                consoleInfo.innerText += this.name + " paid rent of " + sumToPay + " to " + players[i].name + "\n";
                break;
            }
        }
        updater();
    }  

    /** Surprise Function */
    surpriseFunction() {

        let randomN = 1 + Math.floor(Math.random() * 12);
        /** let randomN = 12;  Change this one for T E S T I N G ! ! ! */
        let spMsg = "";
        cardDEl.style.display = "flex";

        switch(randomN) {

            case 1:
                spMsg = "Go three Fields forwards \n";
                this.position += 3;
                break;

            case 2:
                spMsg = "Go five Fields forwards \n";
                this.position += 5;
                break;

            case 3:
                spMsg = "Go two Fields backwards \n";
                this.position -= 2;
                break;

            case 4:
                spMsg = "Go to the next train station \n";
                if(this.position < 5) {
                    this.position = 5;
                }else if((this.position < 15) && (this.position >= 5)) {
                    this.position = 15;
                }else if((this.position < 25) && (this.position >= 15)) {
                    this.position = 25;
                }else if((this.position < 35) && (this.position >= 25)) {
                    this.position = 35;
                }
                break;

            case 5:
                spMsg = "Go to Jail. Do not pass 'Start' and do not collect start gift";
                this.position = 10;
                break;

            case 6:
                spMsg = "Go to Hawaii. If you pass 'Start', collect 300€";
                if(this.position > 31) {
                    this.cash += 300;
                }
                this.position = 31;
                break;

            case 7:
                spMsg = "Pay a 200€ fine!"
                if(this.cash > 200) {
                    this.cash -= 200;
                }else {
                    this.gameOver();
                }
                break;

            case 8:
                spMsg = "Today is your B-Day. Every player should give you a gift of 300€";
                for(let i = 0; i < player.length; i++){
                    if(this.name !== player[i].name) {
                        this.cash += 300;
                        player[i].cash -= 300;
                    }
                }
                break;

            case 9:
                spMsg = "Advance to Start and collect the gift + 200€";
                this.position = 0;
                this.cash += 200;
                break;

            case 10:
                spMsg = "You have been elected chairman of the board. Pay each player 250€";
                for(let i = 0; i < player.length; i++){
                    if(this.name !== player[i].name) {
                        this.cash -= 250;
                        player[i].cash += 250;
                    }
                }
                break;

            case 11:
                spMsg = "You have won second prize in a beauty contest. Collect 80€.";
                this.cash += 80;
                break;

            case 12:
                spMsg = "Take a train to Railway west, for each railway station passed, pay 5€ ticket!";
                if((this.position <= 5) || (this.position < 40)) {
                    this.cash -= 15;
                }else if((this.position) <= 15 && (this.position > 5)) {
                    this.cash -= 10;
                }else if((this.position) <= 25 && (this.position > 15)) {
                    this.cash -= 5;
                }
                this.position = 35;
        }


        speicalMsgPEl.textContent = spMsg;
        updater();
        this.movePlayerOb();

    }  

    /** Name Setter */
    setName(name) {
        this.name = name;
    }
        
}

/** Objects */
const player = [
    new Player("Player One", true, 1500, 0, []),
    new Player("Player Two", true, 1500, 0, []),
    new Player("Player three", true, 1500, 0, []),
    new Player("Player four", true, 1500, 0, []),
    new Player("Player five", true, 1500, 0, []),
] 

const setNameSubmitBtn = document.getElementById("set-name-btn");
const setNameFInputEl = document.getElementById("set-name-f-input");
const setNameSInputEl = document.getElementById("set-name-s-input");

setNameSubmitBtn.addEventListener("click", () => {
  const firstPlayerName = setNameFInputEl.value;
  const secondPlayerName = setNameSInputEl.value;
  setNameFInputEl.value = "";
  setNameSInputEl.value = "";

  player[0].setName(firstPlayerName);
  player[1].setName(secondPlayerName);

  console.log(player[0].name);
  console.log(player[1].name);
});

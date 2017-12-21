function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

generateWinningNumber = function(){
    return Math.floor(Math.random()*100+1);
}

shuffle = function(arr){
    var m = arr.length, i, x;
    while(m) {
        i = Math.floor(Math.random()*m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}


Game.prototype.isLower = function(){
    if (this.playersGuess > this.winningNumber){
        return "Guess lower";
    }
    else if (this.playersGuess == this.winningNumber){
        return "Click reset to play again.";
    }
    else {
        return "Guess higher";
    }
}

Game.prototype.difference = function(){
    if (this.playersGuess > this.winningNumber){
        return this.playersGuess - this.winningNumber;
    }
    else {
        return this.winningNumber - this.playersGuess;
    }
}

Game.prototype.playersGuessSubmission = function(n){
    this.playersGuess = n;
    if (this.playersGuess < 1 || this.playersGuess > 100 || typeof this.playersGuess != 'number'){
        throw "That is an invalid guess.";
    }
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber){
        return "You Win!";
    }
    else if (this.pastGuesses.indexOf(this.playersGuess) >= 0){
        return "You have already guessed that number.";
    }
    else if (this.pastGuesses.length === 4){
        this.pastGuesses.push(this.playersGuess);
        return "You Lose.";
    }
    else if(this.difference() < 10){
        this.pastGuesses.push(this.playersGuess);
        return "You're burning up!";  
    }
    else if(this.difference() < 25){
        this.pastGuesses.push(this.playersGuess);
        return "You're lukewarm.";
    }
    else if(this.difference() < 50){
        this.pastGuesses.push(this.playersGuess);
        return "You're a bit chilly.";
    }
    else {
        this.pastGuesses.push(this.playersGuess);
        return "You're ice cold!";
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var hintArray = [this.winningNumber];
    hintArray.push(generateWinningNumber(), generateWinningNumber());
    return shuffle(hintArray);

}

$(document).ready(function(){
    var currentGame = newGame();

    $("button:contains('Reset')").click(function(){
        currentGame = newGame();
        $('li').text('-');
        $('h1').text('Can You Guess Your Way to the Top?');
        $('h2').text("Guess any number between 1 and 100");
    })
    $("button:contains('Hint')").click(function(){
        $('h1').text("Here's a hint!")
        $('h2').text("The number is one of these: "+currentGame.provideHint());
    })
    function handleGuess(){
        var currentGuess = Number($("#player-input").val());
        $('h1').text(currentGame.playersGuessSubmission(currentGuess))
        $('h2').text(currentGame.isLower())
        $("li:contains('-')").first().text(currentGuess.toString());
        $('input').attr("placeholder", "#").val("");
    }
    $("#guessing").click(handleGuess)
    $('#player-input').keypress(function(event){
        if(event.which == 13){
            handleGuess();            
        }
    })

})

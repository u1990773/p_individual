export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, 1000);
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };
    const default_options = {
        pairs:2,
        difficulty:'normal'
    };
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
    console.log(options);
    var lastCard;
    var pairs = options.pairs;
    var difficulty= options.difficulty;
    var temps;
    var restapunts
    if(options.difficulty=='hard'){
        temps=500;
        restapunts=50;
    }
    else if(options.difficulty=='normal'){
        temps=1000;
        restapunts=25;
    }
    else if(options.difficulty=='easy'){
        temps=5000;
        restapunts=10;
    };
    var points = 100;
    return {
        init: function (call){
            var items = resources.slice(); // Copiem l'array
            items.sort(() => Math.random() - 0.5); // Aleatòria
            items = items.slice(0, pairs); // Agafem els primers
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5); // Aleatòria
            var carta=items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
            carta.forEach(obj => {
                obj.current= obj.front;
                setTimeout(() => {
                    obj.current = back;
                    obj.clickable = true;
                    obj.callback();
                }, temps);
                
            });
            return carta;
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront();
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=restapunts;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        }
    }
}();
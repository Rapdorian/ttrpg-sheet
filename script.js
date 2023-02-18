// TODO: Once we've implemented a save to cookies feature
// we need to put an autoload from cookies here

function save() {
    stats = {};

    function fetch_stat(name) {
        stats[name] = {max: $(`#${name}`).text(), current: $(`#${name}C`).text()};
    }

    fetch_stat("BR");
    fetch_stat("WT");
    fetch_stat("BW");
    fetch_stat("GT");
    fetch_stat("BD");
    fetch_stat("SH");
    fetch_stat("DG");
    fetch_stat("SP");

    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("weapons", JSON.stringify(weapons));
    localStorage.setItem("abilities", JSON.stringify(abilities));
    localStorage.setItem("level", $("#level").text());
}

function load() {
    let stats = JSON.parse(localStorage.getItem("stats"));
    if (stats != null && stats != undefined) {
        for (let stat in stats) {
            $(`#${stat}`).text(stats[stat].max);
            $(`#${stat}C`).text(stats[stat].current);
        }
    }
    if (localStorage.getItem("weapons") != null) {
        weapons = JSON.parse(localStorage.getItem("weapons"));
    }
    if (localStorage.getItem("abilities") != null) {
        abilities = JSON.parse(localStorage.getItem("abilities"));
    }
    if (localStorage.getItem("level") != null) {
        $("#level").text(localStorage.getItem("level"));
    }
    update_weapons();
    update_abilities();

}

var known_weapons = [
    ["Fist", [{dist: '0"', th: "1d10", ws: "BW"}]],
    ["Knife", [
        {dist: '0"', th: "1d10", ws: "BW+2"},
        {dist: 'BW+3"', th: "1d10", ws: "BW+2"},
        ]],
    ["Sword", [{dist: '1"', th: "2d10", ws: "BW+3"}]],
    ["Greatsword", [{dist: '1"', th: "2d10", ws: "BW+4"}]],
    ["Cudgel", [{dist: '0"', th: "1d10", ws: "BW+1"}]],
    ["Club", [
        {dist: '0"', th: "2d10", ws: "BW+3"},
        {dist: 'BW+1"', th: "1d10", ws: "BW+2"},
        ]],
    ["Spear", [
        {dist: '1"', th: "2d10", ws: "BW+2"},
        {dist: 'BW+3"', th: "1d10", ws: "BW+2"},
        ]],
    ["Bow", [
        {dist: '12"', th: "2d10", ws: "5"},
        {dist: '20"', th: "1d10", ws: "5"},
        {dist: '28"', th: "1d10", ws: "4"},
        ]],
    ["Crossbow", [
        {dist: '14"', th: "2d10", ws: "6"},
        {dist: '20"', th: "2d10", ws: "5"},
        {dist: '30"', th: "1d10", ws: "5"},
        ]],
    ["Pistol", [
        {dist: '10"', th: "2d10", ws: "6"},
        {dist: '18"', th: "1d10", ws: "6"},
        ]],
    ["Shotgun", [
        {dist: '8"', th: "3d10", ws: "8"},
        {dist: '18"', th: "1d10", ws: "5"},
        ]],
    ["Rifle", [
        {dist: '12"', th: "2d10", ws: "7"},
        {dist: '24"', th: "2d10", ws: "7"},
        {dist: '36"', th: "1d10", ws: "6"},
        ]],
    ["SMG", [
        {dist: '10"', th: "2d10(x2)", ws: "7"},
        {dist: '20"', th: "1d10(x2)", ws: "6"},
        ]],
];

var weapons = [weapon(known_weapons[0][0], known_weapons[0][1])];

window.onload = function() {
    update_weapons();
    update_abilities();
    load();
};

function update_weapons() {
    $("#weapons").html(weapons.join(""));
}

function show_weapon_menu() {
    let html = "";
    for (let idx in known_weapons) {
        html+=weapon_choice(idx);
    }

    $("#weapons").html(html);
    $("#pick_weapon").text("Cancel");
    $("#pick_weapon").attr("onclick", "cancel_weapon();");
}

function cancel_weapon() {
    update_weapons();
    $("#pick_weapon").text("+");
    $("#pick_weapon").attr("onclick", "show_weapon_menu();");
}

function reset_weapons() {
    weapons=[weapon(known_weapons[0][0], known_weapons[0][1])];
    update_weapons();
}

function d4() {
	return Math.floor(Math.random() * 4) + 1
}

/// Create a weapon html fragment
function weapon(name, ranges) {
    let frag=`<tr><th>${name}</th></tr>`;
    for (let range of ranges) {
        frag+=`<tr><td/><td>${range.dist}</td><td>${range.th}</td><td>${range.ws}</td></tr>`;
    }
    return frag;
}

function choose_weapon(idx) {
    weapons.push(weapon(known_weapons[idx][0], known_weapons[idx][1]));
    cancel_weapon();
}

function weapon_choice(idx) {
    let name = known_weapons[idx][0];
    let ranges = known_weapons[idx][1];
    let frag = `<tbody class="button" onclick="choose_weapon(${idx})">`;
    frag+= `<tr><td>${name}</td><td colspan="3"/></tr>`;
    let first = true;
    for (let range of ranges) {
        frag+=`<tr><td/><td>${range.dist}</td><td>${range.th}</td><td>${range.ws}</td></tr>`;
    }
    frag+=`</tbody>`;
    //frag+='<tr><td colspan="4"><hr/></td></tr>'
    return frag;
}

// roll a stat
function stat(sel, val) {
	// 2d4 drop highest
	let roll = Math.min(d4(), d4())
	if (val != undefined && val !=null) {
	    roll=val;
	}
	$(sel).text(roll)
	$(sel+"C").text(roll)
	return roll;
}

function body(name) {
    switch (name) {
        case "head":
            return ["BR", "WT"];
        case "body":
            return ["BW", "GT"];
        case "arms":
            return ["BD", "SH"];
        case "legs":
            return ["DG", "SP"];
    }
}

function damage(sel) {
    let stats = null;
    if (sel==undefined) {
        stats = body($("#damage_select").val());
    }else{
        stats = body(sel);
    }
    for (let stat of stats) {
        $("#"+stat+"C").text(Number($("#"+stat+"C").text())-1)
    }
}

function heal(sel) {
    let stats = null;
    if (sel == undefined) {
        stats = body($("#heal_select").val());
    }else {
        stats = body(sel);
    }
    for (let stat of stats) {
        let cur = Number($("#"+stat+"C").text())
        let max = Number($("#"+stat).text())
        if (cur < max) {
            $("#"+stat+"C").text(cur+1)
        }
    }
}

function level(sel, amt) {
    if (amt == undefined) {
      amt = 1;
    }
    // increase stat by 1 level
    let choice = null;
    if (sel == undefined) {
        choice = $("#level_select").val();
    }else {
        choice = sel;
    }
    
    let max = Number($("#"+choice).text());
    let cur = Number($("#"+choice+"C").text());
    $("#"+choice).text(max+amt);
    $("#level").text(Number($("#level").text()) + amt);
    // only increase current HP if no damage is taken
    if (max === cur) {
        $("#"+choice+"C").text(cur+amt);
    }
}

function new_char() {
    $("#level").text(-18);
    
    
	stat("#BR",0);
	stat("#WT",0);
	stat("#BW",0);
	stat("#GT",0);
	stat("#BD",0);
	stat("#SH",0); 
	stat("#DG",0);
	stat("#SP",0);
	
	abilities=[];
	weapons=[];
	choose_weapon(0);
	update_abilities();
}

// roll all stats
function roll_char() {
    let level = -18;
	level+=stat("#BR");
	level+=stat("#WT");
	level+=stat("#BW");
	level+=stat("#GT");
	level+=stat("#BD");
	level+=stat("#SH");
	level+=stat("#DG");
	level+=stat("#SP");
	
    $("#level").text(level);
	
	abilities=[];
	weapons=[];
	choose_weapon(0);
	update_abilities();
	
}

// ------- Abilities ---------
// Here we are going to define a bunch of abilities and provide a method of 
// selecting them


var classes = {
    fighter: [
        { name: "Ambidextrous",
            cost: 4,
            desc: "You have practiced with your weapons to the point that you are proficient enough to use one in each hand. You may use 2 attacks with one handed weapons per turn.",
        },
        { name: "Expert Fighter",
            cost: 2,
            desc: "You have learned to be precise with your strikes and can control where you wound your opponent. You may roll +1d10 when determining a hit location choosing whichever die you feel is more favorable.</br>This ability may be taken more than once.",
        },
        { name: "Blade Master",
            cost: 2,
            desc: "You are adept at using flashy twirls and spins with your blade to confuse your opponent. You gain +1d10 to your attack rolls with swords."
        },
        { name: "Trained Offence",
            cost: 4,
            desc: "You have spent long hours practicing your fencing follow up attacks. You get one extra close combat attack with swords and knives",        
        },
        { name: "Light Strikes",
            cost: 4,
            desc: "You keep your sword moving lightly causing many small wounds on your opponent. You strike three times in melee at -2 Weapon strength. All strike mut be at the same target."
        },
    ],
    archer: [
        { name: "Deadeye",
            cost: 2,
            desc: "You are an expert marksman and know how to shoot accurately. You may roll +1d10 when determining a hit location choosing whichever die you feel is more favorable.</br>This ability may be taken more than once."
        },
        {name: "Swift Reload",
            cost: 4,
            desc: "You have drilled reloading your weapon to the point that you can do it without thinking. You may reload two weapons per turn or reload and take bonus action",
        },
        {name: "Keen Aim",
            cost: 2,
            desc: "You have practiced with your weapon of choice and get +1d10 to ranged attacks.",
        },
        {name: "Double Shot",
            cost: 3,
            desc: "You have found a clever way to load your weapon twice and shoot two projectiles. If your weapon has been loaded twice it can do twice the normal number of hits.",
        },
    ],
    thief: [
        { name: "Lockpicking",
            cost: 2,
            desc: "You have learned to manipulate the intricate nature of a lock. When attempting to pick a lock you have +1d10. <br/> This ability may be taken more than once.",
        },
        { name: "Deception",
            cost: 5,
            desc: "Fast-talkers, sympathetic characters, and seductresses are adept at making others believe them even to their advantage. You may attempt to deceive another character. If you win an opposed WITS test, then until your next turn the deceived character will try to help you.",
        },
        { name: "Reflexive Reaction",
            cost: 3,
            desc: "You can sense your opponents next move. You may take an opposed WITS test with any opponent within 10\" at any point before the opponent activates. If you win, you may activate before your opponent",
        },
        { name: "Camouflage",
            cost: 2,
            desc: "You know how to use the terrain to hide yourself. If you are prone or have not moved more than 1\" during your last activation your have +1d10 to avoid being hit",
        },
        { name: "Observant",
            cost: 2,
            desc: "You have honed your sense of situational awareness. You may take a WITS test to detect unnatural influences in environments your are familiar with. You also gain +1d10 when attempting to spot hidden characters and objects.",
        },
        { name: "Stalking",
            cost: 5,
            desc: "You can avoid being watched and silently track your target. On a successful opposed WITS test you are hidden. Others may attempt to locate you must pass a WITS stat test. While stalking you move at -1 SPEED.<br/><br/>When hidden you are denoted with two face down tokens, one of which is marked on its face side. The controlling player can move all tokens simultaneously. This character can add additional false tokens by passing another opposed BRAINS test.",
        }
    ],
    assassin: [
        { name: "Knife Thrower",
            cost: 3,
            desc: "You are an excellent knife fighter. You prefer the silence of a blade and can throw it with great accuracy. You may use your BLADE stat for any ranged combat attack with a knife.",
        },
        { name: "Backstab",
            cost: 3,
            desc: "You have learned to creep up on a target from behind to strike quickly. If you attack an opponent from behind you get +1 Weapon Strength and can roll +1d10 when determining a hit location choosing whichever die you feel is more favorable.",
        },
        { name: "Poison",
            cost: 3,
            desc: "You have developed a familiarity with various poisons. You can poison an item with a successful BRAINS check. When affected by poison a character must pass a BRAWN check or take a wound. This effect lasts 3 turns.",
        },
        { name: "Concealed Weapon",
            cost: 2,
            desc: "You have learned to conceal weapons about your person. When you are attacked in combat and have not already activated, you may attack before your opponent.",
        },
    ],
    duelist: [
        { name: "Feint",
            cost: 1 ,
            desc: "you have trained extensively in the fine art of the counterattack. If you defend an attack by more than 5 the attacker takes a wound.",
        },
        { name: "Stalwart Defender",
            cost: 1,
            desc: "You never yield ground even under pressure. You may take a GUTS stat test to attempt to not be forced to move after an attack."
        },
        { name: "Rush Attack",
            cost: 1,
            desc: "You can strike in close combat and continue your movement",
        },
        { name: "Pushback",
            cost: 1,
            desc: "You can push an opposing character back up to 1\" if you score a melee hit on them.",
        },
        { name: "Drawback",
            cost: 1,
            desc: "If you score a hit in melee, you can retreat 1\"."
        },
        { name: "Turnabout",
            cost: 1,
            desc: "If you score a hit in melee, you can swap places with the opposing character"
        },
        { name: "Repulse",
            cost: 1,
            desc: "If this character avoids a hit in melee, you can push the attacker back up to 1\"",
        },
    ],
    monk: [
        { name: "Brawler",
            cost: 2,
            desc: "You prefer to get your hands dirty and pummel your opponents bare handed. You get +1d10 and +1 Weapon Strength when using your fists.",
        },
        { name: "Flurry of Blows",
            cost: 3,
            desc: "You are skilled in close combat and able to strike repeatedly. You recieve +1 close combat attack with non-bladed weapons. This can be taken up multiple times",
        },
        { name: "Iron Will",
            cost: 3,
            desc: "You can force yourself to shake off the effects of wounds. By passing a GUTS stat test, your ability scores never drop below 0.",
        },
        { name: "Battle Cry",
            cost: 2,
            desc: "You let out a terrifying scream when charging into combat. Any opponent charged by a you must take a GUTS stat test or withdraw from combat and receive -1d10 to this attack.",
        },
        { name: "Frenzy",
            cost: 4,
            desc: "You can work yourself into a fighting frenzy ignoring all else in favor of the bloodlust. By spending an action the model becomes Frenzied.<br/>When Frenzied you:<br/> - Ignore all GUTS checks<br/> - Can only run, charge, and attack <br/> - +2 Weapon Strength",
        },
        { name: "Intimidate",
            cost: 3,
            desc: "You cause enemies to hesitate in fear. Any opponent within 6\" must take a GUTS stat test or be unable to act against you.",
        },
        { name: "Mighty Cleave",
            cost: 5,
            desc: "You are strong enough to hack through opponents and hit someone behind them. You may attack all models within reach of your primary weapon with a single action. For each attack that fails to hit you suffer -1 To hit the next opponent. Mighty Cleave can only be used with bladed weapons",
        },
    ],
    sage: [
        { name: "Polymath",
            cost: 3,
            desc: "You have been around enough to pick up on bits and pieces of many skills. You may attempt to use Arcane Studies, Healer, and Language without possesing the skills. However you must make all tests for the skill with a BRAINS score of 1",
        },
        { name: "Healer",
            cost: 2,
            desc: "You are skilled at healing your friends. You may attempt to heal someone with a successful BRAINS stat test. If taken more than once you have +1d10 on your attempt. This may only be taken twice",
        },
        { name: "Language",
            cost: 3,
            desc: "You have learned many different languages, both those alive and long dead. When deciphering a language you do not know you may attempt a BRAINS stat test to decipher it correctly.",
        },
        { name: "Arcane Studies",
            cost: 6,
            desc: "You have studied the fine points of magic. You may use magic you find by passing a BRAINS test."
        },
    ],
    noble: [
        { name: "Inspiring",
            cost: 3,
            desc: "You know just the right things to say to inspire others to greatness. If you are within 3\" you may attempt to inspire someone by making a WITS test. An inspired character can add 1d10 to a future roll, this effect does not stack.",
        },
        { name: "Minions",
            cost: 5,
            desc: "You can withhold deploying any characters under your control until you use this ability. On a successful BRAINS stat test you can deploy any number of other characters you control within 3\" of yourself. They cannot be deployed within 1\" of an opponent.",
        },
        { name: "Voice of Command",
            cost: 4,
            desc: "You bellow out orders that can be heard over the din of battle. If you have not activated this turn you may trade activation with any friendly character in line of sight for free. Addionally once per turn, you may steal a friendly characters activation on an opposed BRAINS check.",
        },
    ],
};

var selected_class = Object.keys(classes)[0];
var known_abilities = classes[selected_class];

var abilities = [];

function update_abilities() {
    $("#abilities").html("");
    $("#abilities").html(abilities.join(""));
}

function choose_ability(idx) {
    abilities.push(render_ability(idx, false, abilities.length));
    $("#level").text(known_abilities[idx].cost + Number($("#level").text()))
    cancel_ability();
}

function remove_ability(idx, cost) {
    abilities.splice(idx, 1);
    $("#level").text(Number($("#level").text()) - cost)
    update_abilities();
}

// TODO: This should handle different classes
function pick_ability() {
    let html = "<div style='position: static' class='rpgui-container framed-golden-2'>";
    html+=tab_bar();
    for (let idx in known_abilities) {
        html+=render_ability(idx, true);
    }
    html+="</div>";
    $("#abilities").html(html);
    $("#ability_pick").attr("onclick", "cancel_ability();");
    $("#ability_pick").text("Canel");
}

function cancel_ability(){
    $("#ability_pick").text("+");
    $("#ability_pick").attr("onclick", "pick_ability();");
    update_abilities();
}

function choose_class(name) {
    known_abilities = classes[name.toLowerCase()];
    selected_class = name.toLowerCase();
    pick_ability();
}

function tab(name, pressed) {
    let style = "rpgui-button";
    if (pressed) {
        style += " down";
    }
    return`<button id="${name.toLowerCase()}" class="${style}" onclick="choose_class('${name}');"> ${name} </button>`;
}

function tab_bar() {
    let html = "<div class='horizontal' style='overflow-x: auto;'>";
    for (let idx in classes) {
        let name = idx
            .replace(/^([A-z])/, (_, c) => c.toUpperCase())
            .replace(/_([A-z])/g, (_,c) => ` ${c.toUpperCase()}`);
        if (idx == selected_class) {
            html+=tab(name, true);
        }else{
            html+=tab(name);
        }
    }
    html+='</div>';
    return html;
}

function render_ability(idx, choice, pos) {
    let ability = known_abilities[idx];
    let trash = "";
    let button = "";
    let cost = "";
    if (!choice) {
        trash = `<a onclick="remove_ability(${pos}, ${ability.cost})";> &#128465; </a>`;
    }else{
        button=`class="button" onclick="choose_ability(${idx});"`;
        cost=`${ability.cost} XP`;
    }
    return `
    <div ${button}>
        <h1> ${ability.name} ${trash}</h1>
        ${cost}
        <p> ${ability.desc} </p>
    </div>
    `;
}

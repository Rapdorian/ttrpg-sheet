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
    console.log(frag);
    //frag+='<tr><td colspan="4"><hr/></td></tr>'
    return frag;
}

// roll a stat
function stat(sel) {
	// 2d4 drop highest
	let roll = Math.min(d4(), d4())
	$(sel).text(roll)
	$(sel+"C").text(roll)
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

function level(sel) {
    console.log(sel)
    // increase stat by 1 level
    let choice = null;
    if (sel == undefined) {
        choice = $("#level_select").val();
    }else {
        choice = sel;
    }
    console.log(choice);
    
    let max = Number($("#"+choice).text());
    let cur = Number($("#"+choice+"C").text());
    $("#"+choice).text(max+1);
    $("#level").text(Number($("#level").text()) + 1);
    // only increase current HP if no damage is taken
    if (max === cur) {
        $("#"+choice+"C").text(cur+1);
    }
}

// roll all stats
function roll_char() {
    $("#level").text("0");
	stat("#BR")
	stat("#WT")
	stat("#BW")
	stat("#GT")
	stat("#BD")
	stat("#SH")
	stat("#DG")
	stat("#SP")
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
            cost: 2,
            desc: "You have practiced with your weapons to the point that you are proficient enough to use one in each hand. You may use 2 attacks with one handed weapons per turn.",
        },
        { name: "Expert Fighter",
            cost: 1,
            desc: "You have learned to be precise with your strikes and can control where you wound your opponent. You may roll +1d10 when determining a hit location choosing whichever die you feel is more favorable.</br>This ability may be taken more than once.",
        },
        { name: "Blade Master",
            cost: 4,
            desc: "You are adept at using flashy twirls and spins with your blade to confuse your opponent. You gain +1d10 to your attack rolls with swords."
        },
    ],
    rouge: [],
    duelist: [],
    monk: [],
    sage: [],
    noble: [],
};

var selected_class = Object.keys(classes)[0];
var known_abilities = classes[selected_class];

var abilities = [];

function update_abilities() {
    $("#abilities").html(abilities.join(""));
}

function choose_ability(idx) {
    abilities.push(render_ability(idx, false, abilities.length));
    $("#level").text(known_abilities[idx].cost + Number($("#level").text()))
    cancel_ability();
}

function remove_ability(idx) {
    abilities.splice(idx, 1);
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
        //trash = `<a onclick="remove_ability(${pos})";> &#128465; </a>`;
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

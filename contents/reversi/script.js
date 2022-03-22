var turn = "white";

// コマを置く
function set(row, col, color) {
    let id = row + "," + col;
    let cell = document.getElementById(id);
    if (cell.hasChildNodes() == false) {
        disk = document.createElement("div");
        if (color == "white") {
            // 白い面のコマを置く
            disk.className = "white";
            cell.appendChild(disk);
        } 
        else if (color == "black") {
            // 黒い面のコマを置く
            disk.className = "black";
            cell.appendChild(disk);
        }
        disk.addEventListener("animationend", function (event) {
            if (event.target.classList.contains("flip")) {
                event.target.classList.remove("flip");
            }
        });
    }
    else {
        let disk = cell.firstElementChild;
        if (color == "white") {
            // 白い面のコマを置く
            disk.className = "white";
        } 
        else if (color == "black") {
            // 黒い面のコマを置く
            disk.className = "black";
        }
    }
    
}
// コマを取り除く
function unset(row, col) {
    let id = row + "," + col;
    let cell = document.getElementById(id);
    if (cell.hasChildNodes() == true) {
        cell.removeChild(cell.firstElementChild);
    }
}
// 裏返すことができるコマのリストを返す
function get_flippable_list(row, col, color_flipper) {
    let flippable_list = [];
    let cell = document.getElementById(row + "," + col);
    if (cell.hasChildNodes() == true) {
        return [];
    }
    else {
        for (let dy = -1; dy < 2; dy++) {
            for (let dx = -1; dx < 2; dx++) {
                for (let i = 1; i < 8; i++) {
                    // 範囲外を参照した場合はループ離脱
                    if (row + dy * i < 0 || row + dy * i > 7) break;
                    if (col + dx * i < 0 || col + dx * i > 7) break;
                    cell = document.getElementById((row + dy * i) + "," + (col + dx * i));
                    // 何も置かれていないマスを参照した場合もループ離脱
                    if (cell.childElementCount == 0) break;
                    // 置いたコマと同じ色のコマがある場合、その間にあるコマをflippable_listに登録してループ離脱
                    if (cell.firstElementChild.classList.contains(color_flipper)) {
                        for (let j = i - 1; j > 0; j--) {
                            flippable_list.push([row + dy * j, col + dx * j]);
                        }
                        break;
                    }
                }
            }
        }
    }
    return flippable_list;
}
// コマを置くことができるタイルをハイライト表示する
function highlight_puttable(event) {
    // idから
    let coord_str = this.id.split(",");
    let row = Number(coord_str[0]);
    let col = Number(coord_str[1]);
    let flippable = get_flippable_list(row, col, turn);
    if (flippable.length > 0) {
        this.className = "puttable";
    }
}
// コマを置いて、裏返せるコマを裏返す
function put_and_flip(event) {    
    // 裏返すことのできるコマがあれば裏返す
    let coord_str = this.id.split(",");
    let row = Number(coord_str[0]);
    let col = Number(coord_str[1]);
    let flippable = get_flippable_list(row, col, turn);
    if (flippable.length > 0) {
        flippable.forEach(element => flip(element[0], element[1]));
        set(row, col, turn);
        // window.setTimeout(change_turn, 500);
        change_turn();
    }
}
// コマを裏返す
function flip(row, col) {
    let cell = document.getElementById(row + "," + col);
    let disk = cell.firstElementChild;
    if (disk.classList.contains("white")) disk.className = "black flip";
    else disk.className = "white flip";
}

function reset_style() {
    this.classList.remove("puttable");
}
function onload() {
    generate_board();
    let prompt = document.getElementById("prompt");
    prompt.textContent = "白色の手番です";
}
function generate_board() {
    // ゲーム盤を用意する
    let brd_body = document.createElement("tbody");
    for (var i = 0; i < 8; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 8; j++) {
            let cell = document.createElement("td");
            cell.id = i + "," + j;
            cell.onmouseover = highlight_puttable;
            cell.onmouseleave = reset_style;
            cell.onclick = put_and_flip;
            row.appendChild(cell);
        }
        brd_body.appendChild(row);
    }
    let board = document.createElement("table");
    board.appendChild(brd_body);

    // 本体のページにゲーム盤を追加する
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(board);
}

function reset_board() {
    // 盤面をリセットする
    for (let i = 0; i < 64; i++) {
        unset(Math.floor(i / 8), i % 8);
    }
    set(3, 3, "white");
    set(4, 4, "white");
    set(3, 4, "black");
    set(4, 3, "black");
}
function change_turn() {
    let prompt = document.getElementById("prompt");
    if (turn == "white") {
        turn = "black";
        prompt.textContent = "黒色の手番です";
    }
    else {
        turn = "white";
        prompt.textContent = "白色の手番です";
    }
}
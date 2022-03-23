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
        // アニメーション終了時に自動で「裏返し中」フラグを折る
        // このイベントハンドラ用意した人絶対にオセロ作ってたでしょ
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
// 色を取得する
function get(row, col) {
    let id = row + "," + col;
    let cell = document.getElementById(id);
    if (cell.hasChildNodes() == false) return "None";
    else {
        let color = cell.firstElementChild.classList;
        if (color.contains("white")) return "white";
        if (color.contains("black")) return "black";
        else {
            console.log("Huh?");
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
// コマを置くことができるタイルを常に強調表示する
function highlight_puttable2(color_flipper) {
    let puttable_list = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let id = i + "," + j;
            let cell = document.getElementById(id);
            let flippable = get_flippable_list(i, j, color_flipper);
            if (flippable.length > 0) {
                puttable_list.push(flippable);
                cell.className = "puttable";
            } else {
                cell.classList.remove("puttable");
            }
        }
    }
    // console.log(puttable_list);
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
// コマの数を数える
function count_disk(color) {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (get(i, j) == color) count++;
        }
    }
    return count;
}
function reset_style() {
    this.classList.remove("puttable");
}
function onload() {
    generate_board();
    reset_board();
}
function generate_board() {
    // ゲーム盤を用意する
    let brd_body = document.createElement("tbody");
    for (var i = 0; i < 8; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 8; j++) {
            let cell = document.createElement("td");
            cell.id = i + "," + j;
            cell.onclick = put_and_flip;
            row.appendChild(cell);
        }
        brd_body.appendChild(row);
    }
    let board = document.createElement("table");
    board.appendChild(brd_body);
    board.className = "center"

    // 本体のページにゲーム盤を追加する
    let body = document.getElementById("game");
    body.appendChild(board);
}

function reset_board() {
    // 盤面をリセットする
    for (let i = 0; i < 64; i++) {
        unset(Math.floor(i / 8), i % 8);
    }
    turn = "white";
    set(3, 3, "white");
    set(4, 4, "white");
    set(3, 4, "black");
    set(4, 3, "black");
    highlight_puttable2(turn);
}
// ターンを進める
function change_turn() {
    if (turn == "white") {
        turn = "black";
    }
    else {
        turn = "white";
    }
    highlight_puttable2(turn);
    let count_white = count_disk("white");
    let count_black = count_disk("black");
    document.getElementById("count-white").textContent = "白 : " + count_white;
    document.getElementById("count-black").textContent = "黒 : " + count_black;
}
// flask使用js

const newchara = document.getElementById("newchara");
const newinput = document.getElementById("newinput");
const closeBtn = document.getElementById("close-newinput");

newchara.addEventListener("click", function() {
  newinput.classList.remove("erase");
  newinput.classList.add("show");
});

closeBtn.addEventListener("click", function() {
  newinput.classList.add("erase");
  newinput.classList.remove("show");
});

document.addEventListener("mousedown", function(e) {
  if (
    newinput.classList.contains("show") &&
    !newinput.contains(e.target) &&
    e.target !== newchara
  ) {
    newinput.classList.add("erase");
    newinput.classList.remove("show");
  }
});

fetchCharacters(); 
//検索ボックスの入力イベント
document.getElementById("searchbtn").addEventListener("click", async function() {
  const query = document.getElementById("searchbox").value.trim().toLowerCase();
  const response = await fetch("http://127.0.0.1:5000/get_characters");
  const characters = await response.json();
  const filtered = characters.filter(chara =>
    chara.name.toLowerCase().includes(query)
  );
  const charaList = document.getElementById("charalist");
  charaList.innerHTML = "";
  const ul = document.createElement("ul");
  filtered.forEach(chara => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="characard">
        <button class="delete-chara btn" type="button">&times;</button>
        <a href="#">
          <p class="chara-name">${chara.name}</p>
          <p class="chara-sys">${chara.system}</p>
        </a>
      </div>
    `;
    ul.appendChild(li);
  });
  charaList.appendChild(ul);
});

//systemのセレクトボックスの変更イベント
document.getElementById("system").addEventListener("change", async function() {
  const selectedSystem = this.value;
  if (selectedSystem != "all") {
  const response = await fetch("http://127.0.0.1:5000/get_characters");
  const characters = await response.json();
  
  const filtered = selectedSystem
    ? characters.filter(chara => chara.system === selectedSystem)
    : characters;
  const charaList = document.getElementById("charalist");
  charaList.innerHTML = "";
  const ul = document.createElement("ul");
  filtered.forEach(chara => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="characard">
        <button class="delete-chara btn" type="button">&times;</button>
        <a href="#">
          <p class="chara-name">${chara.name}</p>
          <p class="chara-sys">${chara.system}</p>
        </a>
      </div>
    `;
    ul.appendChild(li);
  });
  charaList.appendChild(ul);
  }else {
    fetchCharacters();  // "all"が選択された場合は全キャラを表示
  }
});

//キャラの削除
document.getElementById("charalist").addEventListener("click", async function(e) {
    if (e.target.classList.contains("delete-chara")) {

    const charaCard = e.target.closest(".characard");
    const nameElem = charaCard.querySelector(".chara-name");
    const charaName = nameElem ? nameElem.textContent : null;
    if (charaName && confirm(`「${charaName}」を削除しますか？`)) {
      await fetch("http://127.0.0.1:5000/delete_character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: charaName })
      });
      fetchCharacters();
    }
  }
});

//以下、API部分

async function fetchCharacters() {
    const response = await fetch("http://127.0.0.1:5000/get_characters"); 
    const characters = await response.json();  // APIからデータを取得しJSONに変換
    
    const charaList = document.getElementById("charalist");
    charaList.innerHTML = "";  // 既存のリストをクリア

    const ul = document.createElement("ul");
    characters.forEach(chara => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="characard">
                <button class="delete-chara btn" type="button">&times;</button>
                <a href="#">
                    <p class="chara-name">${chara.name}</p>
                    <p class="chara-sys">${chara.system}</p>
                </a>
            </div>
        `;
        ul.appendChild(li);
    });
    charaList.appendChild(ul);  // リストを更新
}

document.getElementById("create").addEventListener("click", async function() {
    const inputText = document.getElementById("inputarea").value.trim();
    // 入力が空でない場合のみキャラクターを追加
    if (inputText) {
      const charaData = JSON.parse(inputText);

      charaData.name = replace_name(charaData);  // 名前を()なしに変換
      charaData.system = get_system();  // システムを取得

      await fetch("http://127.0.0.1:5000/add_character", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(charaData),  // 追加するキャラクターのデータをJSON形式で送信
      });

      fetchCharacters();  // 更新

      document.getElementById("inputarea").value = "";  // 入力エリアをクリア
      console.log("キャラを追加したよ");  // デバッグ用
      newinput.classList.add("erase");
      newinput.classList.remove("show");
      
      saveCharacters(charaData);  // キャラクターを保存
      console.log("キャラを保存したよ");  // デバッグ用 
    }
});

async function saveCharacters(characters) {
  await fetch("http://127.0.0.1:5000/save_characters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(characters)
  });
}

// jsonを入れるとnameを()なしに変換
function replace_name(name) {   
    const nameWithParens = name.data.name;
    const charaNameNoParens = nameWithParens.replace(/\s*\(.*?\)/g, "");
    return charaNameNoParens.split("\n")[0] || "名無しのキャラ";
}

//　キャラのシステムを取得
function get_system(){
    const system = document.getElementById("newchara-system").value;
    return system; 
}

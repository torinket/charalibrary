const newchara = document.getElementById("newchara");
const newinput = document.getElementById("newinput");
const closeBtn = document.getElementById("close-newinput");
const charadata = JSON.parse(localStorage.getItem("charadata") || "[]");

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

//新キャラ作成時の処理
create.addEventListener("click", function() {
  const inputarea = document.getElementById("inputarea");
  const inputValue = inputarea.value;

  if (!inputValue) {
    inputarea.placeholder = "空白だよぉ...";
    return;
  }
  
  try {
    JSON.parse(inputValue);
  } catch (e) {
    inputarea.value = "";
    inputarea.placeholder = "ココフォリア形式じゃないかもぉ...";
    return;
  }
  const jsondata = JSON.parse(inputValue);

  const newcharasystem = document.getElementById("newchara-system").value;
  jsondata.system = newcharasystem;

  let charadata = JSON.parse(localStorage.getItem("charadata") || "[]");
  charadata.push(jsondata);
  localStorage.setItem("charadata", JSON.stringify(charadata));

  make_list(charadata);

  inputarea.value = ""; 
  newinput.classList.add("erase");
  newinput.classList.remove("show");
  }
)

// キャラリストの削除ボタンのイベント
document.getElementById("charalist").addEventListener("click", function(e) {
  if (e.target.classList.contains("delete-chara")) {
    const charaCard = e.target.closest(".characard");
    const charaName = charaCard.querySelector(".chara-name").textContent;
    
    let charadata = JSON.parse(localStorage.getItem("charadata") || "[]");
    charadata = charadata.filter(chara => {
      // chara.data.name で一致するキャラのみ削除
      const name = chara.data ? chara.data.name : chara.name;
      // 表示名から括弧を除去して比較
      const displayName = name ? name.replace(/\s*\(.*?\)/g, "") : "";
      return displayName !== charaName;
    });
    
    localStorage.setItem("charadata", JSON.stringify(charadata));
    make_list(charadata);
  }
});

document.getElementById("system").addEventListener("change", function(e) {
  const selectedSystem = e.target.value;
  let charadata = JSON.parse(localStorage.getItem("charadata") || "[]");
  if (selectedSystem !== "all") {
    charadata = charadata.filter(chara => (chara.system || "システムなし") === selectedSystem);
  }
  make_list(charadata);
});

// 名前検索機能
document.getElementById("searchbtn").addEventListener("click", function() {
  const searchbox = document.getElementById("searchbox");
  const keyword = searchbox.value.trim();
  let charadata = JSON.parse(localStorage.getItem("charadata") || "[]");
  if (keyword) {
    charadata = charadata.filter(chara => {
      const name = (chara.data && chara.data.name) ? chara.data.name.replace(/\s*\(.*?\)/g, "") : "";
      return name.includes(keyword);
    });
  }
  make_list(charadata);
});

// 引数のjsonからキャラリスト作る関数
function make_list(charadata) {
  const charaList = document.getElementById("charalist");
  charaList.innerHTML = "";
  
  const ul = document.createElement("ul");
  charadata.forEach(chara => {
    const li = document.createElement("li");

    let name = chara.data.name || "名前なし";
    const system = chara.system || "システムなし";

    name = name.replace(/\s*\(.*?\)/g, "");

    li.innerHTML = `
      <div class="characard">
        <button class="delete-chara btn" type="button">&times;</button>
        <a href="#">
          <p class="chara-name">${name}</p>
          <p class="chara-sys">${system}</p>
        </a>
      </div>
    `;
    ul.appendChild(li);
  });
  charaList.appendChild(ul);
};

//初期実行関数書き場所
make_list(charadata);
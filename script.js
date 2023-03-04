var uid = new ShortUniqueId();

const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const textArea = document.querySelector(".text-area-color-cont");
const textAreaTask = document.querySelector(".text-area-cont");
const plusBtn = document.querySelector(".fa-plus");
const removeBtn = document.querySelector(".fa-xmark");
const mainCont = document.querySelector(".main-cont");
const allPriColor = document.querySelectorAll(".priority-color");
const toolBoxColors = document.querySelectorAll(".toolbox-color>*")
// const colors = [allPriColor];
const colors = ["pink", "yellow", "brown", "blue"];
let modalPriorityColor = colors[colors.length -1];
let ticketArr = [];
var isModalPresent = false;
// var isTextAreaPresent = false;
// let modalPriorityColor = "";
addBtn.addEventListener("click", function () {
  if (!isModalPresent) {
    modalCont.style.display = "flex";
    textArea.style.display = "flex";
    console.log("Present");
  } else if (isModalPresent) {
    modalCont.style.display = "none";
    textArea.style.display = "none";
    console.log("notPresent");
  }
  isModalPresent = !isModalPresent;
  // isTextAreaPresent = !isTextAreaPresent;
});

var isPlusBtnPresent = false;

plusBtn.addEventListener("click", function () {
  if (!isPlusBtnPresent) {
    console.log("plusPresent");
    plusBtn.style.color = "red";
  } else if (isPlusBtnPresent) {
    plusBtn.style.color = "white";
  }
  isPlusBtnPresent = !isPlusBtnPresent;
});

var isRemoveBtnPresent = false;
removeBtn.addEventListener("click", function () {
  if (!isRemoveBtnPresent) {
    removeBtn.style.color = "red";
  } else if (isRemoveBtnPresent) {
    removeBtn.style.color = "white";
  }
  isRemoveBtnPresent = !isRemoveBtnPresent;
});

modalCont.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    createTicket(modalPriorityColor, textAreaTask.value);
    modalCont.style.display = "none";
    isModalPresent = "false";
    textAreaTask.value = "";
  }
});

function createTicket(ticketColor, data, ticketId) {
  let id = ticketId || uid();
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
    <div class ="ticket-color ${ticketColor}"></div>
    <div class ="ticket-id"> ${id}</div>
    <div class ="task-area">${data}</div>
    <div class ="ticket-lock">
    <i class="fa-solid fa-lock"></i>
       </div>
    `;
  mainCont.appendChild(ticketCont);

  if (!ticketId) {
    ticketArr.push({
      ticketId: id,
      ticketColor,
      ticketTask: data,
    });
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
  }
  handleLock(ticketCont, id);
  handleRemoval(ticketCont, id);
  handlePriorityColor(ticketCont, id);
  // console.log(ticketArr);
}
const unlock = "fa-lock-open";
function handleLock(ticketCont, id) {
  let lockBtn = ticketCont.querySelector(".ticket-lock");
  let lock = lockBtn.children[0].classList[1];
  let ticketTaskArea = ticketCont.querySelector(".task-area");

  lockBtn.addEventListener("click", function () {
    if (lockBtn.children[0].classList.contains(lock)) {
      lockBtn.children[0].classList.remove(lock);
      lockBtn.children[0].classList.add(unlock);
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else if (lockBtn.children[0].classList.contains(unlock)) {
      lockBtn.children[0].classList.add(lock);
      lockBtn.children[0].classList.remove(unlock);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
    let idx = getTicketIdx(id);
      ticketArr[idx].ticketTask = ticketTaskArea.textContent;
      localStorage.setItem("tickets", JSON.stringify(ticketArr));
  });
}

if (localStorage.getItem("tickets")) {
  ticketArr = JSON.parse(localStorage.getItem("tickets"));
  ticketArr.forEach((ticketObj) =>
    createTicket(
      ticketObj.ticketColor,
      ticketObj.ticketTask,
      ticketObj.ticketId
    )
  );
}

allPriColor.forEach((colorElement) => {
  colorElement.addEventListener("click", function () {
    allPriColor.forEach((el) => {
      el.classList.remove("active");
    });
    colorElement.classList.add("active");
    modalPriorityColor  = colorElement.classList[0];
  })
})

function handleRemoval(ticketCont, id) {
  ticketCont.addEventListener("click", function() {
    if(!isRemoveBtnPresent) return;
    let idx = getTicketIdx(id);
    ticketArr.splice(idx, 1);
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
    ticketCont.remove();
  });
}

function getTicketIdx(id) {
  let idx = ticketArr.findIndex(ticketObj => {
    return ticketObj.ticketId == id
  })
  return idx;
}

function handlePriorityColor(ticketCont, id) {
    let ticketColor = ticketCont.querySelector(".ticket-color");
    ticketColor.addEventListener("click", function() {
      let currTicketColor = ticketColor.classList[1];
      let currTicketColorIndex = colors.indexOf(currTicketColor);
      let newTicketColorIdx = (currTicketColorIndex + 1) % colors.length;
      let newTicketColor = colors[newTicketColorIdx];
      ticketColor.classList.remove(currTicketColor);
      ticketColor.classList.add(newTicketColor);

      let idx = getTicketIdx(id);
      ticketArr[idx].ticketColor = newTicketColor;
      localStorage.setItem("tickets", JSON.stringify(ticketArr));
    });
}

for(let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", function () {
    let currColor = toolBoxColors[i].classList[0];
    let filterTicket = ticketArr.filter(
      (ticketObj) => ticketObj.ticketColor == currColor
    );

    let allTickets = document.querySelectorAll(".ticket-cont")
    allTickets.forEach((ticket) => ticket.remove());

    filterTicket.forEach((ticket) =>
    createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId)

    );

  });

  toolBoxColors[i].addEventListener("dblclick" , function () {
    let allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach((ticket) => ticket.remove());
   ticketArr.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
    
  })
}

const tasks = [
  { name: "Wash Car", price: 10 },
  { name: "Mow Lawn", price: 20 },
  { name: "Pull Weeds", price: 30 },
];
const invoiceBody = document.getElementsByClassName("invoice__body")[0];
const totalSpan = document.getElementById("total");
let total = 0;

function addTask(div, task, price) {
  const id = `task-${task.toLowerCase().split(" ").join("-")}`;
  if (!document.getElementById(id)) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.id = id;
    const removeButton = document.createElement("button");
    removeButton.append("Remove");
    removeButton.id = `remove-${id}`;
    removeButton.addEventListener("click", () => removeTask(taskDiv, price));
    const taskName = document.createElement("p");
    taskName.className = "task__name";
    taskName.append(`${task}`);
    taskName.append(removeButton);
    const taskPrice = document.createElement("p");
    taskPrice.className = "task__price";
    taskPrice.innerHTML = `<span>$</span>${price}`;
    taskDiv.append(taskName);
    taskDiv.append(taskPrice);
    div.append(taskDiv);
    updateTotal(total + price);
  }
}

function removeTask(task, price) {
  task.remove();
  updateTotal(total - price);
}

function updateTotal(newTotal) {
  total = newTotal;
  totalSpan.innerText = total;
  toggleNote();
}

function toggleNote() {
  const notes = document.getElementsByClassName("invoice__notes")[0];
  if (total != 0 && notes.innerHTML === "") {
    notes.append("We accept cash, credit card, or PayPal");
  } else if (total === 0) {
    notes.innerHTML = "";
  }
}

function resetInvoice() {
  const tasks = Array.from(document.getElementsByClassName("task"));
  tasks.forEach((task) => {
    task.remove();
    updateTotal(0);
  });
}

(function init(body, tasks) {
  // add buttons and event listeners
  const buttons = document.getElementsByClassName("buttons")[0];
  tasks.forEach((task) => {
    const id = task.name.toLowerCase().split(" ").join("-");
    const button = document.createElement("button");
    button.className = "add-task";
    button.id = `${id}`;
    button.append(`${task.name}: $${task.price}`);
    buttons.append(button);
    const event = () => addTask(body, task.name, task.price);
    document.getElementById(id).addEventListener("click", event);
    document.getElementById("send").addEventListener("click", resetInvoice);
  });
})(invoiceBody, tasks);

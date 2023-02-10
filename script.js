const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const listNotes = document.getElementById("notes");

let notesArray = [];

function AddNote() {
  let title = titleInput.value.toUpperCase();
  let desc = descriptionInput.value;

  if (title == "" || desc == "") {
    return;
  }
  notesArray.push({ title, desc });

  showNotes();
  titleInput.value = "";
  descriptionInput.value = "";
}

function showNotes() {
  listNotes.innerHTML = "";
  for (let i = 0; i < notesArray.length; i++) {
    const listItem = document.createElement("p");
    const deleteButton = document.createElement("button");
    listItem.innerHTML = `<b> <span style="color:gray;">${notesArray[i].title}</b></span><br>${notesArray[i].desc} `;
    deleteButton.innerHTML = "delete";
    deleteButton.onclick = deleteIt;
    listNotes.appendChild(listItem);
    listItem.appendChild(deleteButton);

    function deleteIt() {
      listNotes.removeChild(listItem);
      notesArray.pop(notesArray[i]);

      if (notesArray.length == 0) {
        const empty = document.createElement("pre");
        empty.innerHTML = "its Empty now";

        listNotes.appendChild(empty);
      }
    }
  }
}

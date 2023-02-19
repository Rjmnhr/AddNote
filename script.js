const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const listNotes = document.getElementById("notes");
const button = document.getElementById("buttons");
const AddBtn = document.getElementById("add-note-button");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchButton");
const deleteSelected = document.getElementById("deleteSelected");
const form = document.querySelector(".form");

let notesArray = JSON.parse(localStorage.getItem("note")) || [];

const archiveArray = JSON.parse(localStorage.getItem("archive")) || [];

let backUpArray = JSON.parse(localStorage.getItem("backup")) || [];

if (notesArray.length !== 0) {
  button.style.display = "block";
}
AddBtn.addEventListener("click", function () {
  let title = titleInput.value.toUpperCase().trim();
  let desc = descriptionInput.value;
  const dateAndTime = new Date();
  let time = ` ${dateAndTime.toDateString()} `;
  let id = Date.now() + Math.floor(Math.random() * 1000);

  if (title === "" || desc === "") {
    return;
  }
  button.style.display = "block";
  notesArray.push({ id, title, desc, time });
  localStorage.setItem("note", JSON.stringify(notesArray));

  showNotes();

  titleInput.value = "";
  descriptionInput.value = "";
});

function showNotes() {
  listNotes.innerHTML = " ";
  if (notesArray.length === 0) {
    const empty = document.createElement("pre");
    empty.innerHTML = "Nothing to show! Add some notes";

    listNotes.appendChild(empty);
  }
  loop();
  function loop() {
    for (let i = 0; i < notesArray.length; i++) {
      const listItem = document.createElement("div");
      listItem.setAttribute("id", "noteDiv");
      const deleteButton = document.createElement("button");
      const buttonsBlock = document.createElement("div");
      buttonsBlock.setAttribute("class", "btnBlock");

      listItem.innerHTML = `
    <div class="note">
      <input type="checkbox" id="${notesArray[i].id}" class="note-checkbox">
      <b> ${notesArray[i].title}</b><br><br><br>
      <span style="color:white;">${notesArray[i].desc}</span><br><br><h4 id="date">${notesArray[i].time}</h4>
    </div>
  `;

      deleteButton.innerHTML = `<img src="./bin.png" height='20px' width='20px'>`;
      const editButton = document.createElement("button");
      editButton.setAttribute("id", "editBtn");
      editButton.innerHTML = `<img src="./pencil.png" height='20px' width='20px'>`;

      const arch = document.createElement("button");
      arch.innerHTML = `<img src="./folders.png" height='20px' width='20px'>`;

      listNotes.appendChild(listItem);
      listItem.appendChild(buttonsBlock);
      buttonsBlock.appendChild(editButton);
      buttonsBlock.appendChild(deleteButton);
      buttonsBlock.appendChild(arch);

      deleting();
      function deleting() {
        deleteButton.addEventListener("click", function () {
          checkbox.style.display = "none";
          let confirmDelete = confirm(
            `Make sure you want to delete note '${notesArray[i].title}'`
          );

          if (confirmDelete === true) {
            buttonsBlock.removeChild(deleteButton);
            buttonsBlock.removeChild(editButton);
            buttonsBlock.removeChild(arch);
            const deletePermanently = document.createElement("button");
            const moveToRecycleBin = document.createElement("button");

            deletePermanently.innerHTML = "Delete";
            moveToRecycleBin.innerHTML = "Move to Bin";

            buttonsBlock.appendChild(deletePermanently);
            buttonsBlock.appendChild(moveToRecycleBin);
            moveToRecycleBin.addEventListener("click", function () {
              listNotes.removeChild(listItem);
              let backUpStore = notesArray.filter(
                (note) => note.id === notesArray[i].id
              );

              if (backUpStore.length > 0) {
                backUpArray.push(backUpStore[0]);
              }
              notesArray = notesArray.filter(
                (note) => note.id !== notesArray[i].id
              );
              alert(`Note ${notesArray[i].title} is moved successfully`);
              localStorage.setItem("note", JSON.stringify(notesArray));
              localStorage.setItem("backup", JSON.stringify(backUpArray));

              showNotes();
            });
            deletePermanently.addEventListener("click", function () {
              let confirmDeletePermanently = confirm(
                `This note  "${notesArray[i].title}"  will be deleted permanently`
              );
              if (confirmDeletePermanently === true) {
                notesArray = notesArray.filter(
                  (note) => note.id !== notesArray[i].id
                );
                localStorage.setItem("note", JSON.stringify(notesArray));

                listNotes.removeChild(listItem);
                buttonsBlock.removeChild(deletePermanently);
                buttonsBlock.removeChild(moveToRecycleBin);

                showNotes();
              }
            });
          }
        });
      }
      const checkbox = document.getElementById(`${notesArray[i].id}`);

      checkbox.addEventListener("change", function () {
        deleteSelected.style.display = "block";
        archiveBtn.style.display = "block";
        if (checkbox.checked) {
          // Disable the delete button
          buttonsBlock.removeChild(deleteButton);
          buttonsBlock.removeChild(editButton);
          buttonsBlock.removeChild(arch);
        } else {
          // Enable the delete button
          deleteSelected.style.display = "none";
          archiveBtn.style.display = "none";
          buttonsBlock.appendChild(editButton);
          buttonsBlock.appendChild(deleteButton);
          buttonsBlock.appendChild(arch);
        }
      });

      deleteSelected.addEventListener("click", function () {
        // Get all the checkboxes
        const checkboxes = document.querySelectorAll(".note-checkbox");

        // Iterate over the checkboxes
        checkboxes.forEach(function (checkbox) {
          // Check if the checkbox is checked
          if (checkbox.checked) {
            // Get the ID of the note to delete
            const noteId = checkbox.id;

            // Remove the note from the notesArray
            notesArray = notesArray.filter(
              (item) => item.id !== Number(noteId)
            );
          }
        });

        // Update the notes in local storage
        localStorage.setItem("note", JSON.stringify(notesArray));
        listNotes.removeChild(listItem);
        // Show the updated notes
        showNotes();

        // Show an alert to confirm that the notes have been deleted
      });

      const moveSelected = document.getElementById("moveSelected");
      moveSelected.addEventListener("click", () => {
        const checkboxes = document.querySelectorAll(".note-checkbox");

        checkboxes.forEach(function (checkbox) {
          // Check if the checkbox is checked
          if (checkbox.checked) {
            // Get the ID of the note to delete
            const noteId = checkbox.id;

            let backUpStore = notesArray.filter(
              (note) => note.id === Number(noteId)
            );

            if (backUpStore.length > 0) {
              backUpArray.push(backUpStore[0]);
            }

            // Remove the note from the notesArray
            notesArray = notesArray.filter(
              (item) => item.id !== Number(noteId)
            );
          }
        });

        // Update the notes in local storage
        localStorage.setItem("note", JSON.stringify(notesArray));
        localStorage.setItem("backup", JSON.stringify(backUpArray));
        listNotes.removeChild(listItem);
        // Show the updated notes
        showNotes();
      });

      editButton.addEventListener("click", function () {
        // Populate the input fields with the current note data
        titleInput.value = notesArray[i].title;
        descriptionInput.value = notesArray[i].desc;

        // Remove the current note from the notesArray
        notesArray = notesArray.filter((note) => note.id !== notesArray[i].id);

        // Remove the current note from the list
        listNotes.removeChild(listItem);
        let editContent = document.getElementById("editAlert");
        editContent.style.display = "block";
        editContent.textContent = "Edit your note here!";

        // Hide the add note button
        AddBtn.style.display = "none";
        backUpBtn.style.display = "none";

        // Create a new button to save the updated note
        const saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        form.appendChild(saveButton);

        // Add an event listener to the save button that will update the note
        saveButton.addEventListener("click", function () {
          localStorage.setItem("note", JSON.stringify(notesArray));
          // Get the updated note information
          let updatedTitle = titleInput.value.toUpperCase().trim();
          let updatedDesc = descriptionInput.value.trim();
          const dateAndTime = new Date();
          let updatedTime = ` ${dateAndTime.toDateString()} `;
          let updatedId = Date.now() + Math.floor(Math.random() * 1000);

          // Update the note object and add it back to the notesArray
          notesArray.push({
            id: updatedId,
            title: updatedTitle,
            desc: updatedDesc,
            time: updatedTime,
          });
          localStorage.setItem("note", JSON.stringify(notesArray));

          // Show the updated notes
          showNotes();

          // Clear the input fields and remove the save button
          titleInput.value = "";
          descriptionInput.value = "";
          document.getElementById("editAlert").textContent = "";
          form.removeChild(saveButton);

          // Show the add note button again
          AddBtn.style.display = "inline";
          backUpBtn.style.display = "inline";
        });
      });

      arch.addEventListener("click", function () {
        listNotes.removeChild(listItem);

        let data = notesArray.filter((note) => note.id === notesArray[i].id);

        if (data.length > 0) {
          archiveArray.push(data[0]);
        }
        notesArray = notesArray.filter((note) => note.id !== notesArray[i].id);

        localStorage.setItem("note", JSON.stringify(notesArray));
        localStorage.setItem("archive", JSON.stringify(archiveArray));
        alert(`Note  is moved successfully`);

        showNotes();
      });
    }
  }
}

const backUpBtn = document.getElementById("backupBtn");

backUpBtn.addEventListener("click", function () {
  if (backUpArray.length === 0) {
    alert("There is nothing backup");
  } else {
    let a = JSON.parse(localStorage.getItem("backup"));
    for (let i = 0; i < a.length; i++) {
      notesArray.unshift(a[i]);
    }

    localStorage.setItem("note", JSON.stringify(notesArray));
    backUpArray = [];
    localStorage.setItem("backup", JSON.stringify(backUpArray));
    showNotes();
  }
});

const archiveBtn = document.getElementById("archive");

archiveBtn.addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(".note-checkbox");

  // Iterate over the checkboxes
  checkboxes.forEach(function (checkbox) {
    // Check if the checkbox is checked
    if (checkbox.checked) {
      // Get the ID of the note to delete
      const noteId = checkbox.id;
      alert(notesArray);
      // Remove the note from the notesArray
      let archive = notesArray.filter((note) => note.id === Number(noteId));

      if (archive.length > 0) {
        archiveArray.push(archive[0]);
      }
      notesArray = notesArray.filter((note) => note.id !== Number(noteId));
      localStorage.setItem("note", JSON.stringify(notesArray));
      localStorage.setItem("archive", JSON.stringify(archiveArray));

      // Remove the note from the DOM
    }
  });
  showNotes();
});

searchBtn.addEventListener("click", function () {
  const searchValue = searchInput.value.toUpperCase().trim();
  if (searchValue === "") {
    return;
  }

  let searchArray = JSON.parse(localStorage.getItem("note"));

  notesArray = searchArray.filter((item) => item.title === searchValue);
  if (notesArray.length > 0) {
    listNotes.innerHTML = "";
    for (let i = 0; i < notesArray.length; i++) {
      let listItem = document.createElement("div");
      listItem.setAttribute("id", "noteDiv");
      listItem.innerHTML = `<b> <span style="color:aqua;">${notesArray[i].title}</b></span><br>${notesArray[i].desc}<h4 id="date">${notesArray[i].time}</h4>`;
      listNotes.appendChild(listItem);
    }
  } else {
    alert("No such note found");
  }
});

const showArchive = document.getElementById("showArchive");

showArchive.addEventListener("click", function () {
  deleteSelected.style.display = "none";
  archiveBtn.style.display = "none";
  listNotes.innerHTML = " ";
  if (archiveArray.length === 0) {
    const empty = document.createElement("pre");
    empty.innerHTML = "Nothing to show!";

    listNotes.appendChild(empty);
  }

  for (let i = 0; i < archiveArray.length; i++) {
    const listItem = document.createElement("div");
    const buttonsBlock = document.createElement("div");
    buttonsBlock.setAttribute("class", "btnBlock");
    const deleteButton = document.createElement("button");
    const unarchive = document.createElement("button");

    listItem.setAttribute("id", "noteDiv");

    listItem.innerHTML = `
      <b> <span style="color:aqua;">${archiveArray[i].title}</b></span><br>
      ${archiveArray[i].desc}<h4 id="date">${archiveArray[i].time}</h4>
  
  `;

    deleteButton.innerHTML = `<img src="./bin.png" height='20px' width='20px'>`;
    unarchive.innerHTML = `<img src="./folders.png" height='20px' width='20px'>`;
    listNotes.appendChild(listItem);
    listItem.appendChild(buttonsBlock);
    buttonsBlock.appendChild(deleteButton);
    buttonsBlock.appendChild(unarchive);

    deleteButton.addEventListener("click", function () {
      let confirmDlt = confirm(
        `Make sure you want to delete note '${archiveArray[i].title}'`
      );
      if (confirmDlt) {
        listNotes.removeChild(listItem);
        archiveArray.splice(i, 1);
        localStorage.setItem("archive", JSON.stringify(archiveArray));

        listItem.removeChild(deleteButton);
        if (notesArray.length == 0) {
          const empty = document.createElement("pre");
          empty.innerHTML = "Nothing to show!";

          listNotes.appendChild(empty);
        }
      }
    });

    unarchive.addEventListener("click", function () {
      listNotes.removeChild(listItem);
      let data = archiveArray.splice(i, 1);
      if (data.length > 0) {
        notesArray.push(data[0]);
      }

      localStorage.setItem("archive", JSON.stringify(archiveArray));
      localStorage.setItem("note", JSON.stringify(notesArray));
    });
  }
});

const see = document.getElementById("see");
const showBar = document.querySelector(".show-bar");

see.addEventListener("click", function () {
  showBar.classList.toggle("active");
});

const noteShow = document.getElementById("noteButton");
noteShow.addEventListener("click", function () {
  noteShow.classList.toggle("clicked");
  form.style.display = "flex";
  showNotes();
});

showNotes();

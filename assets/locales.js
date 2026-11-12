const languageMenu = document.getElementById("page-language");
if (languageMenu) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && languageMenu.open) {
      languageMenu.open = false;
      languageMenu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!languageMenu.contains(event.target)) languageMenu.open = false;
  });
}

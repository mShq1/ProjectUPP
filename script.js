// Загружаем HEADER
fetch("src/header/header.html")
  .then(response => {
    if (!response.ok) throw new Error("Не удалось загрузить header");
    return response.text();
  })
  .then(data => {
    document.getElementById("header").innerHTML = data;
  })
  .catch(err => console.error(err));

// Загружаем FOOTER
fetch("src/footer/footer.html")
  .then(response => {
    if (!response.ok) throw new Error("Не удалось загрузить footer");
    return response.text();
  })
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch(err => console.error(err));

# Buscador de episodios · Rick and Morty

- **Nombre:** Adilson Emanuel Diaz Vera
- **Último dígito de cédula:** 8
- **Variante:** C · Episodios (`https://rickandmortyapi.com/api/episode`)
- **Página publicada:** https://Adilson-GIT.github.io/tp-diaz-adilson/

## Descripción

Página web de una sola pantalla que permite buscar episodios de la serie
Rick and Morty usando su API pública. Se puede buscar por **nombre** y filtrar
por **temporada** (S01 a S05); ambos criterios se combinan en una misma
petición (`?name=...&episode=S01`). Los resultados se muestran en tarjetas con
el nombre, el código del episodio, la fecha de emisión y la cantidad de
personajes. La aplicación informa cuando está buscando, cuando no hay
resultados y cuando ocurre un error de conexión, y recuerda la última
búsqueda con `localStorage`.

Tecnologías: HTML semántico, CSS (Grid, Flexbox y variables), JavaScript ES6+
(`fetch`, `async/await`, `try/catch/finally`, DOM y `localStorage`) y GitHub
Pages.

## Captura de pantalla

![Captura de la aplicación](img/captura.png)

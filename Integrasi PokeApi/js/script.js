const limit = 8;
let offset = 0;
let currentSearch = '';
let allPokemon = [];

function fetchAllPokemon() {
     const url = `https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`;
     fetch(url)
          .then(response => response.json())
          .then(data => {
               allPokemon = data.results;
               fetchPokemonList();
          })
          .catch(error => {
               document.getElementById('pokemonList').innerHTML = `<p>Error fetching Pokémon list: ${error.message}</p>`;
     });
}

function fetchPokemonList() {
     let filteredPokemon = allPokemon;

     if (currentSearch) {
          filteredPokemon = allPokemon.filter(pokemon =>
               pokemon.name.toLowerCase().includes(currentSearch.toLowerCase())
          );
     }

     const paginatedPokemon = filteredPokemon.slice(offset, offset + limit);

     displayPokemonList(paginatedPokemon);
     setupPagination(filteredPokemon.length);
}

/**
 * Display a list of Pokémon.
 * @param {Array} pokemonList
 */
function displayPokemonList(pokemonList) {
     const pokemonListDiv = document.getElementById('pokemonList');
     pokemonListDiv.innerHTML = '';

     if (pokemonList.length === 0) {
         pokemonListDiv.innerHTML = `<p>No Pokémon found</p>`;
         return;
     }

     // Tambahkan class row untuk Bootstrap
     const rowDiv = document.createElement('div');
     rowDiv.className = 'row';

     pokemonList.forEach(pokemon => {
         let url = pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;

         fetch(url)
             .then(response => response.json())
             .then(pokemonData => {
                 const pokemonCard = document.createElement('div');
                 pokemonCard.className = 'col-md-3 pokemon-card'; // Menggunakan col-md-3 untuk 4 kolom
                 pokemonCard.innerHTML = `
                     <div class="card h-100 bg-warning" onclick="showPokemonDetails('${pokemonData.name}')">
                         <div class="card-header">
                             <h5 class="card-title text-center m-auto">${capitalizeFirstLetter(pokemonData.name)}</h5>
                         </div>
                         <div class="card-body d-flex justify-content-center align-items-center">
                             <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="card-img-top bg-light">
                         </div>
                     </div>
                 `;
                 rowDiv.appendChild(pokemonCard);
             });
     });

     pokemonListDiv.appendChild(rowDiv); // Tambahkan rowDiv ke pokemonListDiv
}


/**
 * Show Pokémon details in a modal or alert.
 * @param {string} pokemonName
 */
function showPokemonDetails(pokemonName) {
     const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
     
     fetch(url)
          .then(response => response.json())
          .then(pokemonData => {
               // Format the details as needed
               const details = `
                    <div class="text-center">
                         <h5>${capitalizeFirstLetter(pokemonData.name)}</h5>
                         <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="img-fluid" style="max-height: 150px; max-width: 150px;">
                         <p>Height: ${pokemonData.height / 10} m</p>
                         <p>Weight: ${pokemonData.weight / 10} kg</p>
                         <p>Abilities: ${pokemonData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}</p>
                    </div>
               `;

               // Tampilkan detail di dalam modal
               const modalBody = document.getElementById('pokemonModalBody');
               modalBody.innerHTML = details;

               // Tampilkan modal
               const modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
               modal.show();
          })
         .catch(error => {
             console.error('Error fetching Pokémon details:', error);
             // Anda bisa menambahkan penanganan kesalahan di sini
         });
}


/**
 * Setup pagination buttons.
 * @param {number} total
 */
function setupPagination(total) {
     const paginationDiv = document.getElementById('pagination');
     paginationDiv.innerHTML = '';

     const totalPages = Math.ceil(total / limit);
     const currentPage = Math.floor(offset / limit) + 1;

     // Previous button
     const prevItem = document.createElement('li');
     prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
     const prevButton = document.createElement('button');
     prevButton.className = 'page-link';
     prevButton.innerText = 'Previous';
     prevButton.onclick = () => changePage(-1);
     prevItem.appendChild(prevButton);
     paginationDiv.appendChild(prevItem);

     // Ellipsis before the page numbers
     if (currentPage > 3) {
          const ellipsisItem = document.createElement('li');
          ellipsisItem.className = 'page-item disabled';
          ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
          paginationDiv.appendChild(ellipsisItem);
     }

     // Page number buttons
     for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
          const pageItem = document.createElement('li');
          pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;

          const pageButton = document.createElement('button');
          pageButton.className = 'page-link';
          pageButton.innerText = i;
          pageButton.onclick = () => {
               offset = (i - 1) * limit;
               fetchPokemonList();
          };

          pageItem.appendChild(pageButton);
          paginationDiv.appendChild(pageItem);
     }

     // Ellipsis after the page numbers
     if (currentPage < totalPages - 2) {
          const ellipsisItem = document.createElement('li');
          ellipsisItem.className = 'page-item disabled';
          ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
          paginationDiv.appendChild(ellipsisItem);
     }

     // Next button
     const nextItem = document.createElement('li');
     nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
     const nextButton = document.createElement('button');
     nextButton.className = 'page-link';
     nextButton.innerText = 'Next';
     nextButton.onclick = () => changePage(1);
     nextItem.appendChild(nextButton);
     paginationDiv.appendChild(nextItem);
}

/**
 * Change the current page.
 * @param {number} direction - Direction to change page (-1 for previous, 1 for next)
 */
function changePage(direction) {
     offset += direction * limit;
     fetchPokemonList();
}

/**
 * Capitalize the first letter of a string.
 * @param {string} string
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Handle input changes for the search input.
 */
document.getElementById('searchInput').addEventListener('input', () => {
     const searchInput = document.getElementById('searchInput').value.trim();
     currentSearch = searchInput;
     offset = 0;
     fetchPokemonList();
});

// Initial fetch of all Pokémon
fetchAllPokemon();

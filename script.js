// script.js: lógica separada para obtener el clima y mostrar películas
const DB = {
  sunny: [
    {title:'La La Land', year:'2016', plot:'Musical romántico de Los Ángeles lleno de color y optimismo.', poster:'https://image.tmdb.org/t/p/w300/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg'},
    {title:'Encanto', year:'2021', plot:'Disney colorido lleno de magia familiar y música vibrante.', poster:'https://image.tmdb.org/t/p/w300/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg'},
    {title:'Spider-Man: No Way Home', year:'2021', plot:'Superhéroes épicos: diversión y acción que ilumina cualquier día.', poster:'https://image.tmdb.org/t/p/w300/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'}
  ],
  rainy: [
    {title:'Dune', year:'2021', plot:'Épica sci-fi con atmósferas densas: perfecto para días lluviosos.', poster:'https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg'},
    {title:'The Batman', year:'2022', plot:'Gotham oscuro y lluvioso: el Batman más atmosférico de todos.', poster:'https://image.tmdb.org/t/p/w300/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg'},
    {title:'Everything Everywhere All at Once', year:'2022', plot:'Caos multiversal emotivo: reflexivo como la lluvia.', poster:'https://image.tmdb.org/t/p/w300/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg'}
  ],
  cloudy: [
    {title:'Blade Runner 2049', year:'2017', plot:'Sci-fi atmosférico: neones y niebla en un futuro melancólico.', poster:'https://image.tmdb.org/t/p/w300/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'},
    {title:'The Menu', year:'2022', plot:'Thriller psicológico elegante: misterio gourmet y tensión atmosférica.', poster:'https://image.tmdb.org/t/p/w300/v31MsWhF9WFh7Qooq6xSBbmJxoG.jpg'},
    {title:'Joker', year:'2019', plot:'Drama urbano sombrio: melancolía y caos en Gotham nublado.', poster:'https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'}
  ],
  snowy: [
    {title:'Frozen 2', year:'2019', plot:'Secuela Disney épica: aventura mágica en paisajes helados espectaculares.', poster:'https://image.tmdb.org/t/p/w300/mINJaa34MtknCYl5AjtNJzWj8cD.jpg'},
    {title:'Knives Out', year:'2019', plot:'Misterio navideño elegante: crimen y humor en mansión invernal.', poster:'https://image.tmdb.org/t/p/w300/pThyQovXQrw2m0s9x82twj48Jq4.jpg'},
    {title:'The Revenant', year:'2015', plot:'Supervivencia brutal en paisajes nevados: épica visual impactante.', poster:'https://image.tmdb.org/t/p/w300/tSaBkriE7TpbjFoQUFXuikoz0dF.jpg'}
  ],
  storm: [
    {title:'Top Gun: Maverick', year:'2022', plot:'Acción aérea espectacular: adrenalina y velocidad como una tormenta.', poster:'https://image.tmdb.org/t/p/w300/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'},
    {title:'Twisters', year:'2024', plot:'Secuela épica de tornados: la nueva generación de cazatormentas.', poster:'https://image.tmdb.org/t/p/w300/pjnD08FlMAIXsfOLKQbvmO0f0MD.jpg'},
    {title:'Avengers: Endgame', year:'2019', plot:'Batalla final épica: tormenta de superhéroes contra Thanos.', poster:'https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg'}
  ],
  default: [
    {title:'Deadpool & Wolverine', year:'2024', plot:'Comedia superheroica salvaje: diversión garantizada sin importar el clima.', poster:'https://image.tmdb.org/t/p/w300/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg'},
    {title:'Inside Out 2', year:'2024', plot:'Pixar emotivo y colorido: emociones que funcionan en cualquier momento.', poster:'https://image.tmdb.org/t/p/w300/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg'},
    {title:'Guardians of the Galaxy Vol. 3', year:'2023', plot:'Aventura espacial épica: música y diversión cósmica universal.', poster:'https://image.tmdb.org/t/p/w300/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg'}
  ]
};

function mapWeatherToCategory(main){
  if(!main) return 'default';
  main = main.toLowerCase();
  if(main.includes('clear')) return 'sunny';
  if(main.includes('rain') || main.includes('drizzle')) return 'rainy';
  if(main.includes('thunder')) return 'storm';
  if(main.includes('snow')) return 'snowy';
  if(main.includes('cloud')) return 'cloudy';
  if(main.includes('mist') || main.includes('fog') || main.includes('haze')) return 'cloudy';
  return 'default';
}

function buildCard(movie){
  const div = document.createElement('div');
  div.className = 'card';
  const img = document.createElement('img');
  img.className='poster loading';
  img.src = movie.poster;
  img.alt = movie.title;
  
  // Remover clase loading cuando la imagen cargue
  img.onload = function() {
    this.classList.remove('loading');
  };
  
  // Sistema de fallback para imágenes
  let currentAttempt = 0;
  const fallbackSources = [
    movie.poster,
    movie.fallback1 || `https://image.tmdb.org/t/p/w300${movie.tmdb_path || ''}`,
    movie.fallback2 || `https://via.placeholder.com/260x360/1e293b/94a3b8?text=${encodeURIComponent(movie.title)}`,
    `https://via.placeholder.com/260x360/1e293b/94a3b8?text=${encodeURIComponent(movie.title + ' (' + movie.year + ')')}`
  ].filter(Boolean);
  
  img.onerror = function() {
    currentAttempt++;
    if (currentAttempt < fallbackSources.length) {
      this.src = fallbackSources[currentAttempt];
      if (currentAttempt >= fallbackSources.length - 2) {
        this.style.objectFit = 'contain';
        this.style.backgroundColor = '#1e293b';
      }
    }
  };
  
  div.appendChild(img);
  const body = document.createElement('div');
  body.className='card-body';
  const t = document.createElement('div');
  t.className='title';
  t.textContent = movie.title + ' ('+movie.year+')';
  body.appendChild(t);
  const meta = document.createElement('div');
  meta.className='meta';
  meta.textContent = movie.plot;
  body.appendChild(meta);
  div.appendChild(body);
  return div;
}

async function fetchWeather(city, apiKey){
  if(!apiKey || apiKey.trim()===''){
    // Mock example to allow testing offline
    return {ok:true, main:'Clear', temp:25, note:'API key no proporcionada — mostrando ejemplo local'};
  }
  const q = encodeURIComponent(city);
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${apiKey}`;
    const resp = await fetch(url);
    if(!resp.ok) return {ok:false, status:resp.status, text:await resp.text()};
    const data = await resp.json();
    const main = data.weather && data.weather.length ? data.weather[0].main : null;
    const temp = data.main && data.main.temp ? data.main.temp : null;
    return {ok:true, main, temp, raw:data};
  }catch(err){
    return {ok:false, error:err.message};
  }
}

document.getElementById('btn').addEventListener('click', async ()=>{
  const city = document.getElementById('city').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  if(!city) return alert('Escribe una ciudad por favor');
  const header = document.getElementById('resultHeader');
  header.innerHTML = '';
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  header.textContent = 'Buscando...';
  const w = await fetchWeather(city, apiKey);
  if(!w.ok){
    header.innerHTML = '<div class="weatherBox">No se pudo obtener el clima (error). Mostrando recomendaciones de ejemplo.</div>';
    renderMovies('default');
    return;
  }
  const category = mapWeatherToCategory(w.main);
  const tempText = w.temp !== undefined && w.temp !== null ? (w.temp + '°C') : 'Temp desconocida';
  const weatherNice = {
    sunny:'Soleado ☀️',
    rainy:'Lluvioso 🌧️',
    storm:'Tormentoso ⛈️',
    snowy:'Nevado ❄️',
    cloudy:'Nublado ☁️',
    default:'Variado'
  }[category] || 'Variado';
  header.innerHTML = `<div class="weatherBox">En <strong>${city}</strong> el clima es <strong>${weatherNice}</strong> — ${tempText}</div>`;
  renderMovies(category);
});

function renderMovies(category){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  const list = DB[category] || DB['default'];
  list.forEach(m=> grid.appendChild(buildCard(m)));
}

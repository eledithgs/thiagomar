/* ==========================================================
   DOM READY GLOBAL
========================================================== */
document.addEventListener("DOMContentLoaded", function () {

    /* 1. MENU HAMBURGUESA */
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (toggle && menu) {
        toggle.addEventListener("click", () => menu.classList.toggle("active"));
    }

    /* 2. DROPDOWNS NAV */
    const dropdowns = document.querySelectorAll(".nav-dropdown");
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector(".dropdown-toggle");
        if (button) {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove("active"); });
                dropdown.classList.toggle("active");
            });
        }
    });
    document.addEventListener("click", () => {
        dropdowns.forEach(dropdown => dropdown.classList.remove("active"));
    });

    /* 3. HERO AUTOMÁTICO (INDEX) */
    const heroParallax = document.getElementById("fondo1");
    if (heroParallax && heroParallax.dataset.imagenes) {
        const imagenes = heroParallax.dataset.imagenes.split(",");
        let indice = 0;
        setInterval(() => {
            indice = (indice + 1) % imagenes.length;
            const imgTemp = new Image();
            imgTemp.src = imagenes[indice].trim();
            imgTemp.onload = () => heroParallax.style.backgroundImage = `url('${imgTemp.src}')`;
        }, 5000);
    }

    /* 4. GALERÍA - DESLIZAMIENTO MANUAL */
    const wrappers = document.querySelectorAll('.galeria-scroll-wrapper');
    wrappers.forEach(wrapper => {
        let isDown = false;
        let startX, scrollLeft;
        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.classList.add('active');
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });
        wrapper.addEventListener('mouseleave', () => { isDown = false; wrapper.classList.remove('active'); });
        wrapper.addEventListener('mouseup', () => { isDown = false; wrapper.classList.remove('active'); });
        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });
        const parent = wrapper.closest('.galeria-relativo');
        if (parent) {
            const btnNext = parent.querySelector('.flecha-nav.next');
            const btnPrev = parent.querySelector('.flecha-nav.prev');
            if (btnNext) btnNext.onclick = () => wrapper.scrollBy({ left: 400, behavior: 'smooth' });
            if (btnPrev) btnPrev.onclick = () => wrapper.scrollBy({ left: -400, behavior: 'smooth' });
        }
    });

    /* 5. LIGHTBOX NAVEGABLE */
    if (document.body.classList.contains("galeria-page")) {
        const itemsParaLightbox = Array.from(document.querySelectorAll(".galeria-item"));
        const lightbox = document.getElementById("galeria-lightbox");
        const img = document.getElementById("galeria-img");
        const titulo = document.getElementById("galeria-titulo-obra");
        const tecnica = document.getElementById("galeria-tecnica");
        const medidas = document.getElementById("galeria-medidas");
        const anio = document.getElementById("galeria-anio");
        const precio = document.getElementById("galeria-precio");
        const cerrar = document.querySelector(".galeria-cerrar");
        
        if (lightbox && !document.getElementById("lb-contador")) {
            lightbox.insertAdjacentHTML('beforeend', `
                <div id="lb-contexto" class="lightbox-contexto"><span id="lb-seccion"></span> | <span id="lb-contador"></span></div>
                <div class="lightbox-nav prev" id="lb-prev">&#10094;</div>
                <div class="lightbox-nav next" id="lb-next">&#10095;</div>
            `);
        }
        const seccionTxt = document.getElementById("lb-seccion");
        const contadorTxt = document.getElementById("lb-contador");
        let currentIndex = 0;
        const updateLightbox = (index) => {
            currentIndex = index;
            const item = itemsParaLightbox[currentIndex];
            if (!item) return;
            img.src = item.querySelector("img").src;
            titulo.textContent = item.dataset.titulo || "";
            tecnica.textContent = item.dataset.tecnica || "";
            medidas.textContent = item.dataset.medidas || "";
            anio.textContent = item.dataset.anio || "";
            precio.textContent = item.dataset.precio || "";
            const sub = item.closest('.galeria-bloque')?.querySelector('.galeria-subtitulo');
            if (seccionTxt) seccionTxt.textContent = sub ? sub.innerText : "Obra";
            if (contadorTxt) contadorTxt.textContent = `${currentIndex + 1} / ${itemsParaLightbox.length}`;
        };
        itemsParaLightbox.forEach((item, index) => {
            item.addEventListener("click", () => { updateLightbox(index); lightbox.style.display = "flex"; document.body.style.overflow = "hidden"; });
        });
        document.getElementById("lb-next").onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % itemsParaLightbox.length; updateLightbox(currentIndex); };
        document.getElementById("lb-prev").onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + itemsParaLightbox.length) % itemsParaLightbox.length; updateLightbox(currentIndex); };
        const cerrarLB = () => { if (lightbox) { lightbox.style.display = "none"; document.body.style.overflow = "auto"; } };
        if (cerrar) cerrar.addEventListener("click", cerrarLB);
        document.addEventListener("keydown", (e) => {
            if (lightbox?.style.display === "flex") {
                if (e.key === "ArrowRight") currentIndex = (currentIndex + 1) % itemsParaLightbox.length; updateLightbox(currentIndex);
                if (e.key === "ArrowLeft") currentIndex = (currentIndex - 1 + itemsParaLightbox.length) % itemsParaLightbox.length; updateLightbox(currentIndex);
                if (e.key === "Escape") cerrarLB();
            }
        });
    }

    /* 6. HOVER IMAGENES */
    const imagenesHover = document.querySelectorAll(".imagen-hover");
    imagenesHover.forEach(img => {
        if (!img.dataset.images) return;
        const lista = img.dataset.images.split(",");
        let index = 0, intervalo;
        img.addEventListener("mouseenter", () => {
            if (lista.length <= 1) return;
            intervalo = setInterval(() => { index = (index + 1) % lista.length; img.src = lista[index].trim(); }, 700);
        });
        img.addEventListener("mouseleave", () => { clearInterval(intervalo); img.src = lista[0].trim(); index = 0; });
    });

    /* 7. CARRUSEL PRODUCTO */
    const carruseles = document.querySelectorAll(".carrusel");
    carruseles.forEach(carrusel => {
        if (!carrusel.dataset.imagenes) return;
        const imagenes = carrusel.dataset.imagenes.split(",");
        const track = carrusel.querySelector(".carrusel-track");
        if (!track) return;
        let index = 0;
        imagenes.forEach(src => { const img = document.createElement("img"); img.src = src.trim(); track.appendChild(img); });
        const nextBtn = carrusel.querySelector(".next"), prevBtn = carrusel.querySelector(".prev");
        if (nextBtn) nextBtn.addEventListener("click", () => { index = (index + 1) % imagenes.length; track.style.transform = `translateX(-${index * 100}%)`; });
        if (prevBtn) prevBtn.addEventListener("click", () => { index = (index - 1 + imagenes.length) % imagenes.length; track.style.transform = `translateX(-${index * 100}%)`; });
    });

    /* 8. ACOMODO INTELIGENTE Y EVENTO PASADO */
    const contenedor = document.querySelector('.galeria-taller') || document.querySelector('.cartelera-expos');
    if (contenedor) {
        const tarjetas = Array.from(contenedor.querySelectorAll('.card, .poster-expo'));
        const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
        tarjetas.sort((a, b) => {
            const esFijadoA = a.classList.contains('fijado'), esFijadoB = b.classList.contains('fijado');
            if (esFijadoA && !esFijadoB) return -1;
            if (!esFijadoA && esFijadoB) return 1;
            return new Date(a.getAttribute('data-fecha')) - new Date(b.getAttribute('data-fecha'));
        });
        tarjetas.forEach(t => {
            contenedor.appendChild(t);
            if (new Date(t.getAttribute('data-fecha')) < hoy) t.classList.add('evento-pasado');
        });
    }

    /* 9. GESTIÓN DE CUPO LLENO */
    document.querySelectorAll('.card.lleno').forEach(tarjeta => {
        const btn = tarjeta.querySelector('.btn-detalle');
        if (btn) { btn.innerText = "Cupo Agotado"; btn.style.pointerEvents = "none"; }
    });

    actualizarInicio();
});

/* ==========================================================
   FUNCIONES GLOBALES
========================================================== */

async function actualizarInicio() {
    const expoContenedor = document.getElementById('contenedor-proxima-expo');
    const tallerContenedor = document.getElementById('contenedor-proximo-taller');
    if (expoContenedor) {
        try {
            const res = await fetch('expo.html');
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const proxima = doc.querySelector('.poster-expo:not(.evento-pasado)');
            if (proxima) {
                expoContenedor.innerHTML = `<img src="${proxima.querySelector('img').src}" alt="Expo"><h3>${proxima.querySelector('h2').innerText}</h3><p>Próxima Exposición</p><a href="expo.html" class="inicio-boton">Ver detalles</a>`;
            }
        } catch (e) { console.log("Error expo:", e); }
    }
    if (tallerContenedor) {
        try {
            const res = await fetch('talleres/taller.html');
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            let proximo = doc.querySelector('.card.taller:not(.evento-pasado):not(.lleno)') || doc.querySelector('.card.taller:not(.evento-pasado)');
            if (proximo) {
                tallerContenedor.innerHTML = `<img src="${proximo.querySelector('img').src}" alt="Taller"><h3>${proximo.querySelector('h3').innerText}</h3><p>${proximo.classList.contains('lleno') ? 'Cupo Agotado' : 'Próximo Taller'}</p><a href="talleres/taller.html" class="inicio-boton">Inscribirse</a>`;
            }
        } catch (e) { console.log("Error taller:", e); }
    }
}

function filtrar(categoria) {
    const elementos = document.querySelectorAll('.item, .galeria-bloque');
    const botones = document.querySelectorAll('.filtros button, .galeria-filtros button');
    botones.forEach(btn => btn.classList.remove('active'));
    if (event?.currentTarget) event.currentTarget.classList.add('active');

    elementos.forEach(el => {
        const matchClase = el.classList.contains(categoria);
        const matchData = el.getAttribute('data-categoria') === categoria;
        el.style.display = (categoria === 'todo' || matchClase || matchData) ? 'block' : 'none';
    });
}

function toggleExpo(element) {
    const esActivo = element.classList.contains("activa");
    document.querySelectorAll(".poster-expo").forEach(e => e.classList.remove("activa"));
    if (!esActivo) {
        element.classList.add("activa");
        setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "nearest" }), 300);
    }
}
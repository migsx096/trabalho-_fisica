const principal = document.getElementById('grupo-principal');
const variaveis = document.getElementById('grupo-variaveis');
const secoesVariaveis = ['ex', 'corda', 'angulo', 'peso'];

function mostrar(id) {
    if (!document.getElementById(id)) id = 'inicio';

    document.querySelectorAll('.sesao').forEach(s =>
        s.classList.toggle('ativadax', s.id === id));

    const noGrupoVariaveis = secoesVariaveis.includes(id);
    principal.classList.toggle('escondido', noGrupoVariaveis);
    variaveis.classList.toggle('escondido', !noGrupoVariaveis);

    document.querySelectorAll('.local [data-sec]').forEach(b =>
        b.classList.toggle('atual', b.dataset.sec === id));

    const atual = document.querySelector('.grupo-botoes:not(.escondido) .atual');
    if (atual) atual.scrollIntoView({ inline: 'center', block: 'nearest' });

    window.scrollTo(0, 0);
    history.replaceState(null, '', '#' + id);
}

document.querySelectorAll('.local [data-sec]').forEach(b =>
    b.addEventListener('click', () => mostrar(b.dataset.sec)));

mostrar(location.hash.slice(1) || 'inicio');

/* ---------- Animação ao rolar ---------- */
const alvos = document.querySelectorAll('.sesao img, .tabela');
const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visto');
            observador.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
alvos.forEach(el => {
    if (el.tagName === 'IMG' && el.closest('.tabela')) return;
    el.classList.add('reveal');
    observador.observe(el);
});

/* ---------- Ampliar imagem ao tocar ---------- */
const zoom = document.createElement('div');
zoom.id = 'zoom';
zoom.innerHTML = '<img alt="">';
document.body.appendChild(zoom);

document.querySelectorAll('.sesao img').forEach(img =>
    img.addEventListener('click', () => {
        zoom.firstChild.src = img.src;
        zoom.firstChild.alt = img.alt;
        zoom.classList.add('aberto');
    }));
zoom.addEventListener('click', () => zoom.classList.remove('aberto'));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') zoom.classList.remove('aberto');
});

/* ---------- Barra de progresso de leitura ---------- */
const barra = document.getElementById('progresso');
function progresso() {
    const total = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = 'scaleX(' + (total > 0 ? scrollY / total : 0) + ')';
}
addEventListener('scroll', progresso, { passive: true });
addEventListener('resize', progresso);

/* ---------- Anterior / próxima ---------- */
const ordem = ['inicio', 'teoria', 'materiais', 'arranjo', 'procedimento', 'ex', 'corda', 'angulo', 'peso', 'conclusao'];
const nomes = { inicio: 'Introdução', teoria: 'Embasamento', materiais: 'Materiais', arranjo: 'Arranjo', procedimento: 'Procedimento', ex: 'Explicações', corda: 'Corda', angulo: 'Ângulo', peso: 'Peso', conclusao: 'Conclusão' };
ordem.forEach((id, i) => {
    const caixa = document.createElement('div');
    caixa.className = 'passos';
    if (i > 0) caixa.innerHTML += '<button class="ant" data-sec="' + ordem[i - 1] + '">← ' + nomes[ordem[i - 1]] + '</button>';
    if (i < ordem.length - 1) caixa.innerHTML += '<button class="prox" data-sec="' + ordem[i + 1] + '">' + nomes[ordem[i + 1]] + ' →</button>';
    document.getElementById(id).appendChild(caixa);
});
document.addEventListener('click', e => {
    const b = e.target.closest('.passos [data-sec]');
    if (b) mostrar(b.dataset.sec);
});

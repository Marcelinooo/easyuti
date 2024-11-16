function mostrarParametros(tipo) {
    // Esconde todos os conteúdos
    document.querySelectorAll('.parametro-content').forEach(content => {
        content.classList.remove('active');
    });

    // Mostra o conteúdo selecionado
    document.getElementById(`${tipo}-content`).classList.add('active');

    // Atualiza o estilo dos itens da lista
    document.querySelectorAll('.lista-item').forEach(item => {
        item.style.backgroundColor = 'var(--branco)';
    });
    event.currentTarget.style.backgroundColor = 'var(--azul-claro)';
}

// Mostrar parâmetros de normalidade por padrão
document.addEventListener('DOMContentLoaded', function() {
    mostrarParametros('normalidade');
});
const preguntas = document.querySelectorAll('.pregunta');
preguntas.forEach(pregunta => {
    pregunta.addEventListener('click', () => {
        const abiertas = document.querySelectorAll('.respuesta.activa');
        abiertas.forEach(r => {
          if (r !== pregunta.nextElementSibling) {
            r.classList.remove('activa');
          }
        });
        pregunta.nextElementSibling.classList.toggle('activa');
      });
    });

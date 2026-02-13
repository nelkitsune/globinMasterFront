import Section from "@/components/Section/Section";
import styles from "@/app/styles/Home.module.css";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>¡Bienvenido!</h1>
      </div>

      <Section title="Gestor De Iniciativa" imageSide="right" href="/gestorDeIniciativa">
        <p>
          Organiza y controla los turnos de combate de forma rápida. Registra iniciativa, aplica modificadores,
          y resuelve empates automáticamente. Guarda encuentros para reusarlos en futuras sesiones.
        </p>
        <p>
          Ideal para mesas con muchos PJs y NPCs: prioriza la fluidez del combate sin perder precisión en las reglas.
        </p>
      </Section>

      <Section title="Magia" imageSide="left" href="/spells">
        <p>
          Accede a un compendio completo de conjuros organizados por escuela, nivel y clase lanzadora.
          Busca efectos específicos y guarda tus favoritos.
        </p>
        <p>
          Ideal para planificar estrategias de combate y optimizar la selección de hechizos.
        </p>
      </Section>
      <Section title="Dotes" imageSide="right" href="/feats">
        <p>
          Explora una lista completa de dotes disponibles para personajes. Filtra por clase, nivel y tipo de dote.
        </p>
        <p>
          Ideal para personalizar y optimizar tus personajes según las necesidades de la campaña.
        </p>
      </Section>
      <Section title="Reglas" imageSide="left" href="/rules">
        <p>
          Revisa reglas oficiales y caseras para tu mesa. Encuentra rapidamente la regla que necesitas.
        </p>
        <p>
          Ideal para consultas rapidas durante la partida.
        </p>
      </Section>
      <Section title="Mis campañas" imageSide="right" href="/campaing">
        <p>
          Administra tus campañas de juego: crea y organiza sesiones, lleva un registro de eventos importantes y gestiona la información de los personajes.
        </p>
        <p>
          Sincroniza con tus jugadores para mantener a todos informados y actualizados.
        </p>
      </Section>
    </div>
  );
}

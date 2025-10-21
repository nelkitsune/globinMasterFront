import Section from "@/components/Section/Section";
import styles from "@/app/styles/Home.module.css";

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* Título central grande, similar al mock */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>GoblinMaster</h1>
      </div>

      <Section title="Gestor De Iniciativa" imageSide="right">
        <p>
          Organiza y controla los turnos de combate de forma rápida. Registra iniciativa, aplica modificadores, 
          y resuelve empates automáticamente. Guarda encuentros para reusarlos en futuras sesiones.
        </p>
        <p>
          Ideal para mesas con muchos PJs y NPCs: prioriza la fluidez del combate sin perder precisión en las reglas.
        </p>
      </Section>

      <Section title="Mis Personajes" imageSide="left">
        <p>
          Administra tus personajes jugadores: atributos, dotes, inventario, rasgos raciales y más. 
          Sincroniza con tu cuenta para acceder desde cualquier dispositivo.
        </p>
        <p>
          Exporta o comparte con tu GM y mantén un historial de niveles y mejoras.
        </p>
      </Section>

      <Section title="Bestiarios" imageSide="right">
        <p>
          Consulta criaturas por CR, tipo, tamaño, alineamiento, ataques especiales y plantillas. 
          Filtros avanzados para armar encuentros balanceados en segundos.
        </p>
        <p>
          Compatible con reglas personalizadas y variantes caseras.
        </p>
      </Section>
    </div>
  );
}

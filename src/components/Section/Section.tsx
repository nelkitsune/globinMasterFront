import styles from "./Section.module.css";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  imageSide?: "left" | "right";
};

export default function Section({ title, children, imageSide = "right" }: SectionProps) {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={`${styles.row} ${imageSide === "left" ? styles.reverse : ""}`}>
          <div className={styles.textCol}>
            <h2 className="sectionTitle">{title}</h2>
            <div className="muted">{children}</div>
          </div>

          <div className={styles.imageCol}>
            {/* “FOTO” como placeholder, podés reemplazar por next/image cuando tengas assets */}
            <div className={styles.photoBox}>
              <span>FOTO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

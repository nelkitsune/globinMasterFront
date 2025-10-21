import styles from "./Section.module.css";
import Link from "next/link";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  imageSide?: "left" | "right";
  href?: string;
};

export default function Section({ title, children, imageSide = "right", href }: SectionProps) {
  return (
    <section className={styles.wrap}>
      <Link href={href || "#"}>
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
      </Link>
    </section>
  );
}

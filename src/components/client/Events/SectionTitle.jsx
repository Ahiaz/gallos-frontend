/*
Componente: SectionTitle.jsx
Descripción: Componente que muestra los titulos de las secciones
Autor: Jose Ahias Vargas

*/
import styles from './styles/SectionTitle.module.css'

const SectionTitle = ({ title, highlight }) => {

  const parts = title.split(highlight);

  return (
    <h2 className={styles.title}>
      {parts[0]}
      <span className="highlight">{highlight}</span>
      {parts[1]}
    </h2>
  );
};

export default SectionTitle;
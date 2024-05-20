import { useForm } from "react-hook-form";
import styles from "./ContactForm.module.scss";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Tu Nombre
        </label>
        <input
          id="name"
          type="text"
          className={styles.input}
          {...register("name", { required: "El nombre es requerido" })}
        />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Tu Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          {...register("email", {
            required: "El email es requerido",
            pattern: { value: /^\S+@\S+$/i, message: "El email no es válido" },
          })}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Tu Mensaje
        </label>
        <textarea
          id="message"
          className={styles.textarea}
          {...register("message", { required: "El mensaje es requerido" })}
        ></textarea>
        {errors.message && (
          <span className={styles.error}>{errors.message.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="file" className={styles.label}>
          Adjuntar PDF o Imagen
        </label>
        <input
          id="file"
          type="file"
          className={styles.input}
          {...register("file", { required: "El archivo es requerido" })}
        />
        {errors.file && (
          <span className={styles.error}>{errors.file.message}</span>
        )}
      </div>

      <button type="submit" className={styles.button}>
        Enviar
      </button>
    </form>
  );
};

export default ContactForm;

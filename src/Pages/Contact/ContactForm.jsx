import { useForm } from "react-hook-form";
import "./ContactForm.scss";
import { useState } from "react";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [blur, setBlur] = useState("");
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (value === null || value === "") {
      console.log(`${name} is empty or null`);
    } else {
      console.log(`${name}: ${value}`);
    }
  };

  const handleLabel = (name) => {};
  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (value === null || value === "") {
      console.log(`${name} is empty or null on blur`);
      setBlur(name + blur);
    } else {
      console.log(`${name}: ${value} on blur`);
      setBlur(name + blur);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="Form">
      <div className="contact-meta f-bg">
        <div className="cm-tittle">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </div>
        <div className="cm-elements">
          <ul>
            <li>email@email-desing.com</li>
          </ul>
        </div>
      </div>
      <form className="contact-form f-bg" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <input
            id="name"
            type="text"
            className={`input`}
            placeholder="Tu Nombre"
            {...register("name", {
              required: "El nombre es requerido",
              onChange: handleChange,
              onBlur: handleBlur, // Añadir el manejador de cambio aquí
            })}
          />
          <label htmlFor="name" className="label">
            Tu Nombre
          </label>

          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="field">
          <input
            id="email"
            type="email"
            className="input"
            placeholder="Tu email"
            {...register("email", {
              required: "El email es requerido",
              onChange: handleChange,
              onBlur: handleBlur, // Añadir el manejador de cambio aquí
              pattern: {
                value: /^\S+@\S+$/i,
                message: "El email no es válido",
              },
            })}
          />

          <label htmlFor="email" className="label">
            Tu Email
          </label>
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div className="field">
          <textarea
            id="message"
            className="textarea"
            placeholder="Tu mensaje"
            {...register("message", {
              required: "El mensaje es requerido",
              onChange: handleChange,
              onBlur: handleBlur,
            })}
          ></textarea>
          <label htmlFor="message" className="label">
            Tu Mensaje
          </label>
          {errors.message && (
            <span className="error">{errors.message.message}</span>
          )}
        </div>

        <button type="submit" className="button">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

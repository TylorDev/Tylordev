import { useForm } from "react-hook-form";
import "./ContactForm.scss";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    handleSubmit((e) => e.preventDefault())(data);
    const formData = new FormData();
    formData.append("entry.1873119902", data.name);
    formData.append("entry.1965438775", data.email);
    formData.append("entry.1909091615", data.message);

    try {
      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSe90nNoZ9Ro9VquD51WqJwE_yUUJvYTQ3N7WQ_wU0Hbs8lEPw/formResponse",
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="Form">
      {submitted ? (
        <div className="thank-you-message">Gracias por enviar tu mensaje!</div>
      ) : (
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

          <form
            className="contact-form f-bg"
            target="hiddenConfirm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="field">
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Tu Nombre"
                {...register("name", { required: "El nombre es requerido" })}
              />
              <label htmlFor="name" className="label">
                Tu Nombre
              </label>
              {errors.name && (
                <span className="error">{errors.name.message}</span>
              )}
            </div>

            <div className="field">
              <input
                id="email"
                type="email"
                className="input"
                placeholder="Tu email"
                {...register("email", {
                  required: "El email es requerido",
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
      )}
    </div>
  );
};

export default ContactForm;

const Formulario = () => {
  const [submitted, setSubmitted] = useState(false);
  const iframeRef = useRef(null);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    setSubmitted(true);
  };

  const handleIframeLoad = () => {
    if (submitted) {
      navigate(`/projects`);
    }
  };

  return (
    <div>
      <iframe
        name="hiddenConfirm"
        id="hiddenConfirm"
        style={{ display: "none" }}
        onLoad={handleIframeLoad}
        ref={iframeRef}
      ></iframe>
      <form
        action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSe90nNoZ9Ro9VquD51WqJwE_yUUJvYTQ3N7WQ_wU0Hbs8lEPw/formResponse"
        method="post"
        target="hiddenConfirm"
        onSubmit={handleSubmit}
      >
        <input name="entry.1873119902" defaultValue="Ryan Ray" />
        <input name="entry.1965438775" defaultValue="Ryan@gmail.com" />
        <input name="entry.1909091615" defaultValue="hello there!" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

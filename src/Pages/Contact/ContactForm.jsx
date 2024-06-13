/* eslint-disable react/no-unknown-property */
import { useForm } from "react-hook-form";
import "./ContactForm.scss";
import { useState } from "react";

import { Button } from "./../../Components/Button/Button";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Link } from "react-router-dom";
import { Void } from "./../../Components/Void/Void";
const ContactForm = () => {
  const pageName = "Contact";

  const editableContent = FetchDataComponent(pageName);

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

  if (!editableContent) {
    return (
      <div className="Form">
        <div className="Form-conteiner">
          <div className="contact-meta f-bg">
            <Void radius={1} />
          </div>

          <form className="contact-form f-bg">
            <div className="field">
              <Void />
              <label className="label" op="true">
                <Void type={"div"} />
              </label>
            </div>

            <div className="field">
              <Void />
              <label className="label" op="true">
                <Void type={"div"} />
              </label>
            </div>

            <div className="field">
              <Void />
              <label className="label" op="true">
                <Void type={"div"} />
              </label>
            </div>
            <div className="field">
              <label className="label" op="true">
                <Void type={"div"} radius={2} char={9} />
              </label>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="Form">
      {submitted ? (
        <div className="thank-you-message">
          {editableContent.thankYouMessage}
        </div>
      ) : (
        <div className="Form-conteiner">
          <div className="contact-meta f-bg">
            <div className="cm-tittle">{editableContent.contactMeta.title}</div>
            <div className="cm-elements">
              <Link to={`mailto:${editableContent.contactMeta.email}`}>
                {editableContent.contactMeta.email}
              </Link>
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
                placeholder={editableContent.formFields.name.placeholder}
                {...register("name", {
                  required: editableContent.formFields.name.errorMessage,
                })}
              />
              <label htmlFor="name" className="label" op="true">
                {editableContent.formFields.name.label}
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
                placeholder={editableContent.formFields.email.placeholder}
                {...register("email", {
                  required:
                    editableContent.formFields.email.errorMessage.required,
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message:
                      editableContent.formFields.email.errorMessage.invalid,
                  },
                })}
              />
              <label htmlFor="email" className="label" op="true">
                {editableContent.formFields.email.label}
              </label>
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>

            <div className="field">
              {console.log(editableContent.formFields.message)}
              <textarea
                id="message"
                className="textarea"
                placeholder={editableContent.formFields.message.placeholder}
                {...register("message", {
                  required: editableContent.formFields.message.errorMessage,
                })}
              ></textarea>
              <label htmlFor="message" className="label" op="true">
                {editableContent.formFields.message.label}
              </label>
              {errors.message && (
                <span className="error">{errors.message.message}</span>
              )}
            </div>

            <Button
              type="submit"
              text={editableContent.formFields.submitButton}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactForm;

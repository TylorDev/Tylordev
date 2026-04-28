import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiMail, FiSend } from "react-icons/fi";
import { CONTACT_FIELDS, CONTACT_FORM_URL } from "../../lib/api";
import { usePage } from "../../lib/hooks";
import type { ContactPage } from "../../lib/types";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Contact.scss";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { data, loading } = usePage<ContactPage>("Contact");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (form: FormData) => {
    const fd = new FormData();
    fd.append(CONTACT_FIELDS.name, form.name);
    fd.append(CONTACT_FIELDS.email, form.email);
    fd.append(CONTACT_FIELDS.message, form.message);
    try {
      await fetch(CONTACT_FORM_URL, { method: "POST", body: fd, mode: "no-cors" });
      setSubmitted(true);
    } catch (err) {
      console.error("Form submit failed", err);
    }
  };

  if (loading || !data) {
    return (
      <div className="container contact">
        <Skeleton height={48} width="50%" />
        <div style={{ height: 24 }} />
        <Skeleton height={400} radius={20} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container contact contact-success">
        <FiCheckCircle size={64} />
        <h2>{data.thankYouMessage}</h2>
      </div>
    );
  }

  return (
    <div className="contact fadeIn">
      <header className="container contact-head">
        <span className="eyebrow">Get in touch</span>
        <h1 className="section-title gradient-text">Let's build something.</h1>
      </header>

      <div className="container contact-grid">
        <aside className="contact-info glass">
          <h3>{data.contactMeta.title}</h3>
          <a href={`mailto:${data.contactMeta.email}`} className="contact-email">
            <FiMail /> {data.contactMeta.email}
          </a>
          <p>Average reply within 24 hours.</p>
        </aside>

        <form className="contact-form glass" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="contact-field">
            <label htmlFor="name">{data.formFields.name.label}</label>
            <input
              id="name"
              type="text"
              placeholder={data.formFields.name.placeholder}
              {...register("name", { required: data.formFields.name.errorMessage })}
            />
            {errors.name && <span className="contact-error">{errors.name.message}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="email">{data.formFields.email.label}</label>
            <input
              id="email"
              type="email"
              placeholder={data.formFields.email.placeholder}
              {...register("email", {
                required: data.formFields.email.errorMessage.required,
                pattern: { value: /^\S+@\S+$/i, message: data.formFields.email.errorMessage.invalid },
              })}
            />
            {errors.email && <span className="contact-error">{errors.email.message}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="message">{data.formFields.message.label}</label>
            <textarea
              id="message"
              rows={6}
              placeholder={data.formFields.message.placeholder}
              {...register("message", { required: data.formFields.message.errorMessage })}
            />
            {errors.message && <span className="contact-error">{errors.message.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : data.formFields.submitButton} <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
}

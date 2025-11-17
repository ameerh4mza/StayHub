"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSending(true);

    try {
      const res = await fetch("/api/send-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send query");

      toast.success("Query sent successfully!");
      resetField("name");
      resetField("email");
      resetField("message");
    } catch (err) {
      toast.error("Failed to send query. Try again.");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
        Contact Us
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input
          type="text"
          placeholder="Your Name"
          {...register("name", { required: true })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <input
          type="email"
          placeholder="Your Email"
          {...register("email", { required: true })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <textarea
          placeholder="Your Query"
          {...register("message", { required: true })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition resize-none"
          rows={5}
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isSending ? <Loader /> : "Send Query"}
        </button>
      </form>
    </div>
  );
}

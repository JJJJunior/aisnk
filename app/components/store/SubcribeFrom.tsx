"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(5),
});

const SubcribeFrom = () => {
  const [visitorId, setVisitorId] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const id = localStorage.getItem("visitorId") || "";
    setVisitorId(id);
  }, []);

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    // console.log(value);
    // send to server
    const data = {
      email: value.email,
      status: 1,
      visitor_id: visitorId, // add visitor_id if exists
    };
    try {
      const res = await axios.post("/api/subscribe", data);
      if (res.status === 201) {
        toast.success("Subscribed ❤️");
      }
    } catch (err) {
      if (err.status === 409) {
        toast.success("Alreay subscribed");
      }
      //   console.log(err.status);
      // handle error
    } finally {
      // reset form
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 justify-center items-center">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col h-[50px] justify-center">
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-400">
          Subscribe
        </Button>
      </form>
    </Form>
  );
};

export default SubcribeFrom;

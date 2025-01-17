"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = z.object({
    prompt: z.string().min(7,{message:"Prompt must be atleast 7 characters long!"}),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    console.log(values);
  }

  return (
    <div className="w-full p-3 h-dvh flex justify-start items-center flex-col ">
      <div className="w-full border border-red-500 p-3 mt-20">
        <h1 className="text-center font-bold text-white text-4xl">Create</h1>
        <p className="text-white/55 text-center">
          Generate Stunning Images From Text For Free
        </p>
      </div>
      <div className=" flex border border-green-500 w-full h-full gap-3">
        <div className="__form flex-[2] border border-yellow-500 flex justify-center items-start flex-col">
          <p className="text-left">
            Type you prompt below to create any Stunning Visuals
          </p>
          <div className="flex gap-2 w-full ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full   flex gap-2 ">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="a dog and cat marrige in india"
                          className="w-full transition-all border-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Generate</Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="__output flex-[1] border border-yellow-400 bg-white/5  rounded-lg"></div>
      </div>
    </div>
  );
}

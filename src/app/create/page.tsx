"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function Page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = z.object({
    prompt: z
      .string()
      .min(7, { message: "Prompt must be atleast 7 characters long!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("api/images", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data.url);
      setOutputImg(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-2 h-dvh flex justify-start items-center flex-col ">
      <div className="w-full  p-3 mt-20">
        <h1 className="text-center font-bold text-white text-4xl">Create</h1>
        <p className="text-white/55 text-center">
          Generate Stunning Images From Text For Free
        </p>
      </div>
      <div className=" flex  w-full h-full gap-3">
        <div className="__form flex-[2]  flex justify-center items-start flex-col">
          <p className="text-left">
            Type you prompt below to create any Stunning Visuals
          </p>
          <div className="flex gap-2 w-full ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full   flex gap-2 "
              >
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
                <Button loading={loading} type="submit">
                  Generate
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="__output flex-[1]  bg-white/5  rounded-lg relative overflow-hidden">
          {outputImg ? (
            <Image
              alt="output"
              className="w-full h-full object-contain"
              src={outputImg}
              width={300}
              height={300}
            />
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
                Enter your prompt and hit generate
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

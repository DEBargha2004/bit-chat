"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { bucket, db, realtimeDB } from "../../../firebase.config";
import useGlobalAppState from "@/hooks/use-global-app-state";
import { useToast } from "@/components/ui/use-toast";
import { ref, uploadBytes } from "firebase/storage";
import { useThrottle } from "@uidotdev/usehooks";
import { ref as databaseRef, update } from "firebase/database";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Image, Paperclip, Send, Video, X } from "lucide-react";
import MessageComponent from "./MessageComponent";
import { type MessageComponentType } from "@/providers/global-app-state-provider";
import PreviewComponent from "./PreviewComponent";
import optimizeImage from "@/lib/optimize-image";

export type PreviewFileType = "image" | "video" | "audio";

export default function MessageInput({ className }: { className?: string }) {
  const [message, setMessage] = useState("");
  const throttledMessage = useThrottle(message, 2000);
  const [file, setFile] = useState<{
    type: MessageComponentType["type"] | "";
    data: string;
    storagePath: string;
  }>({ type: "", data: "", storagePath: "" });
  const { _id } = useGlobalAppState();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    type: MessageComponentType["type"],
    storagePath: string,
    max_size: number,
    label: string,
  ) {
    const file = e.target.files;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        if (file[0].size > max_size) {
          toast({
            title: `${label} too large`,
            description: `${label} must be less than ${
              max_size / (1024 * 1024)
            }MB in size`,
          });
          imageInputRef.current!.value = "";
          videoInputRef.current!.value = "";
        } else {
          setFile({
            type,
            data: reader.result as string,
            storagePath,
          });
        }
      };
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!_id || !(message || file.data)) return;

    const message_container = [];
    if (file.data) {
      const file_id = crypto.randomUUID();
      message_container.push({
        type: file.type,
        data: file_id,
      });
      await uploadBytes(
        ref(bucket, `${file.storagePath}/${file_id}`),
        //@ts-ignore
        Buffer.from(
          file.type === "image"
            ? (optimizeImage(file.data).split(",")[1] as string)
            : (file.data.split(",")[1] as string),
          "base64",
        ),
      );
    }

    if (message) {
      message_container.push({
        type: "text",
        data: message,
      });
    }

    await addDoc(collection(db, "messages"), {
      messages: message_container,
      createdAt: serverTimestamp(),
      user_id: _id,
    });

    setMessage("");
    setFile({ type: "", data: "", storagePath: "" });
  }

  function handleMessageChange(e: ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }

  useEffect(() => {
    if (!_id) return;
    const userRefRealtimeDB = databaseRef(realtimeDB, "active_users/" + _id);
    if (throttledMessage !== message) {
      update(userRefRealtimeDB, {
        typing: true,
      });
    } else {
      update(userRefRealtimeDB, {
        typing: false,
      });
    }
  }, [throttledMessage, message, _id]);

  return (
    <form className={cn("w-full relative", className)} onSubmit={handleSubmit}>
      <div
        className={cn(
          "absolute bottom-full left-2 dark:bg-slate-700 bg-slate-300 rounded w-full transition-all overflow-hidden",
          file.data ? "h-fit  p-2" : "h-0",
        )}
      >
        <PreviewComponent type={file.type as PreviewFileType} url={file.data} />

        <X
          className="absolute top-1 right-2 p-1 hover:bg-card rounded transition-all cursor-pointer"
          onClick={() => setFile({ data: "", type: "", storagePath: "" })}
        />
      </div>

      <input
        className="h-full w-full resize-none rounded-md p-1 pl-[50px] pr-[100px] bg-background ring-1 ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  "
        ref={inputRef}
        value={message}
        onChange={handleMessageChange}
      />
      <div className="absolute w-[100px] h-full flex justify-start items-center gap-3 top-0 right-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className=" px-2">
              <Paperclip className="" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div>
              <ul className="space-y-1">
                <li>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        "image",
                        "images",
                        1024 * 1024,
                        "Image",
                      )
                    }
                    className="hidden"
                    id="image"
                    accept="image/*"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer w-[100px] p-1 transition-all rounded hover:bg-muted flex justify-start gap-2 items-center"
                  >
                    <Image className="h-5 w-5" />
                    Image
                  </label>
                </li>
                <li className="cursor-pointer w-[100px] p-1 transition-all rounded hover:bg-muted flex justify-start gap-2 items-center">
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        "video",
                        "videos",
                        8 * 1024 * 1024,
                        "Video",
                      )
                    }
                    className="hidden"
                    accept="video/*"
                    id="video"
                  />
                  <label
                    htmlFor="video"
                    className="cursor-pointer w-[100px] p-1 transition-all rounded hover:bg-muted flex justify-start gap-2 items-center"
                  >
                    <Video className="h-5 w-5" />
                    Video
                  </label>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          type="submit"
          disabled={!message && !file.data}
          variant={"ghost"}
          className="px-2 hover:bg-muted"
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}

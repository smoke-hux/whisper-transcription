"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [theFile, setTheFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    // handle the case when there is no file that is selected
    setTheFile(file);
  };
  /**
 *theFile: for just geting the file that is input by the user
 isLoading: for adding a loading state so that we can show a simple loading text while getting the response

 response: for the actual response that we get back. we'll render in on outpage.
 we're using handleFileChange to set out the File stte varuable to whatever the user upleads. 
 if thre's no file, the function does not give back anything
 *
 * @returns 
 */

  const callGetTranscription = async () => {
    setIsLoading(true);

    if (!theFile) {
      // Handle the case when no file is selected
      setIsLoading(false);
      return;
    }
    const formData = new FormData(); // create a form data object
    formData.set("file", theFile);

    try {
      const response = await fetch("/api", {
        method: "POST", // send the form data
        body: formData, // send the form data
      });
      if (response.ok) {
        // handle the case when the file is successfully response
        console.log("file uploaded successfully");
      } else {
        // handle the error
        console.error(
          "An error occured while uploading the file for transcription"
        );
      }

      // handle the response
      const data = await response.json(); // get the response
      setResponse(data.output.text);
    } catch (error) {
      // handle the error
      console.error(
        "An error occured while uploading the file for transcription",
        error
      );
    }

    setTheFile(null);
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-5xl font-sans">Transcription</h1>

        <div className="flex  h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl">
          <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
            <input
              type="file"
              accept=".wav, .mp3"
              onChange={handleFileChange}
              placeholder="audio file"
            />

            <div className="w-[90%] h-max border-2 break-words">
              {isLoading ? "Loading..." : response ? response : ""}
            </div>
          </div>
          <div className="relative  w-[80%] bottom-4 flex justify-center">
            <button
              onClick={callGetTranscription}
              className="w-max bg-blue-500 px-4 py-2 rounded-2xl"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

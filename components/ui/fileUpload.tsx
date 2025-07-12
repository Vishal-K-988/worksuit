// fileUpload.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./button";
import { ChangeEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function InputFile() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const getUploadURLMutation = useMutation(api.myFunctions.UploadURL); // Renamed for clarity

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  async function handleClick() {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log("No files selected for upload.");
      return;
    }

    // Iterate over each file in the FileList
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const filename = file.name;
      const filesize = file.size;
      const filetype = file.type;

      console.log(`Processing file ${i + 1}/${selectedFiles.length}: ${filename}`);
      console.log("File type : ", filetype);

      try {
        // Call the mutation function for each file to get its unique pre-signed URL
        // Make sure your Convex mutation 'UploadURL' returns an object like { url: string }
        const UploadedURL  = await getUploadURLMutation({ // Destructure url from the response
          filename: filename,
          filesize: filesize,
          filetype: filetype,
        });

        console.log(`Pre-signed URL for ${filename} is: `, UploadedURL);

        if (UploadedURL) {
          // Upload the file using the pre-signed URL
          const response = await fetch(UploadedURL, {
            method: "PUT",
            body: file, // Use the current file from the loop
            headers: {
              "Content-Type": filetype,
            },
          });

          if (response.ok) {
            console.log(`File '${filename}' uploaded successfully! Response: `, response);
          } else {
            console.error(`Failed to upload file '${filename}'. Status: ${response.status}, Text: ${response.statusText}`);
            const errorBody = await response.text();
            console.error("Error response body:", errorBody);
          }
        } else {
          console.error(`Upload URL not found for file '${filename}'. Skipping upload.`);
        }
      } catch (error) {
        console.error(`Error uploading file '${filename}':`, error);
      }
    }
    console.log("Finished processing all selected files.");
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-3 px-2 my-2 py-2">
      <Label htmlFor="File">Files</Label>
      <Input id="File" type="file" multiple onChange={handleChange} />{" "}
      {/* Ensure 'multiple' attribute is present */}
      <Button className="ring-white ring-1" onClick={handleClick}>
        Upload All Files
      </Button>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3>Selected Files ({selectedFiles.length}):</h3>
          <ul>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index}>
                {file.name} ({file.size} bytes, {file.type})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
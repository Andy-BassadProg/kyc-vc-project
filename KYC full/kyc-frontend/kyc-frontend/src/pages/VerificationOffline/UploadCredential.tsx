import FileDropzone from "@/components/forms/FileDropzone";

// Zone de depot du fichier credential a verifier (equiv. python3 verifier_offline_final.py demo_citoyen.json)
export default function UploadCredential({ onFile }: { onFile: (file: File) => void }) {
  return (
    <FileDropzone
      onFile={onFile}
      label="Déposez le fichier credential (ex: credential_<niu>.json ou .jwt brut)"
    />
  );
}

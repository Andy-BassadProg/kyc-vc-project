const LABELS: Record<string, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  birthDate: "Date de naissance",
  city: "Lieu de naissance",
  cin: "NIN",
  niu: "NIU",
  nationality: "Nationalité",
};

// Tableau cle/valeur du credentialSubject (firstName, lastName, birthDate, city, cin, niu, nationality)
export default function CredentialSubjectTable({ subject }: { subject: Record<string, unknown> }) {
  return (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {Object.entries(subject).map(([key, value]) => (
          <tr key={key} className="border-b last:border-0">
            <td className="py-1.5 pr-4 text-gray-500">{LABELS[key] || key}</td>
            <td className="py-1.5 font-medium">{String(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

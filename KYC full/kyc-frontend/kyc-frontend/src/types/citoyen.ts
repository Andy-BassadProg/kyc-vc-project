export interface Citoyen {
  prenom: string;
  nom: string;
  nin: string;
  niu: string;
  date_naissance: string; // JJ/MM/AAAA
  lieu_naissance: string;
  nationalite: string;
  genre: "M" | "F";
  pere: string;
  mere: string;
  profession: string;
  adresse: string;
  document: string;
  num_document: string;
  photo_hash?: string;
  empreinte_hash?: string;
}


export interface CategorieValue {
    name: string;
    color: string;
};

export interface Categorie {
    name: string;
    values: CategorieValue[];
}

export type Categories = Categorie[]
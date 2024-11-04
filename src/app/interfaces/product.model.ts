import { Ingredient } from "./ingredient.model";
export interface Product {
  
  idproducts: string;
  name: string;
  price: number;
  description: string;
  category_idcategory: string;
  name_category:string;
  ingredients: Ingredient[]
}

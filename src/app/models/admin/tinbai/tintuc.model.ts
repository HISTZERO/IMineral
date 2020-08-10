import { DeserializableModel } from "../deserializable.model";

export class OutputTintucModel implements DeserializableModel {
  id: number;
  author: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  metaDescription: string;
  metaKeywords: string;
  categoryId: string;
  messageType: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputTintucModel {
  id: number;
  author: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  metaDescription: string;
  metaKeywords: string;
  categoryId: string;
  messageType: string;
}

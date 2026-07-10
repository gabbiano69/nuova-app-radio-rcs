import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Esportazione robusta per prevenire errori 'undefined' durante il caricamento
export const PlaceHolderImages: ImagePlaceholder[] = data?.placeholderImages || [];

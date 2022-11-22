export type Breeds = {
  id: number;
  name: string;
  subBreeds: string[];
};

export type BreedImage = {
  name: string;
  images: string[];
};

export type SubBreedPoster = {
  breedName: string;
  subBreedName: string;
};

export type State = {
  breeds: Breeds[];
  breedImages: BreedImage[];
  status: string;
  error: string | undefined;
};

export type FetchImagesError = {
  message: string;
};

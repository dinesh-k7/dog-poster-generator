import { Breeds } from '../redux/features/dog-poster/types';

export const getSubBreeds = (
  breeds: Breeds[],
  selectedBreedName: string,
  selectedRowIndex: number,
) => {
  const findSubBreed = breeds.find(
    (breed) => breed.name === selectedBreedName && breed.subBreeds.length,
  );
  if (findSubBreed) {
    return findSubBreed.subBreeds.map((subBreedName: string, idx: number) => {
      return {
        id: selectedRowIndex * (idx + 1) * 7777,
        name: subBreedName,
      };
    });
  }
};

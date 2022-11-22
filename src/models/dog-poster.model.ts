import { ReactElement } from 'react';

export interface SelectedBreed {
  breedName: string;
  subBreedName: string;
  selectedBreedRow: number;
  activeRow: boolean;
}

interface BreedDetail {
  labelText: string;
  type: string;
  options: { id: number; name: string }[];
  size: 'small';
  disabled: boolean;
}

export interface RowsData {
  breed: BreedDetail;
  subBreed: BreedDetail;
  images: string[];
  action: ReactElement | string;
  selectedSubBreedName?: string;
  selectedBreedName?: string;
}

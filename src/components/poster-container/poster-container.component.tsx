import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';

import './poster-container.component.scss';
import SelectBoxComponent from '../common/select-box/select-box.component';
import { BreedImage, Breeds } from '../../redux/features/dog-poster/types';
import {
  fetchBreedPosters,
  fetchSubBreedPosters,
  getBreedPosters,
  getDogPosterStatus,
} from '../../redux/features/dog-poster/dogPosterSlice';
import { useTypedSelector } from '../../redux/store';
import { getSubBreeds } from '../../utils';
import ModalComponent from '../common/modal/modal.component';
import { RowsData, SelectedBreed } from '../../models/dog-poster.model';
import { LoaderComponent } from '../common/loader/loader.component';

interface Props {
  breeds: Breeds[];
}

const PosterContainerComponent: React.FC<Props> = ({ breeds }) => {
  const initialRowsData: RowsData[] = [
    {
      breed: {
        labelText: 'Breed',
        type: 'select',
        options: breeds,
        size: 'small',
        disabled: false,
      },
      subBreed: {
        labelText: 'Sub Breed',
        type: 'select',
        options: [],
        size: 'small',
        disabled: false,
      },
      images: [],
      action: '',
    },
    {
      breed: {
        labelText: 'Breed',
        type: 'select',
        options: breeds,
        size: 'small',
        disabled: false,
      },
      subBreed: {
        labelText: 'Sub Breed',
        type: 'select',
        options: [],
        size: 'small',
        disabled: false,
      },
      images: [],
      action: <Icon color="primary">add_circle</Icon>,
    },
  ];
  const breedPosters = useTypedSelector(getBreedPosters);
  const [rowsData, setRowsData] = useState(initialRowsData);
  const [selectedBreed, setSelectedBreed] = useState([] as SelectedBreed[]);
  const [showModal, setShowModal] = useState(false);
  const status = useTypedSelector(getDogPosterStatus);

  useEffect(() => {
    const findActiveBreedRow = selectedBreed.find((breed) => breed.activeRow);
    if (findActiveBreedRow) {
      const { breedName, subBreedName, selectedBreedRow } = findActiveBreedRow;
      const findPoster =
        breedPosters.find(
          (poster: { name: string }) => poster.name === subBreedName,
        ) ||
        breedPosters.find(
          (poster: { name: string }) => poster.name === breedName,
        );
      if (findPoster) {
        const subBreeds = getSubBreeds(breeds, breedName, selectedBreedRow + 1);

        // State update to display the subBreed and number of images
        setRowsData((prevValue) => {
          return prevValue.map((item, itemIndex) => {
            if (itemIndex === selectedBreedRow) {
              return {
                ...item,
                images: findPoster.images as never,
                subBreed: {
                  ...item.subBreed,
                  options: subBreeds || [],
                } as never,
              };
            } else {
              return item;
            }
          });
        });
      }
    }
  }, [breedPosters]);

  const dispatch = useDispatch();

  // Function to handle the breed/sub-breed drop down changes to update the state and invoke Dogs API.
  const handleBreedChange = (
    selectedBreedName: string,
    selectedSubBreedName: string,
    rowIndex: number,
  ) => {
    const findActiveBreedRow = selectedBreed.find(
      (breed) => breed.activeRow && breed.selectedBreedRow === rowIndex,
    );
    // Set Selected Breed state, if the combination and state is not available
    if (!findActiveBreedRow && !selectedBreed.length) {
      const d = [
        {
          breedName: selectedBreedName,
          subBreedName: selectedSubBreedName,
          activeRow: true,
          selectedBreedRow: rowIndex,
        },
      ];

      setSelectedBreed(d);
    }
    // If the selected combination is present in State, based on the selected row update the state
    else if (!findActiveBreedRow && selectedBreed.length) {
      const c = selectedBreed.map((breed) => {
        return {
          ...breed,
          activeRow: false,
        };
      });
      const findIndex = c.findIndex(
        (breed) => breed.selectedBreedRow === rowIndex,
      );

      if (findIndex !== -1) {
        c[findIndex] = {
          breedName: selectedBreedName,
          subBreedName: selectedSubBreedName,
          activeRow: true,
          selectedBreedRow: rowIndex,
        };
      } else {
        c.push({
          breedName: selectedBreedName,
          subBreedName: selectedSubBreedName,
          activeRow: true,
          selectedBreedRow: rowIndex,
        });
      }
      setSelectedBreed(c);
    }
    // If the combination is present in the state for the selected row, then set activeRow as true
    else if (selectedBreed.length) {
      setSelectedBreed((prevValue) => {
        return prevValue.map((item) => {
          if (item.selectedBreedRow === rowIndex) {
            return {
              ...item,
              breedName: selectedBreedName ? selectedBreedName : item.breedName,
              subBreedName: selectedSubBreedName,
              activeRow: true,
            };
          } else {
            return {
              ...item,
              breedName: selectedBreedName ? selectedBreedName : item.breedName,
              subBreedName: selectedSubBreedName,
              activeRow: false,
            };
          }
        });
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let findBreed: any;
    // Find the breed poster from redux store based on the Sub-breed/Breed combination
    if (selectedSubBreedName) {
      findBreed = breedPosters.find(
        (poster: BreedImage) => poster.name === selectedSubBreedName,
      );
    } else if (selectedBreedName) {
      findBreed = breedPosters.find(
        (poster: BreedImage) => poster.name === selectedBreedName,
      );
    }

    // Get sub-breeds list based on the selected breed
    const subBreeds = getSubBreeds(breeds, selectedBreedName, rowIndex + 1);

    // If the selected breed is present in breedPosters store, update the dog poster counter without calling API again
    if (findBreed && findBreed.name === selectedBreedName) {
      setRowsData((prevValue) => {
        return prevValue.map((item, itemIndex) => {
          if (itemIndex === rowIndex) {
            return {
              ...item,
              images: findBreed.images,
              subBreed: {
                ...item.subBreed,
                options: subBreeds || [],
              } as never,
            };
          } else {
            return item;
          }
        });
      });
    }
    // If the selected breed/sub-breed is not present in breedsPoster store, Invoke API accordingly
    else {
      if (selectedSubBreedName) {
        dispatch(
          fetchSubBreedPosters({
            breedName: selectedBreedName,
            subBreedName: selectedSubBreedName,
          }) as never,
        );
      } else {
        dispatch(fetchBreedPosters(selectedBreedName) as never);
      }
    }
  };

  return (
    <div className="poster-table">
      {status === 'loading' ? <LoaderComponent /> : ''}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Breed</TableCell>
              <TableCell align="center">Sub Breed</TableCell>
              <TableCell align="center">Image count</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData &&
              rowsData.length &&
              rowsData.map((row, rowIndex) => {
                const { breed, subBreed, images, action } = row || {};
                return (
                  <TableRow key={rowIndex}>
                    {breed && breed.type === 'select' ? (
                      <TableCell>
                        <SelectBoxComponent
                          index={rowIndex + 10}
                          options={breed.options}
                          labelText={breed.labelText}
                          handleChange={(data) => {
                            const { target } = data;
                            if (target.value) {
                              row.selectedBreedName = target.value;
                              handleBreedChange(target.value, '', rowIndex);
                            }
                          }}
                          size={breed.size as 'small'}
                          disabled={breed.disabled}
                        />
                      </TableCell>
                    ) : (
                      ''
                    )}

                    {subBreed && subBreed.type === 'select' ? (
                      <TableCell>
                        <SelectBoxComponent
                          index={rowIndex + 2000}
                          options={subBreed.options}
                          labelText={subBreed.labelText}
                          handleChange={(data) => {
                            const { target } = data;
                            if (target.value) {
                              row.selectedSubBreedName = target.value;
                              handleBreedChange(
                                row.selectedBreedName
                                  ? row.selectedBreedName
                                  : '',
                                target.value,
                                rowIndex,
                              );
                            }
                          }}
                          size={subBreed.size as 'small'}
                          disabled={subBreed.disabled}
                        />
                      </TableCell>
                    ) : (
                      ''
                    )}

                    <TableCell align="center">{images.length}</TableCell>
                    <TableCell
                      align="center"
                      onClick={() =>
                        setRowsData([...rowsData, initialRowsData[1]])
                      }
                    >
                      {action ? action : ''}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {showModal ? (
        <ModalComponent
          showModal={showModal}
          handleModalClose={() => setShowModal(false)}
          rowsData={rowsData}
        />
      ) : (
        <Button
          variant="outlined"
          color="primary"
          className="generate-button"
          disabled={selectedBreed.length ? false : true}
          onClick={() => setShowModal(true)}
        >
          Generate Poster
        </Button>
      )}
    </div>
  );
};

export default PosterContainerComponent;

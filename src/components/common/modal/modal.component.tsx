/* eslint-disable react/prop-types */
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { RowsData } from '../../../models/dog-poster.model';

interface Props {
  showModal: boolean;
  rowsData: RowsData[];
  handleModalClose: () => void;
}

const lightTheme = createTheme({ palette: { mode: 'light' } });

const ModalComponent: React.FC<Props> = ({
  showModal,
  rowsData,
  handleModalClose,
}) => {
  const [open, setOpen] = useState(showModal);
  const [scroll] = useState<DialogProps['scroll']>('paper');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dogPosters: any[];

  const handleClose = () => {
    setOpen(false);
    handleModalClose();
  };

  if (rowsData && rowsData.length) {
    rowsData = rowsData.filter((r) => r.images.length);
    dogPosters = rowsData
      .map((rw) => {
        return (
          rw.images &&
          rw.images.length &&
          rw.images.map((img) => {
            return {
              breedName: rw.selectedBreedName,
              subBreedName: rw.selectedSubBreedName,
              url: img,
            };
          })
        );
      })
      .flat()
      .sort(() => Math.random() - 0.8);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'lg'}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Dog Posters</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <Grid container>
            {[lightTheme].map((theme, index) => (
              <Grid item key={index}>
                <ThemeProvider theme={theme}>
                  <Box
                    sx={{
                      bgcolor: 'background.default',
                      display: 'grid',
                      gridTemplateColumns: {
                        md: '1fr 1fr 1fr',
                        lg: '1fr 1fr 1fr 1fr',
                      },
                      gap: 2,
                    }}
                  >
                    {dogPosters && dogPosters.length
                      ? dogPosters.map((poster, index) => (
                          <Card key={index}>
                            <CardMedia
                              component="img"
                              height="140"
                              width={150}
                              image={poster.url}
                            />
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h6"
                                component="span"
                                textTransform={'capitalize'}
                              >
                                {poster.breedName}
                                {poster.subBreedName
                                  ? ` - ${poster.subBreedName}`
                                  : ''}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))
                      : 'No Poster to display'}
                  </Box>
                </ThemeProvider>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalComponent;

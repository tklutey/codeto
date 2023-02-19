import React, { ReactElement, useState } from 'react';
import Layout from '../../../layout';
import { trpc } from 'utils/trpc';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

const mapToRows = (data: any) => {
  return data.flatMap((unit: any) => {
    return unit.standards.map((standard: any) => {
      return {
        id: standard.standard_id,
        unit: standard.unit_name,
        topic: standard.topic_description,
        objective: standard.objective_description,
        standard: standard.standard_description
      };
    });
  });
};
const ListStandardsPage = () => {
  const [rows, setRows] = useState<any[]>([]);
  const router = useRouter();
  trpc.useQuery(['learningStandards.getCourseStandards'], {
    onSuccess: (data) => {
      setRows(mapToRows(data));
    }
  });
  const deleteStandard = trpc.useMutation('learningStandards.delete');
  return (
    <>
      <Box display={'flex'} justifyContent={'flex-end'} sx={{ marginY: '20px' }}>
        <Button variant={'contained'} onClick={() => router.push('/admin/standard/new')}>
          New Standard
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="right">Topic</TableCell>
              <TableCell align="right">Objective</TableCell>
              <TableCell align="right">Standard</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.standard} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.unit}
                </TableCell>
                <TableCell align="right">{row.topic}</TableCell>
                <TableCell align="right">{row.objective}</TableCell>
                <TableCell align="right">{row.standard}</TableCell>
                <TableCell align="right">
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ marginX: '5px' }}
                    onClick={() => router.push('/admin/standard/edit/' + row.id)}
                  >
                    Edit
                  </Button>
                  <Button color="error" variant="outlined" sx={{ marginX: '5px' }} onClick={() => deleteStandard.mutateAsync({ id })}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
ListStandardsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ListStandardsPage;

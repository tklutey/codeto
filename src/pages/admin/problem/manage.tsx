import { Box, Button } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../layout';
import { trpc } from '../../../utils/trpc';

const mapToRows = (data: any) => {
  return data.map((problem: any) => {
    return {
      id: problem.id,
      title: problem.title,
      standards: problem.learning_standards.map((standard: any) => standard.standard_id)
    };
  });
};
const ManageProblemsPage = () => {
  const [rows, setRows] = useState<any[]>([]);
  const router = useRouter();
  trpc.useQuery(['codingProblem.getByCourseId', 2], {
    onSuccess: (data) => {
      setRows(mapToRows(data));
    }
  });
  return (
    <>
      <Box display={'flex'} justifyContent={'flex-end'} sx={{ marginY: '20px' }}>
        <Button variant={'contained'} onClick={() => router.push('/admin/problem/new')}>
          New Standard
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Standards</TableCell>
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
                  {row.title}
                </TableCell>
                <TableCell align="right">
                  {row.standards.map((standard: number, index: number) => (
                    <a key={index} href={'/admin/standard/edit/' + standard}>
                      {standard}
                    </a>
                  ))}
                </TableCell>
                <TableCell align="right">
                  <Button color="primary" variant="contained" sx={{ marginX: '5px' }} onClick={() => {}}>
                    Edit
                  </Button>
                  <Button color="error" variant="outlined" sx={{ marginX: '5px' }} onClick={() => {}}>
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

ManageProblemsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ManageProblemsPage;

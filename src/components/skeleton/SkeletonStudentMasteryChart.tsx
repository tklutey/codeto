import { Grid, Skeleton } from '@mui/material';

const SkeletonStudentMasteryChart = (props: Props) => {
  const { rows } = props;

  return (
    <div>
      {Array(rows)
        .fill(0)
        .map((row, index) => (
          <div key={index}>
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item sm zeroMinWidth>
                  <Skeleton variant="text" width={120} />
                </Grid>
                <Grid item>
                  <Skeleton variant="text" width={50} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={10} sx={{ marginBottom: '10px' }} />
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}
    </div>
  );
};

type Props = {
  rows: number;
};

export default SkeletonStudentMasteryChart;

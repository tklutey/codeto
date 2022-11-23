import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { trpc } from 'utils/trpc';

const CodingProblemSkillChooser = ({ setBasisIds }: Props) => {
  const [checked, setChecked] = React.useState<number[]>([]);

  const courseStandards = trpc.useQuery(['knowledgeState.getLearningStandardsForCourse']);

  const handleToggle = (value: number, standard: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      setBasisIds((prevBasisIds: number[]) => {
        if (!prevBasisIds.includes(standard.basis_id)) {
          return [...prevBasisIds, standard.basis_id];
        } else {
          return prevBasisIds;
        }
      });
    } else {
      newChecked.splice(currentIndex, 1);
      setBasisIds((prevBasisIds: number[]) => {
        // remove standard.basis_id from prevBasisIds
        return prevBasisIds.filter((basisId) => basisId !== standard.basis_id);
      });
    }

    setChecked(newChecked);
  };

  if (courseStandards.data && courseStandards.data.length > 0) {
    const unitOneStandards = courseStandards.data[0].standards;
    const sortedUnitOneStandards = unitOneStandards
      ? unitOneStandards
          .map((standard) => {
            const topicCodeString = standard.topic_code;
            const topicCodeNumeric = parseInt(topicCodeString.charAt(topicCodeString.length - 1));
            return { ...standard, topicCodeNumeric };
          })
          .sort((a, b) => a.topicCodeNumeric - b.topicCodeNumeric)
      : null;
    if (sortedUnitOneStandards) {
      return (
        <List
          sx={{
            width: '100%',
            maxWidth: 900,
            maxHeight: 300,
            overflow: 'auto',
            bgcolor: 'background.paper'
          }}
        >
          {sortedUnitOneStandards.map((value, index) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={index} disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(index, value)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value.topic_code}: ${value.objective_description}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      );
    }
  }
  return <div> Loading... </div>;
};

type Props = {
  setBasisIds: (basisIds: (prevBasisIds: number[]) => any[]) => void;
};

export default CodingProblemSkillChooser;

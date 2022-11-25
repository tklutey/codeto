import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { trpc } from 'utils/trpc';

const CodingProblemSkillChooser = ({ setBasisIds }: Props) => {
  const [standards, setStandards] = useState<any[]>([]);

  const transformStandards = (data: any) => {
    if (data && data.length > 0) {
      const unitOneStandards = data[0].standards;
      const sortedUnitOneStandards = unitOneStandards
        ? unitOneStandards
            .map((standard: any) => {
              const standardCodeString = standard.standard_code;
              const standardCodeNumeric = parseInt(standardCodeString.charAt(standardCodeString.length - 1));
              return { ...standard, standardCodeNumeric };
            })
            .sort((a: any, b: any) => a.standardCodeNumeric - b.standardCodeNumeric)
        : null;
      if (sortedUnitOneStandards) {
        const a = sortedUnitOneStandards.map((standard: any) => {
          if (standard.standard_id > 1) {
            return {
              ...standard,
              dependencies: [standard.standard_id - 1]
            };
          }
          return standard;
        });
        setStandards(a);
      }
    }
  };

  trpc.useQuery(['learningStandards.getCourseStandards'], { onSuccess: transformStandards });

  const handleToggle = (value: number, standard: any) => () => {
    const isChecked = standard.isChecked ? !standard.isChecked : true;
    const standardIndex = standards.findIndex((s) => s.standard_id === standard.standard_id);
    const modifiedStandard = { ...standard, isChecked };
    const newStandards = [...standards];
    newStandards[standardIndex] = modifiedStandard;
    setStandards(newStandards);
  };

  if (standards && standards.length > 0) {
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
        {standards.map((value: any, index: number) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(index, value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={value.isChecked === true ? true : false}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value.topic_code} | ${value.standard_code} - ${value.standard_description}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  }
  return <div> Loading... </div>;
};

type Props = {
  setBasisIds: (basisIds: (prevBasisIds: number[]) => any[]) => void;
};

export default CodingProblemSkillChooser;

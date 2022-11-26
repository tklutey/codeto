import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const CodingProblemSkillChooser = ({ standards, setStandards }: Props) => {
  const handleToggle = (value: number, standard: any) => () => {
    // handle toggled standard
    const isChecked = standard.isChecked ? !standard.isChecked : true;
    const standardIndex = standards.findIndex((s) => s.standard_id === standard.standard_id);
    const modifiedStandard = { ...standard, isChecked };
    const newStandards = [...standards];
    newStandards[standardIndex] = modifiedStandard;

    // handle dependencies
    const dependencies = standard.dependencies;
    if (dependencies) {
      dependencies.forEach((dependency: number) => {
        const dependencyIndex = standards.findIndex((s) => s.standard_id === dependency);
        const dependencyStandard = standards[dependencyIndex];
        const isDependencyChecked = dependencyStandard.isChecked ? !dependencyStandard.isChecked : true;
        const isDependencyDisabled = dependencyStandard.isDisabled ? !dependencyStandard.isDisabled : true;
        const modifiedDependency = {
          ...dependencyStandard,
          isChecked: isDependencyChecked,
          isDisabled: isDependencyDisabled
        };
        newStandards[dependencyIndex] = modifiedDependency;
      });
    }
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
                    disabled={value.isDisabled === true ? true : false}
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
  standards: any[];
  setStandards: (standards: any[]) => void;
};

export default CodingProblemSkillChooser;

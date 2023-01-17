
import { Box, TextField, FormGroup, FormControlLabel, Checkbox, FormControl } from '@mui/material';

export default function Field(props) {

  return (
    <Box>
      <TextField fullWidth name={props.name} label={props.label} variant="outlined" value={props.field.value} onChange={props.handleChange} />
      <FormGroup>
        <FormControlLabel control={<Checkbox name={props.name} checked={props.field.editable} onChange={props.handleChangeEditable} />} label="Editable" />
      </FormGroup>
    </Box>
  )
}

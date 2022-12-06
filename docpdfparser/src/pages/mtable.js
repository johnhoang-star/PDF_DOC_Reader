import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'No', width: 100,editable : false },
  { field: 'level', headerName: 'Level', width: 100,editable: true },
  { field: 'word', headerName: 'Word', width: 150,editable: true },
  { field: 'pronounciation', headerName: 'Pronounciation', width: 150,editable: true },
  { field: 'meaning', headerName: 'Meaning', width: 150,editable: true },
  { field: 'mnemonics', headerName: ' Mnemocis', width: 150,editable: true },
  { field: 'counts', headerName: 'Frequency', width: 100,editable: true },
  {
    field: 'define',
    headerName: 'Original Examples',
    width: 400,
    editable: true
  }
];



export default function DataTable(props) {
  const rows = props.data

  return (
    <div style={{ height: 600,width:'100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
      />
    </div>
  );
}